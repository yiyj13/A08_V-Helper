package db

import (
	"log"
	"time"
	"v-helper/internal/model"
	"v-helper/pkg/config"

	"encoding/json"
	"io"
	"os"

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
	db.AutoMigrate(
		&model.User{},
		&model.Profile{},
		&model.Vaccine{},
		&model.VaccinationRecord{},
		&model.TempertureRecord{},
		&model.Article{},
		&model.Reply{},
		&model.Message{},
	)

	AddVaxInfo(db)
	return db
}

// 用于在数据库初始化时添加疫苗信息
// 考虑用数据库脚本替换
func AddVaxInfo(db *gorm.DB) error {
	// 读取json文件
	jsonFile, err := os.Open("pkg/db/vaxinfo.json")
	if err != nil {
		log.Fatalf("Error opening JSON file: %v", err)
		return err
	}
	defer jsonFile.Close()
	byteValue, _ := io.ReadAll(jsonFile)

	var slice_vaccine []model.Vaccine
	err = json.Unmarshal(byteValue, &slice_vaccine)
	if err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
		return err
	}

	// 遍历要添加的疫苗信息切片
	for _, vaccine := range slice_vaccine {
		// 查询数据库中是否已经存在相同名称的疫苗
		var existingVaccine model.Vaccine
		err := db.Where("name = ?", vaccine.Name).First(&existingVaccine).Error

		// 数据库中不存在该疫苗，添加到数据库
		// 如果已经存在，则更新数据库中的疫苗信息
		if err != nil {
			db.Create(&vaccine)
		} else {
			db.Model(&existingVaccine).Updates(vaccine)
		}
	}

	return nil
}
