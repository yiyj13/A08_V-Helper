package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type ClinicService struct {
	db *gorm.DB
}

func NewClinicService(db *gorm.DB) *ClinicService {
	return &ClinicService{db: db}
}

func (s *ClinicService) CreateClinic(clinic model.Clinic) error {
	return s.db.Create(&clinic).Error
}

func (s *ClinicService) GetAllClinics() ([]model.Clinic, error) {
	var clinics []model.Clinic
	if err := s.db.Find(&clinics).Error; err != nil {
		return nil, err
	}
	return clinics, nil
}

func (s *ClinicService) GetClinicsByVaccineID(vaccineID uint) ([]model.Clinic, error) {
	var clinics []model.Clinic
	if err := s.db.Where("vaccine_id = ?", vaccineID).First(&clinics).Error; err != nil {
		return nil, err
	}
	return clinics, nil
}

func (s *ClinicService) GetClinicsByArticleID(articleID uint) ([]model.Clinic, error) {
	var clinics []model.Clinic
	if err := s.db.Where("article_id = ?", articleID).Find(&clinics).Error; err != nil {
		return nil, err
	}
	return clinics, nil
}

func (s *ClinicService) GetClinicByID(id uint) (model.Clinic, error) {
	var clinic model.Clinic
	if err := s.db.First(&clinic, id).Error; err != nil {
		return clinic, err
	}
	return clinic, nil
}

func (s *ClinicService) UpdateClinicByID(id uint, clinic model.Clinic) error {
	return s.db.Model(&clinic).Where("id = ?", id).Updates(clinic).Error
}

func (s *ClinicService) DeleteClinicByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.Clinic{}).Error
}
