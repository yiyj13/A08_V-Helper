package db

import (
	"log"
	"time"
	"v-helper/internal/model"
	"v-helper/pkg/config"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

// Init 初始化数据库连接
func Init(cfg config.Config) *gorm.DB {
	dsn := cfg.BuildDSN()

	time.Sleep(3 * time.Second)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Error connecting to database: %v, dsn: %v", err, dsn)
	}

	// 自动迁移，注意每新建一个 model 都需要在此处添加
	db.AutoMigrate(&model.User{}, &model.Article{}, &model.Profile{}, &model.Vaccine{}, &model.VaccinationRecord{})

	return db
}

func AddVaxInfo(db *gorm.DB) error {
	var vaxCount int64
	if err := db.Model(&model.VaccineInfo{}).Count(&vaxCount).Error; err != nil {
		log.Fatalf("Error getting vaccine info count: %v", err)
		return err
	}

	slice_vaccine := []model.VaccineInfo{
		{Name: "Pfizer", Adverse: "Fever", Contraindication: "none"},
		{Name: "Sinovac", Adverse: "Fever", Contraindication: "none"},
	}

	// 遍历要添加的疫苗信息切片
	for _, vaccine := range slice_vaccine {
		// 查询数据库中是否已经存在相同名称的疫苗
		var existingVaccine model.VaccineInfo
		result := db.Where("name = ?", vaccine.Name).First(&existingVaccine)

		if result.Error == gorm.ErrRecordNotFound {
			// 数据库中不存在该疫苗，添加到数据库
			if err := db.Create(&vaccine).Error; err != nil {
				log.Fatalf("Error creating vaccine info: %v", err)
				return err
			}
		} else if result.Error != nil {
			// 查询时发生其他错误
			log.Fatalf("Error checking vaccine existence: %v", result.Error)
			return result.Error
		}
	}

	return nil
}
