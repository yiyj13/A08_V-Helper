package handler

import (
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	userService := service.NewUserService(db)
	userHandler := NewUserHandler(userService)
	router.POST("/users", userHandler.HandleCreateUser)
	router.GET("/users", userHandler.HandleGetAllUsers)
	router.GET("/users/:id", userHandler.HandleGetUserByID)
	router.PUT("/users/:id", userHandler.HandleUpdateUserByID)
	router.DELETE("/users/:id", userHandler.HandleDeleteUserByID)
	router.GET("/users/login", userHandler.LogInHandler)

	profileService := service.NewProfileService(db)
	profileHandler := NewProfileHandler(profileService)
	router.POST("/profiles", profileHandler.HandleCreateProfile)
	router.GET("/profiles", profileHandler.HandleGetAllProfiles)
	router.GET("/profiles/:id", profileHandler.HandleGetProfileByID)
	router.GET("/profiles/user/:userID", profileHandler.HandleGetProfilesByUserID)
	router.PUT("/profiles/:id", profileHandler.HandleUpdateProfileByID)
	router.DELETE("/profiles/:id", profileHandler.HandleDeleteProfileByID)

	vaccineService := service.NewVaccineService(db)
	vaccineHandler := NewVaccineHandler(vaccineService)
	router.POST("/vaccines", vaccineHandler.HandleCreateVaccine)
	router.GET("/vaccines", vaccineHandler.HandleGetAllVaccines)
	router.GET("/vaccines/:id", vaccineHandler.HandleGetVaccineByID)
	router.PUT("/vaccines/:id", vaccineHandler.HandleUpdateVaccineByID)
	router.DELETE("/vaccines/:id", vaccineHandler.HandleDeleteVaccineByID)

	vaccinationRecordService := service.NewVaccinationRecordService(db)
	vaccinationRecordHandler := NewVaccinationRecordHandler(vaccinationRecordService)
	router.POST("/vaccination-records", vaccinationRecordHandler.HandleCreateVaccinationRecord)
	router.GET("/vaccination-records", vaccinationRecordHandler.HandleGetAllVaccinationRecords)
	router.GET("/vaccination-records/:id", vaccinationRecordHandler.HandleGetVaccinationRecordByID)
	router.GET("/vaccination-records/profile/:profileID", vaccinationRecordHandler.HandleGetVaccinationRecordsByProfileID)
	router.PUT("/vaccination-records/:id", vaccinationRecordHandler.HandleUpdateVaccinationRecordByID)
	router.DELETE("/vaccination-records/:id", vaccinationRecordHandler.HandleDeleteVaccinationRecordByID)

	tempertureRecordService := service.NewTempertureRecordService(db)
	tempertureRecordHandler := NewTempertureRecordHandler(tempertureRecordService)
	router.POST("/temperature-records", tempertureRecordHandler.HandleCreateTempertureRecord)
	router.GET("/temperature-records", tempertureRecordHandler.HandleGetAllTempertureRecords)
	router.GET("/temperature-records/:id", tempertureRecordHandler.HandleGetTempertureRecordByID)
	router.GET("/temperature-records/profile/:profileID", tempertureRecordHandler.HandleGetTempertureRecordsByProfileID)
	router.PUT("/temperature-records/:id", tempertureRecordHandler.HandleUpdateTempertureRecordByID)
	router.DELETE("/temperature-records/:id", tempertureRecordHandler.HandleDeleteTempertureRecordByID)

	// 帖子
	articleService := service.NewArticleService(db)
	articleHandler := NewArticleHandler(articleService)
	router.POST("/articles", articleHandler.HandleCreateArticle)
	router.GET("/articles", articleHandler.HandleGetAllArticles)
	router.GET("/articles/:id", articleHandler.HandleGetArticleByID)
	router.GET("/articles/user/:userID", articleHandler.HandleGetArticlesByUserID)
	router.PUT("/articles/:id", articleHandler.HandleUpdateArticleByID)
	router.DELETE("/articles/:id", articleHandler.HandleDeleteArticleByID)

	// 帖子回复
	replyService := service.NewReplyService(db)
	replyHandler := NewReplyHandler(replyService)
	router.GET("/replys", replyHandler.HandleGetReplys)
	router.POST("/replys", replyHandler.HandleCreateReply)
	router.GET("/replys/:id", replyHandler.HandleGetReplyByID)
	router.PUT("/replys/:id", replyHandler.HandleUpdateReplyByID)
	router.DELETE("/replys/:id", replyHandler.HandleDeleteReplyByID)

}
