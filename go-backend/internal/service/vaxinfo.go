package service

import (
	"v-helper/internal/model"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type InfoService struct {
	db *gorm.DB
}

func NewInfoService(db *gorm.DB) *InfoService {
	return &InfoService{db: db}
}

func (s *InfoService) GetAllInfo(c *gin.Context) {
	var info []model.VaccineInfo
	if err := s.db.Find(&info).Error; err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	c.JSON(200, info)
}

func (s *InfoService) GetInfo(c *gin.Context) {
	vaccineName := c.Query("name")
	var info model.VaccineInfo

	// 如果没有指定疫苗名称，则获取全部疫苗信息
	if vaccineName == "" {
		var info []model.VaccineInfo
		if err := s.db.Find(&info).Error; err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, info)
		return
	}

	if err := s.db.Where("Name = ?", vaccineName).First(&info).Error; err != nil {
		c.JSON(401, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(200, info)
}
