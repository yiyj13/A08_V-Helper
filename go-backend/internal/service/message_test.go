package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestMessageService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIMessageService(ctrl)
	m.EXPECT().CreateMessage(gomock.Any()).Return(nil)

	err := m.CreateMessage(model.Message{
		OpenID:      "testOpenId",
		Page:        "testPage",
		VaxName:     "testVaxName",
		Comment:     "testComment",
		VaxLocation: "testVaxLocation",
		VaxNum:      1,
		RealTime:    false,
		SendTime:    "testSendTime",
		Sent:        false,
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestMessageService_GetAllMessages(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIMessageService(ctrl)
	m.EXPECT().GetAllMessages().Return([]model.Message{}, nil)

	_, err := m.GetAllMessages()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
