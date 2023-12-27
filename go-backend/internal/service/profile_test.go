package service

import (
	"testing"
	"v-helper/internal/model"

	"github.com/golang/mock/gomock"
)

func TestProfileService(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIProfileService(ctrl)
	m.EXPECT().CreateProfile(gomock.Any()).Return(nil)

	err := m.CreateProfile(model.Profile{
		UserID:       1,
		FullName:     "testFullName",
		Gender:       "testGender",
		DateOfBirth:  "testDateOfBirth",
		Relationship: "testRelationship",
		Avatar:       "testAvatar",
	})
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}

func TestProfileService_GetAllProfiles(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	m := NewMockIProfileService(ctrl)
	m.EXPECT().GetAllProfiles().Return([]model.Profile{}, nil)

	_, err := m.GetAllProfiles()
	if err != nil {
		t.Errorf("Expected nil, got %v", err)
	}
}
