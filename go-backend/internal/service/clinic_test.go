package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestClinicService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIClinicService(ctrl)
	m.EXPECT().CreateClinic(gomock.Any()).Return(nil)

	err := m.CreateClinic(model.VaccineClinicList{
		VaccineName: "test疫苗名称",
		ClinicList:  "test诊所列表",
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestClinicService_GetAllClinics(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIClinicService(ctrl)
	m.EXPECT().GetAllClinics().Return([]model.Clinic{}, nil)

	_, err := m.GetAllClinics()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
