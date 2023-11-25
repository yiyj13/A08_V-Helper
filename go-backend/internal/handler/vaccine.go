package handler

import (
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type VaccineHandler struct {
	vaccineService *service.VaccineService
}

func NewVaccineHandler(vaccineService *service.VaccineService) *VaccineHandler {
	return &VaccineHandler{vaccineService: vaccineService}
}

func (h *VaccineHandler) HandleCreateVaccine(c *gin.Context) {
	var vaccine model.Vaccine
	if err := c.BindJSON(&vaccine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.vaccineService.CreateVaccine(vaccine); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, vaccine)
}

func (h *VaccineHandler) HandleGetAllVaccines(c *gin.Context) {
	vaccines, err := h.vaccineService.GetAllVaccines()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vaccines)
}

func (h *VaccineHandler) HandleGetVaccineByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vaccine, err := h.vaccineService.GetVaccineByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vaccine)
}

func (h *VaccineHandler) HandleUpdateVaccineByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var vaccine model.Vaccine
	if err := c.BindJSON(&vaccine); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.vaccineService.UpdateVaccineByID(uint(id), vaccine); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vaccine)
}

func (h *VaccineHandler) HandleDeleteVaccineByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.vaccineService.DeleteVaccineByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "vaccine deleted successfully"})
}
