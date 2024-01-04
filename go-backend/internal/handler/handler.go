package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"reflect"
	"strings"
	"v-helper/internal/model"
	"v-helper/internal/service"
	"v-helper/pkg/config"
	"v-helper/pkg/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRoutes(router *gin.Engine, db *gorm.DB, cfg config.Config) {
	userService := service.NewUserService(db)  // 创建用户服务
	userHandler := NewUserHandler(userService) // 创建用户处理器
	router.GET("/auth", userHandler.AuthHandler)
	router.GET("/users/login", userHandler.LogInHandler)
	router.GET("/users/public/:id", userHandler.HandleGetPublicUserByID)

	profileService := service.NewProfileService(db)     // 创建身份服务
	profileHandler := NewProfileHandler(profileService) // 创建身份处理器

	vaccineService := service.NewVaccineService(db)     // 创建疫苗服务
	vaccineHandler := NewVaccineHandler(vaccineService) // 创建疫苗处理器

	vaccinationRecordService := service.NewVaccinationRecordService(db)               // 创建接种记录服务
	vaccinationRecordHandler := NewVaccinationRecordHandler(vaccinationRecordService) // 创建接种记录处理器

	tempertureRecordService := service.NewTempertureRecordService(db)              // 创建体温记录服务
	tempertureRecordHandler := NewTempertureRecordHandler(tempertureRecordService) // 创建体温记录处理器

	// 创建需要JWT认证的路由组
	authGroup := router.Group("/")
	// disable auth for tests
	authGroup.Use(JWTAuthMiddleware())
	{
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

		authGroup.POST("/profiles", DecryptionAndBindingMiddleware(&model.Profile{}), profileHandler.HandleCreateProfile)
		authGroup.GET("/profiles", profileHandler.HandleGetAllProfiles)
		authGroup.GET("/profiles/:id", profileHandler.HandleGetProfileByID)
		authGroup.GET("/profiles/user/:userID", profileHandler.HandleGetProfilesByUserID)
		authGroup.PUT("/profiles/:id", DecryptionAndBindingMiddleware(&model.Profile{}), profileHandler.HandleUpdateProfileByID)
		authGroup.DELETE("/profiles/:id", profileHandler.HandleDeleteProfileByID)

		authGroup.POST("/vaccines", vaccineHandler.HandleCreateVaccine)
		authGroup.GET("/vaccines", vaccineHandler.HandleGetAllVaccines)
		authGroup.GET("/vaccines/:id", vaccineHandler.HandleGetVaccineByID)
		authGroup.PUT("/vaccines/:id", vaccineHandler.HandleUpdateVaccineByID)
		authGroup.DELETE("/vaccines/:id", vaccineHandler.HandleDeleteVaccineByID)

		authGroup.POST("/vaccination-records", DecryptionAndBindingMiddleware(&model.VaccinationRecord{}), vaccinationRecordHandler.HandleCreateVaccinationRecord)
		authGroup.GET("/vaccination-records", vaccinationRecordHandler.HandleGetAllVaccinationRecords)
		authGroup.GET("/vaccination-records/:id", vaccinationRecordHandler.HandleGetVaccinationRecordByID)
		authGroup.GET("/vaccination-records/user/:userID", vaccinationRecordHandler.HandleGetVaccinationRecordsByUserID)
		authGroup.GET("/vaccination-records/profile/:profileID", vaccinationRecordHandler.HandleGetVaccinationRecordsByProfileID)
		authGroup.PUT("/vaccination-records/:id", DecryptionAndBindingMiddleware(&model.VaccinationRecord{}), vaccinationRecordHandler.HandleUpdateVaccinationRecordByID)
		authGroup.DELETE("/vaccination-records/:id", vaccinationRecordHandler.HandleDeleteVaccinationRecordByID)

		authGroup.POST("/temperature-records", tempertureRecordHandler.HandleCreateTempertureRecord)
		authGroup.GET("/temperature-records", tempertureRecordHandler.HandleGetAllTempertureRecords)
		authGroup.GET("/temperature-records/:id", tempertureRecordHandler.HandleGetTempertureRecordByID)
		authGroup.GET("/temperature-records/user/:userID", tempertureRecordHandler.HandleGetTempertureRecordsByUserID)
		authGroup.GET("/temperature-records/profile/:profileID", tempertureRecordHandler.HandleGetTempertureRecordsByProfileID)
		authGroup.PUT("/temperature-records/:id", tempertureRecordHandler.HandleUpdateTempertureRecordByID)
		authGroup.DELETE("/temperature-records/:id", tempertureRecordHandler.HandleDeleteTempertureRecordByID)
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
	router.POST("/messagesSubscribe", messageHandler.HandleAddMessageSubscription)

	// 根据疫苗寻找诊所
	clinicService := service.NewClinicService(db)
	clinicHandler := NewClinicHandler(clinicService)
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

// JWTAuthMiddleware JWT认证中间件
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

// DecryptionAndBindingMiddleware 解密并绑定数据到请求体
func DecryptionAndBindingMiddleware(targetType interface{}) gin.HandlerFunc {
	return func(c *gin.Context) {
		var encryptedRequest struct {
			Data string `json:"data"`
		}
		if err := c.ShouldBindJSON(&encryptedRequest); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
			c.Abort()
			return
		}

		decryptedData, err := utils.Decrypt(encryptedRequest.Data)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to decrypt data"})
			c.Abort()
			return
		}

		// 创建一个新的实例
		newTarget := reflect.New(reflect.TypeOf(targetType).Elem()).Interface()

		if err := json.Unmarshal([]byte(decryptedData), newTarget); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid data format"})
			c.Abort()
			return
		}
		log.Println("encryptedRequest:", encryptedRequest)
		log.Println("decryptedData:", decryptedData)
		log.Println("parsedData:", newTarget)

		c.Set("parsedData", newTarget)
		c.Next()
	}
}

func EncryptedJSON(c *gin.Context, code int, obj interface{}) {
	jsonData, err := json.Marshal(obj)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to marshal response data"})
		return
	}

	encryptedData, err := utils.Encrypt(string(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to encrypt response data"})
		return
	}

	c.JSON(code, gin.H{"data": encryptedData})
}
