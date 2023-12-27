package main

import (
	"time"
	"v-helper/internal/handler"
	"v-helper/pkg/db"

	"v-helper/pkg/config"

	"github.com/gin-gonic/gin"
)

func main() {
	// 设置时区为中国时区
	loc, err := time.LoadLocation("Asia/Shanghai")
	if err != nil {
		panic(err)
	}
	time.Local = loc

	cfg := config.LoadConfig()
	database := db.Init(cfg)

	r := gin.Default()

	// 创建测试路由
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	handler.SetupRoutes(r, database)
	r.Run() // 默认在 8080 端口运行
}
