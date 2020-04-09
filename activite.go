package main

import (
	"github.com/gin-gonic/gin"
	"github.com/lib/pq"
)

type difficulte string

const (
	Facile    difficulte = "facile"
	Moyen                = "moyen"
	Difficile            = "difficile"
)

type Activite struct {
	ActiviteCode string         `gorm:"primary_key" json:"idActivite"`
	ParcoursCode string         `gorm:"primary_key" json:"idParcours"`
	Nom          string         `json:"nom"`
	Description  string         `json:"description"`
	Duree        int            `json:"duree"`
	Materiel     pq.StringArray `gorm:"type:varchar(100)[]" json:"materiel"`
	Difficulte   difficulte     `sql:"type:difficulte" json:"difficulte"`
	Pages        int            `json:"page"`
}

func ListActivites(c *gin.Context) {

	var activites []Activite

	err := db.Find(&activites).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"activites": activites})
	return
}

func GetActivite(c *gin.Context) {
	var activite Activite
	var err error

	activite.ActiviteCode = c.Param("id")
	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err = db.Where(&activite).First(&activite).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"activite": activite})
	return
}
