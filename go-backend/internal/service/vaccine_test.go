package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestVaccineService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIVaccineService(ctrl)
	m.EXPECT().CreateVaccine(gomock.Any()).Return(nil)

	err := m.CreateVaccine(model.Vaccine{
		Name:          "test疫苗名称",
		Description:   "test疫苗描述",
		TargetDisease: "test目标疾病",
		SideEffects:   "test副作用",
		Precautions:   "test注意事项",
		ValidPeriod:   30,
		Type:          "test疫苗类型",
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestVaccineService_GetAllVaccines(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIVaccineService(ctrl)
	m.EXPECT().GetAllVaccines().Return([]model.Vaccine{}, nil)

	_, err := m.GetAllVaccines()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
