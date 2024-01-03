package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type IMessageService interface {
	CreateMessage(message model.Message) error
	GetAllMessages() ([]model.Message, error)
	GetMessageByID(id uint) (model.Message, error)
	UpdateMessageByID(message model.Message) error
	DeleteMessageByID(id uint) error
}

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

// 查询所有未发送的消息
func (s *MessageService) GetAllUnsentMessages() ([]model.Message, error) {
	var messages []model.Message
	if err := s.db.Where("sent = ?", false).Find(&messages).Error; err != nil {
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

// GetUsersFollowingVaccine 获取关注某疫苗的用户
func (s *MessageService) GetUsersFollowingVaccine(vaccineID uint) ([]model.User, error) {
	var users []model.User

	err := s.db.Joins("JOIN user_following_vaccines on user_following_vaccines.user_id = users.id").
		Joins("JOIN vaccines on vaccines.id = user_following_vaccines.vaccine_id").
		Where("vaccines.id = ?", vaccineID).
		Find(&users).Error

	if err != nil {
		return nil, err
	}

	return users, nil
}

// GetOpenIDByUserID 根据用户id获取openid
func (s *MessageService) GetOpenIDByUserID(userID uint) (string, error) {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return "", err
	}
	return user.OpenID, nil
}
