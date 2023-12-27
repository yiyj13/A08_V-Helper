package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestVaccinationRecordService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIVaccinationRecordService(ctrl)
	m.EXPECT().CreateVaccinationRecord(gomock.Any()).Return(nil)

	err := m.CreateVaccinationRecord(model.VaccinationRecord{
		ProfileID:       1,
		VaccineID:       1,
		VaccinationDate: "2021-07-01 12:00",
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestVaccinationRecordService_GetAllVaccinationRecords(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIVaccinationRecordService(ctrl)
	m.EXPECT().GetAllVaccinationRecords().Return([]model.VaccinationRecord{}, nil)

	_, err := m.GetAllVaccinationRecords()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
