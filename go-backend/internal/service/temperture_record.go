package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type TempertureRecordService struct {
	db *gorm.DB
}

func NewTempertureRecordService(db *gorm.DB) *TempertureRecordService {
	return &TempertureRecordService{db: db}
}

func (s *TempertureRecordService) CreateTempertureRecord(record model.TempertureRecord) error {
	return s.db.Create(&record).Error
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
