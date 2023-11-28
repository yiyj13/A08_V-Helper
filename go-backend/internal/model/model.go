package model

import (
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
	UserID       uint   `json:"userId"`
	FullName     string `json:"fullName"`
	Gender       string `json:"gender"`
	DateOfBirth  string `json:"dateOfBirth"`
	Relationship string `json:"relationship"`
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
// 对应一个Profile和一个Vaccine，记录接种类型、接种时间、接种凭证、备注，同时希望能看到疫苗的详细信息(名称、有效期...)
// 地点、是否提醒、下次接种时间
type VaccinationRecord struct {
	gorm.Model
	ProfileID           uint    `json:"profileId"`
	VaccineID           uint    `json:"vaccineId"`
	Vaccine             Vaccine `gorm:"foreignKey:VaccineID" json:"vaccine"`
	VaccinationDate     string  `json:"vaccinationDate"` // 注意用string与前端交互
	Voucher             string  `json:"voucher"`
	VaccinationLocation string  `json:"vaccinationLocation"`
	Reminder            bool    `json:"reminder"`
	NextVaccinationDate string  `json:"nextVaccinationDate"`
	Note                string  `json:"note"`
}

// TempertureRecord 体温记录模型
type TempertureRecord struct {
	gorm.Model
	ProfileID  uint    `json:"profileId"`
	Date       string  `json:"date"`
	Temperture float32 `json:"temperture"`
}

// Article 文章模型
type Article struct {
	gorm.Model
	Title    string `json:"title"`
	Content  string `json:"content"`
	UserName string `json:"userName"`
	UserID   uint   `json:"userId"`
}

// Reply 回复模型
type Reply struct {
	gorm.Model
	ArticleID uint   `json:"articleId"`
	Content   string `json:"content"`
	UserName  string `json:"userName"`
	UserID    uint   `json:"userId"`
}
