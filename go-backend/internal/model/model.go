package model

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name     string
	Email    string `gorm:"unique"`
	Password string
}

type LoginUser struct {
	Email    string
	Password string
}

type Article struct {
	gorm.Model
	Title   string
	Content string
	UserID  uint
}
