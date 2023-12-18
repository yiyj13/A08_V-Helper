package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type VaccinationRecordService struct {
	db *gorm.DB
}

func NewVaccinationRecordService(db *gorm.DB) *VaccinationRecordService {
	return &VaccinationRecordService{db: db}
}

func (s *VaccinationRecordService) CreateVaccinationRecord(record model.VaccinationRecord) error {
	return s.db.Create(&record).Error
}

func (s *VaccinationRecordService) GetVaccinationRecordsByProfileID(profileID uint) ([]model.VaccinationRecord, error) {
	var records []model.VaccinationRecord
	if err := s.db.Where("profile_id = ?", profileID).Preload("Vaccine").Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

func (s *VaccinationRecordService) GetAllVaccinationRecords() ([]model.VaccinationRecord, error) {
	var records []model.VaccinationRecord
	if err := s.db.Preload("Vaccine").Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

// 根据是否完成接种获取接种记录
func (s *VaccinationRecordService) GetAllVaccinationRecordsByIsCompleted(isCompleted bool) ([]model.VaccinationRecord, error) {
	var records []model.VaccinationRecord
	if err := s.db.Where("is_completed = ?", isCompleted).Preload("Vaccine").Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

// 根据ProfileID和是否完成接种获取接种记录
func (s *VaccinationRecordService) GetVaccinationRecordsByProfileIDAndIsCompleted(profileID uint, isCompleted bool) ([]model.VaccinationRecord, error) {
	var records []model.VaccinationRecord
	if err := s.db.Where("profile_id = ? AND is_completed = ?", profileID, isCompleted).Preload("Vaccine").Find(&records).Error; err != nil {
		return nil, err
	}
	return records, nil
}

func (s *VaccinationRecordService) GetVaccinationRecordByID(id uint) (model.VaccinationRecord, error) {
	var record model.VaccinationRecord
	if err := s.db.Preload("Vaccine").First(&record, id).Error; err != nil {
		return record, err
	}
	return record, nil
}

func (s *VaccinationRecordService) UpdateVaccinationRecordByID(id uint, record model.VaccinationRecord) error {
	return s.db.Model(&record).Where("id = ?", id).Updates(record).Error
}

func (s *VaccinationRecordService) DeleteVaccinationRecordByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.VaccinationRecord{}).Error
}
