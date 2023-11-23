package service

import (
	"time"
	"v-helper/internal/model"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type AuthService struct {
	db *gorm.DB
}

func NewAuthService(db *gorm.DB) *AuthService {
	return &AuthService{db: db}
}

// 登录逻辑
func (s *AuthService) Login(c *gin.Context) {
	var user model.User
	var loginUser model.LoginUser
	if err := c.ShouldBindJSON(&loginUser); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 验证用户
	if err := s.db.Where("email = ?", loginUser.Email).First(&user).Error; err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	// 生成 JWT
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 72).Unix(),
	})

	tokenString, err := token.SignedString([]byte("secret")) // 使用密钥签名
	if err != nil {
		c.JSON(500, gin.H{"error": "Could not create token"})
		return
	}

	c.JSON(200, gin.H{"token": tokenString})
}

// 注册逻辑
func (s *AuthService) Register(c *gin.Context) {
	var user model.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	// 创建用户
	s.db.Create(&user)
	c.JSON(201, user)
}
