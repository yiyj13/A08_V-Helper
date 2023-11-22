package handler

import (
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	userService := service.NewUserService(db)
	userHandler := NewUserHandler(userService)

	router.GET("/users", userHandler.GetAllUsers)
	router.POST("/users", userHandler.CreateUser)

	authService := service.NewAuthService(db)
	router.POST("/login", authService.Login)
	router.POST("/register", authService.Register)

}
