package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type IProfileService interface {
	CreateProfile(profile model.Profile) error
	GetAllProfiles() ([]model.Profile, error)
	GetProfileByID(id uint) (model.Profile, error)
	UpdateProfileByID(id uint, profile model.Profile) error
	DeleteProfileByID(id uint) error
	GetProfilesByUserID(userID uint) ([]model.Profile, error)
}

type ProfileService struct {
	db *gorm.DB
}

func NewProfileService(db *gorm.DB) *ProfileService {
	return &ProfileService{db: db}
}

func (s *ProfileService) CreateProfile(profile model.Profile) error {
	return s.db.Create(&profile).Error
}

func (s *ProfileService) GetAllProfiles() ([]model.Profile, error) {
	var profiles []model.Profile
	if err := s.db.Find(&profiles).Error; err != nil {
		return nil, err
	}
	return profiles, nil
}

func (s *ProfileService) GetProfileByID(id uint) (model.Profile, error) {
	var profile model.Profile
	if err := s.db.First(&profile, id).Error; err != nil {
		return profile, err
	}
	return profile, nil
}

func (s *ProfileService) UpdateProfileByID(id uint, profile model.Profile) error {
	return s.db.Model(&profile).Where("id = ?", id).Updates(profile).Error
}

func (s *ProfileService) DeleteProfileByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.Profile{}).Error
}

// GetProfilesByUserID 通过 UserID 查询所有相关的 Profile
func (s *ProfileService) GetProfilesByUserID(userID uint) ([]model.Profile, error) {
	var profiles []model.Profile
	if err := s.db.Where("user_id = ?", userID).Find(&profiles).Error; err != nil {
		return nil, err
	}
	return profiles, nil
}
