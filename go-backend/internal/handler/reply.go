package handler

import (
	"log"
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type ReplyHandler struct {
	replyService *service.ReplyService
}

func NewReplyHandler(replyService *service.ReplyService) *ReplyHandler {
	return &ReplyHandler{replyService: replyService}
}

func (h *ReplyHandler) HandleCreateReply(c *gin.Context) {
	var reply model.Reply
	if err := c.ShouldBindJSON(&reply); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.replyService.CreateReply(reply); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("reply created successfully: ", reply)
	c.JSON(http.StatusOK, reply)
}

func (h *ReplyHandler) HandleGetReplys(c *gin.Context) {
	queryArticleID := c.Query("articleId")

	// 如果没有传 articleId 参数，则返回所有 reply
	if queryArticleID == "" {
		replys, err := h.replyService.GetAllReplys()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, replys)
		return
	}

	// 如果传了 articleId 参数，则返回该 articleId 下的所有 reply
	articleID, err := strconv.ParseUint(queryArticleID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	replys, err := h.replyService.GetReplysByArticleID(uint(articleID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, replys)
}

func (h *ReplyHandler) HandleGetReplyByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	reply, err := h.replyService.GetReplyByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, reply)
}

func (h *ReplyHandler) HandleUpdateReplyByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var reply model.Reply
	if err := c.ShouldBindJSON(&reply); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.replyService.UpdateReplyByID(uint(id), reply); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("reply updated successfully: ", reply)
	c.JSON(http.StatusOK, reply)
}

func (h *ReplyHandler) HandleDeleteReplyByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.replyService.DeleteReplyByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("reply deleted successfully: ", id)
	c.JSON(http.StatusOK, gin.H{"message": "reply deleted successfully"})
}
