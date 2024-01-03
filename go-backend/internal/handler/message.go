package handler

import (
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

var (
	TemplateID1             = os.Getenv("TEMPLATE_ID_1")
	TempalteID2             = os.Getenv("TEMPLATE_ID_2")
	WEIXIN_API_SEND_MESSAGE = "https://api.weixin.qq.com/cgi-bin/message/subscribe/send"
)

func checkWechatSignature(c *gin.Context, token string) bool {
	signature := c.Query("signature")
	timestamp := c.Query("timestamp")
	nonce := c.Query("nonce")

	strs := []string{token, timestamp, nonce}
	sort.Strings(strs)
	str := strings.Join(strs, "")

	h := sha1.New()
	h.Write([]byte(str))
	sha1Str := fmt.Sprintf("%x", h.Sum(nil))

	return sha1Str == signature
}

func handleWechatValidation(c *gin.Context) {
	const token = "123" // 这里填写你的Token

	if checkWechatSignature(c, token) {
		echostr := c.Query("echostr")
		log.Println("echostr:", echostr)
		c.String(http.StatusOK, echostr)
	} else {
		c.String(http.StatusForbidden, "验证失败")
	}
}

type SubscriptionRequest struct {
	ToUserName   string `json:"ToUserName"`
	FromUserName string `json:"FromUserName"`
	CreateTime   string `json:"CreateTime"`
	MsgType      string `json:"MsgType"`
	Event        string `json:"Event"`
	Action       string `json:"action"` // 新增字段，用于检查路径配置
	List         []struct {
		TemplateId            string `json:"TemplateId"`
		SubscribeStatusString string `json:"SubscribeStatusString"`
		PopupScene            string `json:"PopupScene"`
	} `json:"List"`
}

func SetSubscription(c *gin.Context) {
	log.Println("request:", c.Request)
	c.JSON(http.StatusOK, "success")
	// var request SubscriptionRequest
	// if err := c.ShouldBindJSON(&request); err != nil {
	// 	c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	// 	return
	// }

	// // 如果是检查容器路径的请求
	// if request.Action == "CheckContainerPath" {
	// 	c.String(http.StatusOK, "success")
	// 	return
	// }

	// // 订阅成功
	// log.Println("request:", request)

	// c.JSON(http.StatusOK, "success")
}

type DefaultTemplateMessage struct {
	ToUser           string              `json:"touser"`
	TemplateID       string              `json:"template_id"`
	Page             string              `json:"page"`
	MiniprogramState string              `json:"miniprogram_state"`
	Lang             string              `json:"lang"`
	Data             TemplateMessageData `json:"data"`
}

type TemplateMessageData struct {
	Thing1 struct {
		Value string `json:"value"`
	} `json:"thing1"` // 疫苗名称
	Thing5 struct {
		Value string `json:"value"`
	} `json:"thing5"` // 备注
	Thing7 struct {
		Value string `json:"value"`
	} `json:"thing7"` // 接种地址
	Number8 struct {
		Value int `json:"value"`
	} `json:"number8"` // 接种剂数
}

type TemplateMessageResponse struct {
	ErrorCode    int    `json:"errcode"`
	ErrorMessage string `json:"errmsg"`
}

func SendTemplateMessage(accessToken, openID, templateID, page, vaxName, comment, vaxLocation string, vaxNum int) error {
	if accessToken == "" {
		accessToken, _ = GetAccessToken("", "")
	}
	if templateID == "" {
		templateID = TemplateID1
	}
	if page == "" {
		page = "pages/welcome/welcome"
	}

	data := TemplateMessageData{
		Thing1: struct {
			Value string `json:"value"`
		}{
			Value: "提醒您接种" + vaxName,
		},
		Thing5: struct {
			Value string `json:"value"`
		}{
			Value: comment + ";",
		},
		Thing7: struct {
			Value string `json:"value"`
		}{
			Value: vaxLocation + ";",
		},
		Number8: struct {
			Value int `json:"value"`
		}{
			Value: vaxNum,
		},
	}

	message := DefaultTemplateMessage{
		ToUser:           openID,
		TemplateID:       templateID,
		Page:             page,
		MiniprogramState: "trial", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版
		Lang:             "zh_CN",
		Data:             data,
	}

	client := resty.New()
	resp, err := client.R().
		SetQueryParam("access_token", accessToken).
		SetBody(message).
		Post(WEIXIN_API_SEND_MESSAGE)

	if err != nil {
		return err
	}

	var response TemplateMessageResponse
	if err := json.Unmarshal(resp.Body(), &response); err != nil {
		return err
	}
	log.Println("response:", response)

	if response.ErrorCode != 0 {
		return fmt.Errorf("failed to send template message: %s", response.ErrorMessage)
	}

	return nil
}

type MessageHandler struct {
	MessageService *service.MessageService
}

func NewMessageHandler(messageService *service.MessageService) *MessageHandler {
	return &MessageHandler{MessageService: messageService}
}

func (h *MessageHandler) HandleAddMessage(c *gin.Context) {
	var message model.Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message.OpenID, err = h.MessageService.GetOpenIDByUserID(message.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if message.RealTime {
		// 实时提醒
		if err := SendTemplateMessage("", message.OpenID, "", message.Page, message.VaxName, message.Comment, message.VaxLocation, message.VaxNum); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		message.Sent = true
	}

	if err := h.MessageService.CreateMessage(message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, message)
}

func (h *MessageHandler) HandleGetAllMessages(c *gin.Context) {
	messages, err := h.MessageService.GetAllMessages()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}

func (h *MessageHandler) HandleGetMessageByID(c *gin.Context) {
	messageID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	message, err := h.MessageService.GetMessageByID(uint(messageID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, message)
}

func (h *MessageHandler) HandleUpdateMessageByID(c *gin.Context) {
	var message model.Message
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.MessageService.UpdateMessageByID(message); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("message updated successfully: ", message)
	c.JSON(http.StatusOK, message)
}

func (h *MessageHandler) HandleDeleteMessageByID(c *gin.Context) {
	messageID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.MessageService.DeleteMessageByID(uint(messageID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("message deleted successfully: ", messageID)
	c.JSON(http.StatusOK, gin.H{"message": "message deleted successfully"})
}

// getMessagesToSend 从数据库获取未发送的消息，并按发送时间排序
func (h *MessageHandler) getMessagesToSend() []model.Message {
	// 实现数据库查询逻辑
	messages, err := h.MessageService.GetAllUnsentMessages()
	if err != nil {
		log.Println("failed to get messages to send: ", err)
		return nil
	}

	// 按SendTime排序
	sort.Slice(messages, func(i, j int) bool {
		return messages[i].SendTime < messages[j].SendTime
	})

	return messages
}

// handleMessage 处理消息发送逻辑
func (h *MessageHandler) handleMessage(messages []model.Message) {
	for _, message := range messages {
		// 判断是否到达发送时间
		now := time.Now()
		sendTime, err := time.ParseInLocation("2006-01-02 15:04", message.SendTime, time.Local)
		if err != nil {
			log.Println("failed to parse send time: ", err)
			return
		}
		log.Printf("Now:%v, Send Time:%v\n", now, sendTime)

		if now.After(sendTime) {
			// 到达发送时间，发送消息
			if err := SendTemplateMessage("", message.OpenID, "", message.Page, message.VaxName, message.Comment, message.VaxLocation, message.VaxNum); err != nil {
				log.Println("failed to send template message: ", err)
				return
			}
			message.Sent = true

			// 更新数据库
			if err := h.MessageService.UpdateMessageByID(message); err != nil {
				log.Println("failed to update message: ", err)
				return
			}

		} else {
			// 未到达发送时间，跳过
			break
		}

	}
}

// MessageScheduler 负责定时检查并发送消息
func (h *MessageHandler) MessageScheduler() {
	for {
		// 从数据库中获取还未发送的消息，按SendTime排序
		messages := h.getMessagesToSend() // 按SendTime排序

		if len(messages) > 0 {
			// 处理待发送的消息
			h.handleMessage(messages)
		}

		// 等待一段时间后再次检查
		time.Sleep(1 * time.Minute)
	}
}

type TemplateMessageSubscription struct {
	ToUser           string                          `json:"touser"`
	TemplateID       string                          `json:"template_id"`
	Page             string                          `json:"page"`
	MiniprogramState string                          `json:"miniprogram_state"`
	Lang             string                          `json:"lang"`
	Data             TemplateMessageSubscriptionData `json:"data"`
}

type TemplateMessageSubscriptionData struct {
	Thing1 struct {
		Value string `json:"value"`
	} `json:"thing1"` // 疫苗名称
	Thing3 struct {
		Value string `json:"value"`
	} `json:"thing3"` // 订阅门诊
}

func SendTemplateMessageSubscription(accessToken, openID, templateID, page, vaxName, vaxLocation string) error {
	if accessToken == "" {
		accessToken, _ = GetAccessToken("", "")
	}
	if templateID == "" {
		templateID = TempalteID2
	}
	if page == "" {
		page = "pages/welcome/welcome"
	}

	data := TemplateMessageSubscriptionData{
		Thing1: struct {
			Value string `json:"value"`
		}{
			Value: vaxName,
		},
		Thing3: struct {
			Value string `json:"value"`
		}{
			Value: vaxLocation,
		},
	}

	message := TemplateMessageSubscription{
		ToUser:           openID,
		TemplateID:       templateID,
		Page:             page,
		MiniprogramState: "trial", // 跳转小程序类型：developer为开发版；trial为体验版；formal为正式版
		Lang:             "zh_CN",
		Data:             data,
	}

	client := resty.New()
	resp, err := client.R().
		SetQueryParam("access_token", accessToken).
		SetBody(message).
		Post(WEIXIN_API_SEND_MESSAGE)

	if err != nil {
		return err
	}

	var response TemplateMessageResponse
	if err := json.Unmarshal(resp.Body(), &response); err != nil {
		return err
	}
	log.Println("response:", response)

	if response.ErrorCode != 0 {
		return fmt.Errorf("failed to send template message: %s", response.ErrorMessage)
	}

	return nil
}

type MessageSubscription struct {
	VaccineID   uint   `json:"vaccineId"`
	Page        string `json:"page"` // 消息跳转页面，例如"pages/welcome/welcome"
	VaxName     string `json:"vaxName"`
	VaxLocation string `json:"vaxLocation"`
}

func (h *MessageHandler) HandleAddMessageSubscription(c *gin.Context) {
	var message MessageSubscription
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 查找所有关注了VaccineID的用户
	users, err := h.MessageService.GetUsersFollowingVaccine(message.VaccineID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	for _, user := range users {
		if err := SendTemplateMessageSubscription("", user.OpenID, "", message.Page, message.VaxName, message.VaxLocation); err != nil {
			log.Println("failed to send template message: ", err)
			return
		}
	}

	c.JSON(http.StatusOK, message)
}
