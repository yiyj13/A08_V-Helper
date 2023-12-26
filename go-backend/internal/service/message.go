package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type MessageService struct {
	db *gorm.DB
}

func NewMessageService(db *gorm.DB) *MessageService {
	return &MessageService{db: db}
}

func (s *MessageService) CreateMessage(message model.Message) error {
	return s.db.Create(&message).Error
}

func (s *MessageService) GetAllMessages() ([]model.Message, error) {
	var messages []model.Message
	if err := s.db.Find(&messages).Error; err != nil {
		return nil, err
	}
	return messages, nil
}

func (s *MessageService) GetMessageByID(id uint) (model.Message, error) {
	var message model.Message
	if err := s.db.First(&message, id).Error; err != nil {
		return message, err
	}
	return message, nil
}

func (s *MessageService) UpdateMessageByID(message model.Message) error {
	return s.db.Model(&model.Message{}).Where("id = ?", message.ID).Updates(message).Error
}

func (s *MessageService) DeleteMessageByID(id uint) error {
	return s.db.Delete(&model.Message{}, id).Error
}
