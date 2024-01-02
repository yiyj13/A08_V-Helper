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

	// 创建需要JWT认证的路由组
	authGroup := router.Group("/")
	// disable auth for tests
	// authGroup.Use(JWTAuthMiddleware())
	// {
	authGroup.POST("/users", userHandler.HandleCreateUser)
	authGroup.GET("/users", userHandler.HandleGetAllUsers)
	authGroup.GET("/users/:id", userHandler.HandleGetUserByID)
	authGroup.PUT("/users/:id", userHandler.HandleUpdateUserByID)
	authGroup.DELETE("/users/:id", userHandler.HandleDeleteUserByID)
	authGroup.GET("/users/:id/following", userHandler.HandleGetUserWithFollowings)
	authGroup.GET("/users/addfollowingVaccine/:id", userHandler.HandleAddFollowingVaccine)
	authGroup.GET("/users/removefollowingVaccine/:id", userHandler.HandleRemoveFollowingVaccine)
	authGroup.GET("/users/addfollowingArticle/:id", userHandler.HandleAddFollowingArticle)
	authGroup.GET("/users/removefollowingArticle/:id", userHandler.HandleRemoveFollowingArticle)

	profileService := service.NewProfileService(db)
	profileHandler := NewProfileHandler(profileService)
	authGroup.POST("/profiles", profileHandler.HandleCreateProfile)
	authGroup.GET("/profiles", profileHandler.HandleGetAllProfiles)
	authGroup.GET("/profiles/:id", profileHandler.HandleGetProfileByID)
	authGroup.GET("/profiles/user/:userID", profileHandler.HandleGetProfilesByUserID)
	authGroup.PUT("/profiles/:id", profileHandler.HandleUpdateProfileByID)
	authGroup.DELETE("/profiles/:id", profileHandler.HandleDeleteProfileByID)

	vaccineService := service.NewVaccineService(db)
	vaccineHandler := NewVaccineHandler(vaccineService)
	authGroup.POST("/vaccines", vaccineHandler.HandleCreateVaccine)
	authGroup.GET("/vaccines", vaccineHandler.HandleGetAllVaccines)
	authGroup.GET("/vaccines/:id", vaccineHandler.HandleGetVaccineByID)
	authGroup.PUT("/vaccines/:id", vaccineHandler.HandleUpdateVaccineByID)
	authGroup.DELETE("/vaccines/:id", vaccineHandler.HandleDeleteVaccineByID)

	vaccinationRecordService := service.NewVaccinationRecordService(db)
	vaccinationRecordHandler := NewVaccinationRecordHandler(vaccinationRecordService)
	authGroup.POST("/vaccination-records", vaccinationRecordHandler.HandleCreateVaccinationRecord)
	authGroup.GET("/vaccination-records", vaccinationRecordHandler.HandleGetAllVaccinationRecords)
	authGroup.GET("/vaccination-records/:id", vaccinationRecordHandler.HandleGetVaccinationRecordByID)
	authGroup.GET("/vaccination-records/user/:userID", vaccinationRecordHandler.HandleGetVaccinationRecordsByUserID)
	authGroup.GET("/vaccination-records/profile/:profileID", vaccinationRecordHandler.HandleGetVaccinationRecordsByProfileID)
	authGroup.PUT("/vaccination-records/:id", vaccinationRecordHandler.HandleUpdateVaccinationRecordByID)
	authGroup.DELETE("/vaccination-records/:id", vaccinationRecordHandler.HandleDeleteVaccinationRecordByID)

	tempertureRecordService := service.NewTempertureRecordService(db)
	tempertureRecordHandler := NewTempertureRecordHandler(tempertureRecordService)
	authGroup.POST("/temperature-records", tempertureRecordHandler.HandleCreateTempertureRecord)
	authGroup.GET("/temperature-records", tempertureRecordHandler.HandleGetAllTempertureRecords)
	authGroup.GET("/temperature-records/:id", tempertureRecordHandler.HandleGetTempertureRecordByID)
	authGroup.GET("/temperature-records/user/:userID", tempertureRecordHandler.HandleGetTempertureRecordsByUserID)
	authGroup.GET("/temperature-records/profile/:profileID", tempertureRecordHandler.HandleGetTempertureRecordsByProfileID)
	authGroup.PUT("/temperature-records/:id", tempertureRecordHandler.HandleUpdateTempertureRecordByID)
	authGroup.DELETE("/temperature-records/:id", tempertureRecordHandler.HandleDeleteTempertureRecordByID)
	// }
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
	router.GET("/clinics/:id", clinicHandler.HandleGetClinicByID)
	router.PUT("/clinics/:id", clinicHandler.HandleUpdateClinicByID)
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
