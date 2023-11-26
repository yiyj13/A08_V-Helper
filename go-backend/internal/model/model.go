package model

import (
	"time"

	"gorm.io/gorm"
)

// User 用户模型
type User struct {
	gorm.Model        //gorm.Model 包含了 CreatedAt、UpdatedAt、DeletedAt（用于软删除）以及 ID 字段
	UserName   string `gorm:"unique" json:"userName"`
	Password   string `json:"-"` // 存储哈希值，JSON中忽略
	Email      string `gorm:"unique" json:"email"`
	Phone      string `gorm:"unique" json:"phone"`
}

// Profile 身份模型
type Profile struct {
	gorm.Model
	UserID       uint      `json:"userId"`
	FullName     string    `json:"fullName"`
	Gender       string    `json:"gender"`
	DateOfBirth  time.Time `json:"dateOfBirth"`
	Relationship string    `json:"relationship"`
}

// Vaccine 疫苗模型
type Vaccine struct {
	gorm.Model
	Name          string `json:"name"`
	Description   string `json:"description"`
	TargetDisease string `json:"targetDisease"`
	SideEffects   string `json:"sideEffects"`
	Precautions   string `json:"precautions"`
}

// VaccinationRecord 接种记录模型
type VaccinationRecord struct {
	gorm.Model
	ProfileID           uint      `json:"profileId"`
	VaccineID           uint      `json:"vaccineId"`
	VaccinationDate     time.Time `json:"vaccinationDate"`
	VaccinationLocation string    `json:"vaccinationLocation"`
	VaccinationDoctor   string    `json:"vaccinationDoctor"`
	NextVaccinationDate time.Time `json:"nextVaccinationDate"`
}

// Article 文章模型
type Article struct {
	gorm.Model
	Title    string `json:"title"`
	Content  string `json:"content"`
	UserName string `json:"userName"`
	UserID   uint   `json:"userId"`
}
