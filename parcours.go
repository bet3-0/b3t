package main

import (
	"github.com/gin-gonic/gin"
)

type Parcours struct {
	IDParcours string     `gorm:"primary_key" json:"id"`
	Nom        string     `json:"nom"`
	Activites  []Activite `gorm:"foreignkey:IDParcours"`
}

func ListParcours(c *gin.Context) {

	var parcours []Parcours

	err := db.Preload("Activites").Find(&parcours).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"parcours": parcours})
	return
}
