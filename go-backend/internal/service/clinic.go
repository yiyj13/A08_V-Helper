package service

import (
	"strings"

	"v-helper/internal/model"

	"gorm.io/gorm"
)

type IClinicService interface {
	CreateClinic(clinic model.VaccineClinicList) error
	GetAllClinics() ([]model.VaccineClinicList, error)
	GetClinicsByVaccineID(vaccineID uint) ([]model.VaccineClinicList, error)
	GetClinicsByVaccineName(vaccineName string) ([]clinicPosition, error)
	GetClinicsByClinicName(clinicName string) (model.Clinic, error)
	GetClinicByID(id uint) (model.VaccineClinicList, error)
	UpdateClinicByID(id uint, clinic model.VaccineClinicList) error
	DeleteClinicByID(id uint) error
}

type ClinicService struct {
	db *gorm.DB
}

func NewClinicService(db *gorm.DB) *ClinicService {
	return &ClinicService{db: db}
}

func (s *ClinicService) CreateClinic(clinic model.VaccineClinicList) error {
	return s.db.Create(&clinic).Error
}

func (s *ClinicService) GetAllClinics() ([]model.VaccineClinicList, error) {
	var clinics []model.VaccineClinicList
	if err := s.db.Find(&clinics).Error; err != nil {
		return nil, err
	}
	return clinics, nil
}

func (s *ClinicService) GetClinicsByVaccineID(vaccineID uint) ([]model.VaccineClinicList, error) {
	var clinics []model.VaccineClinicList
	if err := s.db.Where("vaccine_id = ?", vaccineID).First(&clinics).Error; err != nil {
		return nil, err
	}
	return clinics, nil
}

type clinicPosition struct {
	ClinicName string `json:"clinicName"`
	Latitude   string `json:"latitude"`
	Longitude  string `json:"longitude"`
}

func (s *ClinicService) GetClinicsByVaccineName(vaccineName string) ([]clinicPosition, error) {
	// 获取诊所名称列表
	var clinicList model.VaccineClinicList
	if err := s.db.Where("vaccine_name = ?", vaccineName).First(&clinicList).Error; err != nil {
		return nil, err
	}
	clinicNames := strings.Split(clinicList.ClinicList, ";")

	// 获取诊所位置
	var clinics []clinicPosition
	for _, clinicName := range clinicNames {
		var clinic model.Clinic
		var position clinicPosition
		// var clinic clinicPosition
		if err := s.db.Model(&model.Clinic{}).Where("clinic_name = ?", clinicName).First(&clinic).Error; err != nil {
			return nil, err
		}
		position.ClinicName = clinic.ClinicName
		position.Latitude = clinic.Latitude
		position.Longitude = clinic.Longitude
		clinics = append(clinics, position)
	}

	return clinics, nil
}

func (s *ClinicService) GetClinicsByClinicName(clinicName string) (model.Clinic, error) {
	var clinic model.Clinic
	if err := s.db.Where("clinic_name = ?", clinicName).First(&clinic).Error; err != nil {
		return clinic, err
	}
	return clinic, nil
}

func (s *ClinicService) GetClinicByID(id uint) (model.VaccineClinicList, error) {
	var clinic model.VaccineClinicList
	if err := s.db.First(&clinic, id).Error; err != nil {
		return clinic, err
	}
	return clinic, nil
}

func (s *ClinicService) UpdateClinicByID(id uint, clinic model.VaccineClinicList) error {
	return s.db.Model(&clinic).Where("id = ?", id).Updates(clinic).Error
}

func (s *ClinicService) DeleteClinicByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.VaccineClinicList{}).Error
}
