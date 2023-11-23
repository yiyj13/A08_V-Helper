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
