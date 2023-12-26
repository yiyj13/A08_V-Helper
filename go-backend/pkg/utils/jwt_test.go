// utils/jwt_test.go
package utils

import (
	"fmt"
	"testing"
	"v-helper/internal/model"
)

func TestGenerateJWT(t *testing.T) {
	user := model.User{OpenID: "1234567890"} // 假设的用户模型
	token, err := GenerateJWT(user)

	if err != nil {
		t.Errorf("GenerateJWT() error = %v, wantErr %v", err, nil)
	}
	if len(token) == 0 {
		t.Errorf("GenerateJWT() token is empty")
	}
	fmt.Println("token:", token)
}

func TestParseJWT(t *testing.T) {
	user := model.User{OpenID: "1234567890"} // 假设的用户模型
	tokenString, _ := GenerateJWT(user)
	fmt.Println("tokenString:", tokenString)

	claims, err := ParseJWT(tokenString)
	if err != nil {
		t.Errorf("ParseJWT() error = %v, wantErr %v", err, nil)
	}
	if claims.OpenID != user.OpenID {
		t.Errorf("ParseJWT() claims.OpenID = %v, want %v", claims.OpenID, user.OpenID)
	}
	fmt.Println("claims:", claims)
}
