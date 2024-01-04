package handler

import (
	"log"
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type ProfileHandler struct {
	profileService *service.ProfileService
}

func NewProfileHandler(profileService *service.ProfileService) *ProfileHandler {
	return &ProfileHandler{profileService: profileService}
}

func (h *ProfileHandler) HandleCreateProfile(c *gin.Context) {
	profile, exists := c.Get("parsedData")
	log.Println("trying to create profile: ", profile)
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Profile data not found"})
		return
	}

	// 创建Profile
	if err := h.profileService.CreateProfile(*profile.(*model.Profile)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "profile created successfully"})
}

func (h *ProfileHandler) HandleGetAllProfiles(c *gin.Context) {
	profiles, err := h.profileService.GetAllProfiles()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	EncryptedJSON(c, http.StatusOK, profiles)
}

func (h *ProfileHandler) HandleGetProfileByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	profile, err := h.profileService.GetProfileByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	EncryptedJSON(c, http.StatusOK, profile)
}

func (h *ProfileHandler) HandleUpdateProfileByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	profile, exists := c.Get("parsedData")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Profile data not found"})
		return
	}
	log.Println("trying to update profile: ", profile)

	if err := h.profileService.UpdateProfileByID(uint(id), *profile.(*model.Profile)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "profile updated successfully"})
}

func (h *ProfileHandler) HandleDeleteProfileByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.profileService.DeleteProfileByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("profile deleted successfully: ", id)
	c.JSON(http.StatusOK, gin.H{"message": "profile deleted successfully"})
}

// GetProfilesByUserID 处理通过 UserID 获取 Profile 的请求
func (h *ProfileHandler) HandleGetProfilesByUserID(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	profiles, err := h.profileService.GetProfilesByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "error fetching profiles"})
		return
	}

	EncryptedJSON(c, http.StatusOK, profiles)
}
