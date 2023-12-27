package handler

import (
	"log"
	"net/http"
	"strings"
	"v-helper/internal/service"
	"v-helper/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB) {
	userService := service.NewUserService(db)
	userHandler := NewUserHandler(userService)
	router.GET("/auth", userHandler.AuthHandler)
	router.GET("/users/login", userHandler.LogInHandler)
	router.GET("/users/public/:id", userHandler.HandleGetPublicUserByID)

	router.Use(JWTAuthMiddleware())
	{
		router.POST("/users", userHandler.HandleCreateUser)
		router.GET("/users", userHandler.HandleGetAllUsers)
		router.GET("/users/:id", userHandler.HandleGetUserByID)
		router.PUT("/users/:id", userHandler.HandleUpdateUserByID)
		router.DELETE("/users/:id", userHandler.HandleDeleteUserByID)
		router.GET("/users/:id/following", userHandler.HandleGetUserWithFollowings)
		router.GET("/users/addfollowingVaccine/:id", userHandler.HandleAddFollowingVaccine)
		router.GET("/users/removefollowingVaccine/:id", userHandler.HandleRemoveFollowingVaccine)
		router.GET("/users/addfollowingArticle/:id", userHandler.HandleAddFollowingArticle)
		router.GET("/users/removefollowingArticle/:id", userHandler.HandleRemoveFollowingArticle)

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
		router.GET("/vaccination-records/user/:userID", vaccinationRecordHandler.HandleGetVaccinationRecordsByUserID)
		router.GET("/vaccination-records/profile/:profileID", vaccinationRecordHandler.HandleGetVaccinationRecordsByProfileID)
		router.PUT("/vaccination-records/:id", vaccinationRecordHandler.HandleUpdateVaccinationRecordByID)
		router.DELETE("/vaccination-records/:id", vaccinationRecordHandler.HandleDeleteVaccinationRecordByID)

		tempertureRecordService := service.NewTempertureRecordService(db)
		tempertureRecordHandler := NewTempertureRecordHandler(tempertureRecordService)
		router.POST("/temperature-records", tempertureRecordHandler.HandleCreateTempertureRecord)
		router.GET("/temperature-records", tempertureRecordHandler.HandleGetAllTempertureRecords)
		router.GET("/temperature-records/:id", tempertureRecordHandler.HandleGetTempertureRecordByID)
		router.GET("/temperature-records/user/:userID", tempertureRecordHandler.HandleGetTempertureRecordsByUserID)
		router.GET("/temperature-records/profile/:profileID", tempertureRecordHandler.HandleGetTempertureRecordsByProfileID)
		router.PUT("/temperature-records/:id", tempertureRecordHandler.HandleUpdateTempertureRecordByID)
		router.DELETE("/temperature-records/:id", tempertureRecordHandler.HandleDeleteTempertureRecordByID)
	}
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
	router.POST("/replys", replyHandler.HandleCreateReply)
	router.GET("/replys", replyHandler.HandleGetReplys)
	router.GET("/replys/:id", replyHandler.HandleGetReplyByID)
	router.PUT("/replys/:id", replyHandler.HandleUpdateReplyByID)
	router.DELETE("/replys/:id", replyHandler.HandleDeleteReplyByID)

	// 通知发送
	messageService := service.NewMessageService(db)
	messageHandler := NewMessageHandler(messageService)
	go messageHandler.MessageScheduler()
	router.POST("/messages", messageHandler.HandleAddMessage)
	router.GET("/messages", messageHandler.HandleGetAllMessages)
	router.GET("/messages/:id", messageHandler.HandleGetMessageByID)
	router.PUT("/messages/:id", messageHandler.HandleUpdateMessageByID)
	router.DELETE("/messages/:id", messageHandler.HandleDeleteMessageByID)

	// 根据疫苗寻找诊所
	clinicService := service.NewClinicService(db)
	clinicHandler := NewClinicHandler(clinicService)
	router.GET("/clinics/vaccine/:vaccineID", clinicHandler.HandleGetClinicsByVaccineID)
	router.GET("/clinics/vaccineName/:vaccineName", clinicHandler.HandleGetClinicsByVaccineName)
	router.GET("/clinics/clinicName/:clinicName", clinicHandler.HandleGetClinicsByClinicName)
	router.POST("/clinics", clinicHandler.HandleCreateClinic)
	router.GET("/clinics", clinicHandler.HandleGetAllClinics)
	// router.GET("/clinics/:id", clinicHandler.HandleGetClinicByID)
	// router.PUT("/clinics/:id", clinicHandler.HandleUpdateClinicByID)
	router.DELETE("/clinics/:id", clinicHandler.HandleDeleteClinicByID)
	router.GET("/wechat-validation", handleWechatValidation)
	router.POST("/wechat-validation", SetSubscription)
}

func JWTAuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")

		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// 分割Bearer和实际的token
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header format must be Bearer {token}"})
			c.Abort()
			return
		}

		token := parts[1]
		log.Println("token:", token)

		ok, err := utils.VerifyToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			c.Abort()
			return
		}

		if !ok {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}
		c.Next()
	}
}
