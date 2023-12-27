package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type ITempertureRecordService interface {
	CreateTempertureRecord(record model.TempertureRecord) error
	GetTempertureRecordsByUserID(userID uint) ([]model.TempertureRecord, error)
	GetTempertureRecordsByProfileID(profileID uint) ([]model.TempertureRecord, error)
	GetAllTempertureRecords() ([]model.TempertureRecord, error)
	GetTempertureRecordByID(id uint) (model.TempertureRecord, error)
	UpdateTempertureRecordByID(id uint, record model.TempertureRecord) error
	DeleteTempertureRecordByID(id uint) error
}

type TempertureRecordService struct {
	db *gorm.DB
}

func NewTempertureRecordService(db *gorm.DB) *TempertureRecordService {
	return &TempertureRecordService{db: db}
}

func (s *TempertureRecordService) CreateTempertureRecord(record model.TempertureRecord) error {
	return s.db.Create(&record).Error
}

func (s *TempertureRecordService) GetTempertureRecordsByUserID(userID uint) ([]model.TempertureRecord, error) {
	// 先查询用户的所有档案
	var profiles []model.Profile
	if err := s.db.Where("user_id = ?", userID).Find(&profiles).Error; err != nil {
		return nil, err
	}

	// 再查询所有档案的接种记录
	var records []model.TempertureRecord
	for _, profile := range profiles {
		var tempRecords []model.TempertureRecord
		if err := s.db.Where("profile_id = ?", profile.ID).Find(&tempRecords).Error; err != nil { //
			return nil, err
		}
		records = append(records, tempRecords...)
	}

	return records, nil
}

func (s *TempertureRecordService) GetTempertureRecordsByProfileID(profileID uint) ([]model.TempertureRecord, error) {
	var records []model.TempertureRecord
	if err := s.db.Where("profile_id = ?", profileID).Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

func (s *TempertureRecordService) GetAllTempertureRecords() ([]model.TempertureRecord, error) {
	var records []model.TempertureRecord
	if err := s.db.Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

func (s *TempertureRecordService) GetTempertureRecordByID(id uint) (model.TempertureRecord, error) {
	var record model.TempertureRecord
	if err := s.db.First(&record, id).Error; err != nil {
		return record, err
	}
	return record, nil
}

func (s *TempertureRecordService) UpdateTempertureRecordByID(id uint, record model.TempertureRecord) error {
	return s.db.Model(&record).Where("id = ?", id).Updates(record).Error
}

func (s *TempertureRecordService) DeleteTempertureRecordByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.TempertureRecord{}).Error
}
