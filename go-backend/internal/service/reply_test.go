package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestReplyService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIReplyService(ctrl)
	m.EXPECT().CreateReply(gomock.Any()).Return(nil)

	err := m.CreateReply(model.Reply{
		ArticleID: 1,
		Content:   "test回复内容",
		UserName:  "test用户名",
		UserID:    1,
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestReplyService_GetAllReplys(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIReplyService(ctrl)
	m.EXPECT().GetAllReplys().Return([]model.Reply{}, nil)

	_, err := m.GetAllReplys()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
