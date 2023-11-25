package utils

import (
	"errors"
	"time"
	"v-helper/internal/model"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("your_secret_key") // 从安全的配置来源获取

// JWTClaims 自定义 JWT Claims 结构
type JWTClaims struct {
	UserID uint
	jwt.StandardClaims
}

// GenerateJWT 生成 JWT 令牌
func GenerateJWT(user model.User) (string, error) {
	expirationTime := time.Now().Add(1 * time.Hour)
	claims := &JWTClaims{
		UserID: user.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

// ParseJWT 解析 JWT 令牌
func ParseJWT(tokenString string) (*JWTClaims, error) {
	claims := &JWTClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil {
		return nil, err
	}
	if !token.Valid {
		return nil, errors.New("invalid token")
	}
	return claims, nil
}

// VerifyToken 验证 JWT 令牌
func VerifyToken(tokenString string) (bool, error) {
	_, err := ParseJWT(tokenString)
	if err != nil {
		return false, err
	}
	return true, nil
}
