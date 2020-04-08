package main

import (
	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

type Parcours struct {
	gorm.Model
	IDParcours string     `gorm:"primary_key;unique" json:"id"`
	Nom        string     `json:"nom"`
	Activites  []Activite `gorm:"foreignkey:ParcoursCode"`
}

func ListParcours(c *gin.Context) {

	var parcours []Parcours

	err := db.Find(&parcours).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"parcours": parcours})
	return
}
