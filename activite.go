package main

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

type parcours int

const (
	BossesEtBobos parcours = 0
	TroisEtoiles           = 1
	CesArt                 = 2
	Robinson               = 3
	Halte                  = 4
)

type difficulte string

const (
	Facile    difficulte = "facile"
	Moyen                = "moyen"
	Difficile            = "difficile"
)

type Materiel struct {
	gorm.Model
	name string
}

type Document struct {
	gorm.Model
	name string
}

type Entry struct {
	gorm.Model
	ID              int        `gorm:"PRIMARY_KEY" json:"id"`
	DocumentsSource []Document `json:"documents_source"`
	DocumentsRendu  []Document `json:"documents_rendu"`
	TypeRendu       typeRendu  `sql:"type:type_rendu" json:"typeRendu"`
	rendu           string     `json:"rendu"`
	State           state      `sql:"type:state" json:"state"`
	Tracked         bool       `json:"tracked"`
	Page            int        `json:"page"`
}

type Activite struct {
	gorm.Model
	ID          int        `gorm:"PRIMARY_KEY;AUTO_INCREMENT" json:"id"`
	IdActivite  int        `json:"idParcours"`
	Parcours    parcours   `sql:"type:parcours" json:"idParcours"`
	Nom         string     `json:"nom"`
	Description string     `json:"description"`
	Duree       int        `json:"duree"`
	Materiel    []Materiel `json:"materiel"`
	Difficulte  difficulte `sql:"type:difficulte" json:"difficulte"`
	Pages       int        `json:"page"`
	Entries     []Entry    `json:"entries"`
}

func CreateActivite(c *gin.Context) {
	var activite Activite

	err := c.BindJSON(&activite)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_activite",
		})
		return
	}

	err = db.Create(&activite).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"message": "created_activite",
	})
	return
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
	activite.ID, err = strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err := db.Where(&activite).First(&activite).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"activite": activite})
	return
}
