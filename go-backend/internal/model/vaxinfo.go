package model

import (
	"gorm.io/gorm"
)

type VaccineInfo struct {
	gorm.Model
	Name             string
	Adverse          string
	Contraindication string
}

type QueryVaccineInfo struct {
	Name string
}
