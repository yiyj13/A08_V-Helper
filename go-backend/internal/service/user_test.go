package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestUserService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIUserService(ctrl)
	m.EXPECT().CreateUser(gomock.Any()).Return(nil)

	err := m.CreateUser(model.User{
		OpenID:   "testOpenID",
		UserName: "test用户名",
		Password: "test密码",
		Phone:    "test手机号",
		Email:    "test邮箱",
		Avatar:   "test头像",
		Token:    "testToken",
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestUserService_GetAllUsers(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIUserService(ctrl)
	m.EXPECT().GetAllUsers().Return([]model.User{}, nil)

	_, err := m.GetAllUsers()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
