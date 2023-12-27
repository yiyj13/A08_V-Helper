package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestTempertureRecordService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockITempertureRecordService(ctrl)
	m.EXPECT().CreateTempertureRecord(gomock.Any()).Return(nil)

	err := m.CreateTempertureRecord(model.TempertureRecord{
		ProfileID:   1,
		Date:        "2021-07-01 12:00",
		Temperature: 36.5,
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestTempertureRecordService_GetAllTempertureRecords(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockITempertureRecordService(ctrl)
	m.EXPECT().GetAllTempertureRecords().Return([]model.TempertureRecord{}, nil)

	_, err := m.GetAllTempertureRecords()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
