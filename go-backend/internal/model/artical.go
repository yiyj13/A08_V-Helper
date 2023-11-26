package model

import (
	"gorm.io/gorm"
)

type Post struct {
	gorm.Model
	Title       string `json:"title"`
	Content     string `json:"content"`
	CreatorName string `json:"creatorName"`
	// CreatorID   uint   `json:"creatorId"`
}
