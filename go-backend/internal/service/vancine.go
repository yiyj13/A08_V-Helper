package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type VaccineService struct {
	db *gorm.DB
}

func NewVaccineService(db *gorm.DB) *VaccineService {
	return &VaccineService{db: db}
}

func (s *VaccineService) CreateVaccine(vaccine model.Vaccine) error {
	return s.db.Create(&vaccine).Error
}

func (s *VaccineService) GetAllVaccines() ([]model.Vaccine, error) {
	var vaccines []model.Vaccine
	if err := s.db.Find(&vaccines).Error; err != nil {
		return nil, err
	}
	return vaccines, nil
}

func (s *VaccineService) GetVaccineByID(id uint) (model.Vaccine, error) {
	var vaccine model.Vaccine
	if err := s.db.First(&vaccine, id).Error; err != nil {
		return vaccine, err
	}
	return vaccine, nil
}

func (s *VaccineService) UpdateVaccineByID(id uint, vaccine model.Vaccine) error {
	return s.db.Model(&vaccine).Where("id = ?", id).Updates(vaccine).Error
}

func (s *VaccineService) DeleteVaccineByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.Vaccine{}).Error
}
