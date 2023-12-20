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
	err = db.AutoMigrate(
		&model.User{},
		&model.Profile{},
		&model.Vaccine{},
		&model.VaccinationRecord{},
		&model.TempertureRecord{},
		&model.Article{},
		&model.Reply{},
		&model.Message{},
		&model.VaccineClinicList{},
		&model.Clinic{},
	)

	if err != nil {
		log.Fatalf("Error migrating database: %v", err)
	}

	AddInitInfo(db)
	return db
}

// 用于在数据库初始化时添加疫苗信息、接种点信息
func AddInitInfo(db *gorm.DB) error {
	// 初始化疫苗信息

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

	// 初始化疫苗-接种点信息
	jsonFile, err = os.Open("pkg/db/vaccine_clinic_lists.json")
	if err != nil {
		log.Fatalf("Error opening JSON file: %v", err)
		return err
	}
	defer jsonFile.Close()
	byteValue, _ = io.ReadAll(jsonFile)

	var slice_vaccine_clinic_list []model.VaccineClinicList
	err = json.Unmarshal(byteValue, &slice_vaccine_clinic_list)
	if err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
		return err
	}

	// 遍历要添加的疫苗信息切片
	for _, clinic := range slice_vaccine_clinic_list {
		// 查询数据库中是否已经存在相同名称的疫苗
		var existingClinic model.VaccineClinicList
		err := db.Where("vaccine_name = ?", clinic.VaccineName).First(&existingClinic).Error

		// 数据库中不存在该疫苗，添加到数据库
		// 如果已经存在，则更新数据库中的疫苗信息
		if err != nil {
			db.Create(&clinic)
		} else {
			db.Model(&existingClinic).Updates(clinic)
		}
	}

	// 初始化诊所信息
	jsonFile, err = os.Open("pkg/db/clinics.json")
	if err != nil {
		log.Fatalf("Error opening JSON file: %v", err)
		return err
	}
	defer jsonFile.Close()
	byteValue, _ = io.ReadAll(jsonFile)

	var slice_clinic []model.Clinic
	err = json.Unmarshal(byteValue, &slice_clinic)
	if err != nil {
		log.Fatalf("Error unmarshalling JSON: %v", err)
		return err
	}

	// 遍历要添加的疫苗信息切片
	for _, clinic := range slice_clinic {
		// 查询数据库中是否已经存在相同名称的疫苗
		var existingClinic model.Clinic
		err := db.Where("clinic_name = ?", clinic.ClinicName).First(&existingClinic).Error

		// 数据库中不存在该疫苗，添加到数据库
		// 如果已经存在，则更新数据库中的疫苗信息
		if err != nil {
			db.Create(&clinic)
		} else {
			db.Model(&existingClinic).Updates(clinic)
		}
	}

	return nil
}
