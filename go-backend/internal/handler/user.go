package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

const (
	GRANT_TYPE = "authorization_code"
	WEIXIN_API = "https://api.weixin.qq.com/sns/jscode2session"

	defaultAppID     = "wx616961ff9148b541"
	defaultAppSecret = "46db234bd912cfe6035a3a1a8777d55a"
)

type WeixinResponse struct {
	Openid     string `json:"openid"`
	SessionKey string `json:"session_key"`
	Unionid    string `json:"unionid"`
	Errcode    int    `json:"errcode"`
	Errmsg     string `json:"errmsg"`
}

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

func (h *UserHandler) LogInHandler(c *gin.Context) {
	// 通过code得到openid，在得到对应用户信息，若不存在则新建用户
	jsCode := c.Query("code")

	client := resty.New()
	resp, err := client.R().
		SetQueryParams(map[string]string{
			"appid":      defaultAppID,
			"secret":     defaultAppSecret,
			"js_code":    jsCode,
			"grant_type": GRANT_TYPE,
		}).
		SetResult(&WeixinResponse{}).
		Get(WEIXIN_API)

	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch data from Weixin"})
		return
	}

	var weixinResponse WeixinResponse
	if err := json.Unmarshal(resp.Body(), &weixinResponse); err != nil {
		log.Println("Error unmarshalling response:", err)
		return
	}

	log.Println("weixinResponse:", weixinResponse)
	if weixinResponse.Errcode != 0 {
		c.JSON(500, gin.H{"error": "Failed to get openid"})
		return
	}
	// 根据result.Openid检查或创建用户
	user, err := h.userService.GetUserByOpenID(weixinResponse.Openid)

	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) HandleCreateUser(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.CreateUser(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("user created successfully: ", user)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) HandleGetAllUsers(c *gin.Context) {
	users, err := h.userService.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

func (h *UserHandler) HandleGetUserByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := h.userService.GetUserByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) HandleUpdateUserByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.UpdateUserByID(uint(id), user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("user updated successfully: ", user)
	c.JSON(http.StatusOK, user)
}

func (h *UserHandler) HandleDeleteUserByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.DeleteUserByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("user deleted successfully: ", id)
	c.JSON(http.StatusOK, gin.H{"message": "user deleted successfully"})
}

// Register 用户注册
func (h *UserHandler) HandleRegister(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.Register(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

// Login 用户登录
func (h *UserHandler) HandleLogin(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.userService.Login(user.Email, user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
