package handler

import (
	"log"
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type ClinicHandler struct {
	clinicService *service.ClinicService
}

func NewClinicHandler(clinicService *service.ClinicService) *ClinicHandler {
	return &ClinicHandler{clinicService: clinicService}
}

func (h *ClinicHandler) HandleCreateClinic(c *gin.Context) {
	var clinic model.Clinic
	if err := c.ShouldBindJSON(&clinic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.clinicService.CreateClinic(clinic); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("clinic created successfully: ", clinic)
	c.JSON(http.StatusOK, clinic)
}

func (h *ClinicHandler) HandleGetClinicsByVaccineID(c *gin.Context) {
	queryVaccineID := c.Query("vaccineId")

	if queryVaccineID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "vaccineId is required"})
		return
	}

	vaccineID, err := strconv.ParseUint(queryVaccineID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clinics, err := h.clinicService.GetClinicsByVaccineID(uint(vaccineID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clinics)
}

func (h *ClinicHandler) HandleGetClinicsByVaccineName(c *gin.Context) {
	queryVaccineName := c.Param("vaccineName")

	if queryVaccineName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "vaccineName is required"})
		return
	}

	clinics, err := h.clinicService.GetClinicsByVaccineName(queryVaccineName)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clinics)
}

func (h *ClinicHandler) HandleGetAllClinics(c *gin.Context) {
	clinics, err := h.clinicService.GetAllClinics()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clinics)
}

func (h *ClinicHandler) HandleGetClinics(c *gin.Context) {
	queryArticleID := c.Query("articleId")

	// 如果没有传 articleId 参数，则返回所有 clinic
	if queryArticleID == "" {
		clinics, err := h.clinicService.GetAllClinics()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, clinics)
		return
	}

	// 如果传了 articleId 参数，则返回该 articleId 下的所有 clinic
	articleID, err := strconv.ParseUint(queryArticleID, 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	clinics, err := h.clinicService.GetClinicsByArticleID(uint(articleID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clinics)
}

func (h *ClinicHandler) HandleGetClinicByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	clinic, err := h.clinicService.GetClinicByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clinic)
}

func (h *ClinicHandler) HandleUpdateClinicByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var clinic model.Clinic
	if err := c.ShouldBindJSON(&clinic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.clinicService.UpdateClinicByID(uint(id), clinic); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("clinic updated successfully: ", clinic)
	c.JSON(http.StatusOK, clinic)
}

func (h *ClinicHandler) HandleDeleteClinicByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.clinicService.DeleteClinicByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("clinic deleted successfully: ", id)
	c.JSON(http.StatusOK, gin.H{"message": "clinic deleted successfully"})
}
