package handler

import (
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	userService := service.NewUserService(db)
	userHandler := NewUserHandler(userService)

	router.GET("/users", userHandler.HandleGetAllUsers)
	router.POST("/users", userHandler.HandleCreateUser)
	router.GET("/users/:id", userHandler.HandleGetUserByID)
	router.PUT("/users/:id", userHandler.HandleUpdateUserByID)
	router.DELETE("/users/:id", userHandler.HandleDeleteUserByID)

	profileService := service.NewProfileService(db)
	profileHandler := NewProfileHandler(profileService)

	router.GET("/profiles", profileHandler.HandleGetAllProfiles)
	router.POST("/profiles", profileHandler.HandleCreateProfile)
	router.GET("/profiles/:id", profileHandler.HandleGetProfileByID)
	router.PUT("/profiles/:id", profileHandler.HandleUpdateProfileByID)
	router.DELETE("/profiles/:id", profileHandler.HandleDeleteProfileByID)
	router.GET("/profiles/user/:id", profileHandler.HandleGetProfilesByUserID)

	vaccineService := service.NewVaccineService(db)
	vaccineHandler := NewVaccineHandler(vaccineService)

	router.GET("/vaccines", vaccineHandler.HandleGetAllVaccines)
	router.POST("/vaccines", vaccineHandler.HandleCreateVaccine)
	router.GET("/vaccines/:id", vaccineHandler.HandleGetVaccineByID)
	router.PUT("/vaccines/:id", vaccineHandler.HandleUpdateVaccineByID)
	router.DELETE("/vaccines/:id", vaccineHandler.HandleDeleteVaccineByID)

	vaccinationRecordService := service.NewVaccinationRecordService(db)
	vaccinationRecordHandler := NewVaccinationRecordHandler(vaccinationRecordService)

	router.GET("/vaccination-records", vaccinationRecordHandler.HandleGetAllVaccinationRecords)
	router.POST("/vaccination-records", vaccinationRecordHandler.HandleCreateVaccinationRecord)
	router.GET("/vaccination-records/:id", vaccinationRecordHandler.HandleGetVaccinationRecordByID)
	router.PUT("/vaccination-records/:id", vaccinationRecordHandler.HandleUpdateVaccinationRecordByID)
	router.DELETE("/vaccination-records/:id", vaccinationRecordHandler.HandleDeleteVaccinationRecordByID)
	router.GET("/vaccination-records/profile/:id", vaccinationRecordHandler.HandleGetVaccinationRecordsByProfileID)

}
