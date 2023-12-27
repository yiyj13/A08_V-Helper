package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestArticleService_CreateArticle(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIArticleService(ctrl)
	m.EXPECT().CreateArticle(gomock.Any()).Return(nil)

	err := m.CreateArticle(model.Article{
		Title:     "test文章标题",
		Content:   "test文章内容",
		UserName:  "test用户名",
		UserID:    1,
		IsBind:    false,
		VaccineID: 1,
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestArticleService_GetAllArticles(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIArticleService(ctrl)
	m.EXPECT().GetAllArticles().Return([]model.Article{}, nil)

	_, err := m.GetAllArticles()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestArticleService_GetArticleByID(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIArticleService(ctrl)
	m.EXPECT().GetArticleByID(gomock.Any()).Return(model.Article{}, nil)

	_, err := m.GetArticleByID(1)
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestArticleService_DeleteArticleByID(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIArticleService(ctrl)
	m.EXPECT().DeleteArticleByID(gomock.Any()).Return(nil)

	err := m.DeleteArticleByID(1)
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestArticleService_UpdateArticleByID(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIArticleService(ctrl)
	m.EXPECT().UpdateArticleByID(gomock.Any(), gomock.Any()).Return(nil)

	err := m.UpdateArticleByID(1, model.Article{
		Title:     "test文章标题",
		Content:   "test文章内容",
		UserName:  "test用户名",
		UserID:    1,
		IsBind:    false,
		VaccineID: 1,
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
