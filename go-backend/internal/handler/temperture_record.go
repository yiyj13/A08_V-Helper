package handler

import (
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type TempertureRecordHandler struct {
	tempertureRecordService *service.TempertureRecordService
}

func NewTempertureRecordHandler(tempertureRecordService *service.TempertureRecordService) *TempertureRecordHandler {
	return &TempertureRecordHandler{tempertureRecordService: tempertureRecordService}
}

func (h *TempertureRecordHandler) HandleCreateTempertureRecord(c *gin.Context) {
	var record model.TempertureRecord
	if err := c.BindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.tempertureRecordService.CreateTempertureRecord(record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, record)
}

func (h *TempertureRecordHandler) HandleGetTempertureRecordsByUserID(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}

	records, err := h.tempertureRecordService.GetTempertureRecordsByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, records)
}

func (h *TempertureRecordHandler) HandleGetTempertureRecordsByProfileID(c *gin.Context) {
	profileID, err := strconv.ParseUint(c.Param("profileID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid profile ID"})
		return
	}

	records, err := h.tempertureRecordService.GetTempertureRecordsByProfileID(uint(profileID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, records)
}

func (h *TempertureRecordHandler) HandleGetAllTempertureRecords(c *gin.Context) {
	records, err := h.tempertureRecordService.GetAllTempertureRecords()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, records)
}

func (h *TempertureRecordHandler) HandleGetTempertureRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	record, err := h.tempertureRecordService.GetTempertureRecordByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, record)
}

func (h *TempertureRecordHandler) HandleUpdateTempertureRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	var record model.TempertureRecord
	if err := c.BindJSON(&record); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.tempertureRecordService.UpdateTempertureRecordByID(uint(id), record); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, record)
}

func (h *TempertureRecordHandler) HandleDeleteTempertureRecordByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid record ID"})
		return
	}

	if err := h.tempertureRecordService.DeleteTempertureRecordByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "temperture record deleted successfully"})
}
