package model

import (
	"gorm.io/gorm"
)

type VaccineInfo struct {
	gorm.Model
	Name             string
	TargetDisease    string // 目标疾病
	SideEffects      string // 副作用
	Contraindication string // 禁忌
}

type QueryVaccineInfo struct {
	Name string
}
