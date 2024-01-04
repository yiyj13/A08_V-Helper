package handler

import (
	"log"
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
	record, exists := c.Get("parsedData")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record data not found"})
		return
	}
	log.Println("trying to create record: ", record)

	if err := h.vaccinationRecordService.CreateVaccinationRecord(*record.(*model.VaccinationRecord)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "record created successfully"})
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

	EncryptedJSON(c, http.StatusOK, record)
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
		EncryptedJSON(c, http.StatusOK, records)
		return
	}

	records, err := h.vaccinationRecordService.GetVaccinationRecordsByProfileID(uint(profileID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	EncryptedJSON(c, http.StatusOK, records)
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
		EncryptedJSON(c, http.StatusOK, records)
		return
	}

	records, err := h.vaccinationRecordService.GetAllVaccinationRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	EncryptedJSON(c, http.StatusOK, records)
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

	EncryptedJSON(c, http.StatusOK, record)
}

func (h *VaccinationRecordHandler) HandleUpdateVaccinationRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	record, exists := c.Get("parsedData")
	if !exists {
		c.JSON(http.StatusBadRequest, gin.H{"error": "record data not found"})
		return
	}

	log.Println("trying to update record: ", record)
	if err := h.vaccinationRecordService.UpdateVaccinationRecordByID(uint(id), *record.(*model.VaccinationRecord)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "record updated successfully"})
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
