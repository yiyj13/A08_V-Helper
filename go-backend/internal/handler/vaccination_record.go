package handler

import (
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type VaccinationRecordHandler struct {
	vaccinationRecordService *service.VaccinationRecordService
}

func NewVaccinationRecordHandler(vaccinationRecordService *service.VaccinationRecordService) *VaccinationRecordHandler {
	return &VaccinationRecordHandler{vaccinationRecordService: vaccinationRecordService}
}

func (h *VaccinationRecordHandler) HandleCreateVaccinationRecord(c *gin.Context) {
	var record model.VaccinationRecord
	if err := c.BindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.vaccinationRecordService.CreateVaccinationRecord(record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, record)
}

func (h *VaccinationRecordHandler) HandleGetVaccinationRecordsByUserID(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	record, err := h.vaccinationRecordService.GetVaccinationRecordsByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, record)
}

func (h *VaccinationRecordHandler) HandleGetVaccinationRecordsByProfileID(c *gin.Context) {
	profileID, err := strconv.ParseUint(c.Param("profileID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid profile ID"})
		return
	}

	isCompleted := c.Query("isCompleted")
	if isCompleted != "" {
		isCompletedBool, err := strconv.ParseBool(isCompleted)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid isCompleted value"})
			return
		}
		records, err := h.vaccinationRecordService.GetVaccinationRecordsByProfileIDAndIsCompleted(uint(profileID), isCompletedBool)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, records)
		return
	}

	records, err := h.vaccinationRecordService.GetVaccinationRecordsByProfileID(uint(profileID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, records)
}

func (h *VaccinationRecordHandler) HandleGetAllVaccinationRecords(c *gin.Context) {
	isCompleted := c.Query("isCompleted")
	if isCompleted != "" {
		isCompletedBool, err := strconv.ParseBool(isCompleted)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid isCompleted value"})
			return
		}
		records, err := h.vaccinationRecordService.GetAllVaccinationRecordsByIsCompleted(isCompletedBool)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, records)
		return
	}

	records, err := h.vaccinationRecordService.GetAllVaccinationRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, records)
}

func (h *VaccinationRecordHandler) HandleGetVaccinationRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	record, err := h.vaccinationRecordService.GetVaccinationRecordByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, record)
}

func (h *VaccinationRecordHandler) HandleUpdateVaccinationRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	var record model.VaccinationRecord
	if err := c.BindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.vaccinationRecordService.UpdateVaccinationRecordByID(uint(id), record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, record)
}

func (h *VaccinationRecordHandler) HandleDeleteVaccinationRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	if err := h.vaccinationRecordService.DeleteVaccinationRecordByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "record deleted successfully"})
}
