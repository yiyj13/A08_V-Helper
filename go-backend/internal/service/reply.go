package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type IReplyService interface {
	CreateReply(reply model.Reply) error
	GetAllReplys() ([]model.Reply, error)
	GetReplysByArticleID(articleID uint) ([]model.Reply, error)
	GetReplyByID(id uint) (model.Reply, error)
	UpdateReplyByID(id uint, reply model.Reply) error
	DeleteReplyByID(id uint) error
}

type ReplyService struct {
	db *gorm.DB
}

func NewReplyService(db *gorm.DB) *ReplyService {
	return &ReplyService{db: db}
}

func (s *ReplyService) CreateReply(reply model.Reply) error {
	return s.db.Create(&reply).Error
}

func (s *ReplyService) GetAllReplys() ([]model.Reply, error) {
	var replys []model.Reply
	if err := s.db.Find(&replys).Error; err != nil {
		return nil, err
	}
	return replys, nil
}

func (s *ReplyService) GetReplysByArticleID(articleID uint) ([]model.Reply, error) {
	var replys []model.Reply
	if err := s.db.Where("article_id = ?", articleID).Find(&replys).Error; err != nil {
		return nil, err
	}
	return replys, nil
}

func (s *ReplyService) GetReplyByID(id uint) (model.Reply, error) {
	var reply model.Reply
	if err := s.db.First(&reply, id).Error; err != nil {
		return reply, err
	}
	return reply, nil
}

func (s *ReplyService) UpdateReplyByID(id uint, reply model.Reply) error {
	return s.db.Model(&reply).Where("id = ?", id).Updates(reply).Error
}

func (s *ReplyService) DeleteReplyByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.Reply{}).Error
}
