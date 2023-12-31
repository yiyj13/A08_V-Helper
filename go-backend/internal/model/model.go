package model

import (
	"gorm.io/gorm"
)

// User 用户模型
// 查询关注的疫苗和文章时，使用 Preload 方法
// 增加和删除关注的疫苗和文章时，使用 Association 方法
type User struct {
	gorm.Model                  //gorm.Model 包含了 CreatedAt、UpdatedAt、DeletedAt（用于软删除）以及 ID 字段
	OpenID            string    `gorm:"unique" json:"-"` // 微信用户唯一标识符，不在JSON中显示
	UserName          string    `json:"userName"`
	Password          string    `json:"-"` // 存储哈希值，JSON中忽略 -> 使用微信API，不需要密码
	Email             string    `json:"email"`
	Phone             string    `json:"phone"`
	Avatar            string    `json:"avatar"`                                                      // 头像链接
	FollowingVaccines []Vaccine `gorm:"many2many:user_following_vaccines;" json:"followingVaccines"` // 用户关注的疫苗
	FollowingArticles []Article `gorm:"many2many:user_following_articles;" json:"followingArticles"` // 用户关注的文章
	Token             string    `gorm:"-" json:"token"`                                              // 登录时返回的token，用于校验用户身份
}

// Profile 身份模型
type Profile struct {
	gorm.Model
	UserID       uint   `json:"userId"`
	FullName     string `json:"fullName"`
	Gender       string `json:"gender"`
	DateOfBirth  string `json:"dateOfBirth"`
	Relationship string `json:"relationship"`
	Avatar       string `json:"avatar"`
}

// Vaccine 疫苗模型
type Vaccine struct {
	gorm.Model
	Name          string `json:"name"`
	Description   string `json:"description"`
	TargetDisease string `json:"targetDisease"`
	SideEffects   string `json:"sideEffects"`
	Precautions   string `json:"precautions"` // 接种前注意事项
	ValidPeriod   int    `json:"validPeriod"` // 有效期，单位为天
	Type          string `json:"type"`        // 疫苗类型，常规疫苗、特殊疫苗、其他
}

// VaccinationRecord 接种记录模型
// 对应一个Profile和一个Vaccine，记录接种类型、接种时间、接种地点、接种凭证、疫苗失效时间、备注，同时希望能看到疫苗的详细信息(名称、有效期...)
// 是否完成接种，未完成则为预约接种
// 是否提醒，提醒时间，用字符串存具体时间，例如"2021-07-01 12:00"
type VaccinationRecord struct {
	gorm.Model
	ProfileID           uint    `json:"profileId"`
	VaccineID           uint    `json:"vaccineId"`
	Vaccine             Vaccine `gorm:"foreignKey:VaccineID" json:"vaccine"`
	VaccinationDate     string  `json:"vaccinationDate"` // 注意用string与前端交互，例如"2021-07-01"
	Voucher             string  `json:"voucher"`         // 接种凭证，之后实现为图片链接
	VaccinationLocation string  `json:"vaccinationLocation"`
	VaccinationType     string  `json:"vaccinationType"`     // 接种类型，第一针、第二针、加强针
	NextVaccinationDate string  `json:"nextVaccinationDate"` // 疫苗失效时间
	Note                string  `json:"note"`

	Valid        string `json:"valid"`        // 前端表单
	RemindBefore string `json:"remindBefore"` // 前端表单

	IsCompleted bool   `json:"isCompleted"` // 是否完成接种，未完成则为预约接种
	Reminder    bool   `json:"reminder"`    // 是否提醒
	RemindTime  string `json:"remindTime"`  // 提醒时间，用字符串存具体时间，例如"2021-07-01 12:00"
}

// TempertureRecord 体温记录模型
type TempertureRecord struct {
	gorm.Model
	ProfileID   uint    `json:"profileId"`
	Date        string  `json:"date"` // 包含日期和时间，例如"2021-07-01 12:00"
	Temperature float32 `json:"temperature"`
}

// Article 文章模型，与疫苗绑定
type Article struct {
	gorm.Model
	Title     string `json:"title"`
	Content   string `json:"content"`
	UserName  string `json:"userName"`
	UserID    uint   `json:"userId"`
	IsBind    bool   `json:"isBind"` // 是否绑定疫苗，如果未绑定，则归为其他类型
	VaccineID uint   `json:"vaccineId"`
}

// Reply 回复模型
type Reply struct {
	gorm.Model
	ArticleID uint   `json:"articleId"`
	Content   string `json:"content"`
	UserName  string `json:"userName"`
	UserID    uint   `json:"userId"`
}

// Message 消息模型
type Message struct {
	gorm.Model
	OpenID      string `json:"-"`      // 微信用户唯一标识符，不在JSON中显示
	UserID      uint   `json:"userId"` // 用户ID，用于查询用户的OpenID
	Page        string `json:"page"`   // 消息跳转页面，例如"pages/welcome/welcome"
	VaxName     string `json:"vaxName"`
	Comment     string `json:"comment"`
	VaxLocation string `json:"vaxLocation"`
	VaxNum      int    `json:"vaxNum"`
	RealTime    bool   `json:"realTime"` // 是否实时提醒
	SendTime    string `json:"sendTime"` // 如果不是实时提醒，则需要设置提醒时间，用字符串存具体时间，例如"2021-07-01 12:00"
	Sent        bool   `json:"sent"`     // 是否已发送
}

// 持有某种疫苗的所有诊所
type VaccineClinicList struct {
	gorm.Model
	VaccineName string `json:"vaccineName"`
	ClinicList  string `json:"clinicList"`
}

// 诊所信息
type Clinic struct {
	gorm.Model
	ClinicName  string `json:"clinicName"`
	VaccineList string `json:"vaccineList"`
	Latitude    string `json:"latitude"`
	Longitude   string `json:"longitude"`
	PhoneNumber string `json:"phoneNumber"`
	Address     string `json:"address"`
}
