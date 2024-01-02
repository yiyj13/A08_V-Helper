package utils

import (
	"fmt"
	"log"
	"os"
	"time"
	"v-helper/internal/model"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte(os.Getenv("JWT_KEY"))

// JWTClaims 自定义 JWT Claims 结构
type JWTClaims struct {
	OpenID string
	jwt.StandardClaims
}

// GenerateJWT 生成 JWT 令牌
func GenerateJWT(user model.User) (string, error) {
	expirationTime := time.Now().Add(72 * time.Hour)
	claims := &JWTClaims{
		OpenID: user.OpenID,
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
		return nil, fmt.Errorf("invalid token")
	}
	return claims, nil
}

// VerifyToken 验证 JWT 令牌
func VerifyToken(tokenString string) (bool, error) {
	claims, err := ParseJWT(tokenString)
	log.Println("claims:", claims)
	if err != nil {
		return false, err
	}
	return true, nil
}
