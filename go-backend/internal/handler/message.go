package handler

import (
	"crypto/sha1"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

const (
	defaultTemplateID       = "ocbFMPXogCo85ZjBYlEseGnQzaPlmtvUqXUw1VrVuvQ"
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
		templateID = defaultTemplateID
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

	if message.RealTime {
		// 实时提醒
		if err := SendTemplateMessage("", message.OpenID, "", message.Page, message.VaxName, message.Comment, message.VaxLocation, message.VaxNum); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		message.Sent = true
	} else {
		// 非实时提醒
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
