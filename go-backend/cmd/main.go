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

	// 从环境变量中加载配置
	cfg := config.LoadConfig()

	// 初始化数据库连接
	database := db.Init(cfg)

	// 创建路由
	r := gin.Default()

	// 注册路由
	handler.SetupRoutes(r, database, cfg)
	r.Run() // 默认在 8080 端口运行
}
