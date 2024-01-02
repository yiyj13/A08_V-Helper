package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"
	"v-helper/pkg/utils"

	"github.com/gin-gonic/gin"
	"github.com/go-resty/resty/v2"
)

const (
	GRANT_TYPE = "authorization_code"
	WEIXIN_API = "https://api.weixin.qq.com/sns/jscode2session"
)

var (
	defaultAppID     = os.Getenv("DEFAULT_APP_ID")
	defaultAppSecret = os.Getenv("DEFAULT_APP_SECRET")
)

// WeixinResponse 微信返回的数据结构
type WeixinResponse struct {
	Openid     string `json:"openid"`
	SessionKey string `json:"session_key"`
	Unionid    string `json:"unionid"`
	Errcode    int    `json:"errcode"`
	Errmsg     string `json:"errmsg"`
}

// UserHandler 用户处理器
type UserHandler struct {
	userService *service.UserService
}

// NewUserHandler 创建用户处理器
func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{userService: userService}
}

// AuthHandler 管理员登录
func (h *UserHandler) AuthHandler(c *gin.Context) {
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user) // 生成 JWT 令牌

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if len(token) == 0 {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "token is empty"})
		return
	}
	fmt.Println("token:", token)
	c.JSON(http.StatusOK, gin.H{"token": token})
}

// LogInHandler 用户登录
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
	token, err := utils.GenerateJWT(user) // 生成 JWT 令牌
	if err != nil {
		c.JSON(500, gin.H{"error": err.Error()})
		return
	}

	user.Token = token
	c.JSON(http.StatusOK, user)
}

// HandleGetUserByOpenID 根据openid获取用户信息
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

// HandleGetAllUsers 获取所有用户信息
func (h *UserHandler) HandleGetAllUsers(c *gin.Context) {
	users, err := h.userService.GetAllUsers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, users)
}

// HandleGetUserByID 根据id获取用户信息
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

// HandleGetUserWithFollowings 根据id获取用户信息，包括关注的疫苗和文章
func (h *UserHandler) HandleGetUserWithFollowings(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	user, err := h.userService.GetUserWithFollowings(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

// HandleAddFollowingVaccine 添加关注的疫苗
func (h *UserHandler) HandleAddFollowingVaccine(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	vaccineID := c.Query("vaccine_id")
	if vaccineID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vaccine ID"})
		return
	}

	vaccineIDUint, err := strconv.ParseUint(vaccineID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vaccine ID"})
		return
	}

	err = h.userService.AddFollowingVaccine(uint(userID), uint(vaccineIDUint))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "vaccine added successfully"})
}

// HandleRemoveFollowingVaccine 移除关注的疫苗
func (h *UserHandler) HandleRemoveFollowingVaccine(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	vaccineID := c.Query("vaccine_id")
	if vaccineID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vaccine ID"})
		return
	}

	vaccineIDUint, err := strconv.ParseUint(vaccineID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vaccine ID"})
		return
	}

	err = h.userService.RemoveFollowingVaccine(uint(userID), uint(vaccineIDUint))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "vaccine removed successfully"})
}

// HandleAddFollowingArticle 添加关注的文章
func (h *UserHandler) HandleAddFollowingArticle(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	articleID := c.Query("article_id")
	if articleID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article ID"})
		return
	}

	articleIDUint, err := strconv.ParseUint(articleID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article ID"})
		return
	}

	err = h.userService.AddFollowingArticle(uint(userID), uint(articleIDUint))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "article added successfully"})
}

// HandleRemoveFollowingArticle 移除关注的文章
func (h *UserHandler) HandleRemoveFollowingArticle(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	articleID := c.Query("article_id")
	if articleID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article ID"})
		return
	}

	articleIDUint, err := strconv.ParseUint(articleID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid article ID"})
		return
	}

	err = h.userService.RemoveFollowingArticle(uint(userID), uint(articleIDUint))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "article removed successfully"})
}

// HandleUpdateUserByID 根据id更新用户信息
func (h *UserHandler) HandleUpdateUserByID(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.userService.UpdateUserByID(user); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("user updated successfully: ", user)
	c.JSON(http.StatusOK, user)
}

// HandleDeleteUserByID 根据id删除用户信息
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

// HandleGetPublicUserByID 根据id获取公开的用户信息，用户名和头像
func (h *UserHandler) HandleGetPublicUserByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.userService.GetPublicUserByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

type Response struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   int    `json:"expires_in"`
}

// GetAccessToken 获取微信access_token
func GetAccessToken(appID, appSecret string) (string, error) {
	if appID == "" {
		appID = defaultAppID
	}
	if appSecret == "" {
		appSecret = defaultAppSecret
	}

	url := fmt.Sprintf("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s", appID, appSecret)

	client := resty.New()
	resp, err := client.R().SetResult(&Response{}).Get(url)

	if err != nil {
		return "", err
	}

	if resp.StatusCode() != 200 {
		return "", fmt.Errorf("failed with status code: %d", resp.StatusCode())
	}

	log.Println("resp:", resp)
	response := resp.Result().(*Response)
	return response.AccessToken, nil
}
