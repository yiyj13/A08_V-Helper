package config

import (
	"fmt"
	"os"
)

type Config struct {
	DBUser     string
	DBPassword string
	DBName     string
	DBHost     string // DBHost 应为 Docker Compose 服务名称
	DBPort     string
}

func LoadConfig() Config {
	return Config{
		DBUser:     os.Getenv("DB_USER"),
		DBPassword: os.Getenv("DB_PASSWORD"),
		DBName:     os.Getenv("DB_NAME"),
		DBHost:     os.Getenv("DB_HOST"), // 在 Docker Compose 环境中，这通常是服务名称
		DBPort:     os.Getenv("DB_PORT"),
	}
}

func (c Config) BuildDSN() string {
	// 在 Docker 环境中，DBHost 应指向 Docker Compose 服务名称
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true&loc=Asia%%2FShanghai",
		c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName)
}
