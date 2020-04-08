package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
	"github.com/lib/pq"
)

type state string

const (
	NotStarted state = "notStarted"
	InProgress       = "inProgress"
	Finished         = "finished"
	Validated        = "validated"
	Refused          = "refused"
)

type typeRendu string

const (
	Text typeRendu = "text"
	File           = "file"
)

type Entry struct {
	gorm.Model
	IDEntry    int            `gorm:"primary_key;unique" json:"id"`
	Documents  pq.StringArray `gorm:"type:varchar(100)[]" json:"documents"`
	TypeRendu  typeRendu      `sql:"type:type_rendu" json:"typeRendu"`
	rendu      string         `json:"rendu"`
	State      state          `sql:"type:state" json:"state"`
	Tracked    bool           `json:"tracked"`
	Page       int            `json:"page"`
	ParcoursID string
}

type Progression struct {
	gorm.Model
	IDProgression string     `gorm:"primary_key;unique" json:"id"`
	ActiviteCode  int        `json:"idActivite"`
	ParcoursCode  int        `json:"idParcours"`
	State         state      `sql:"type:state" json:"state"`
	Duration      int        `json:"duration"`
	StartedAt     int        `json:"startedAt"`
	FinishedAt    int        `json:"finishedAt"`
	ReviewdAt     int        `json:"reviewdAt"`
	Difficulte    difficulte `sql:"type:difficulte" json:"difficulte"`
	Page          int        `json:"page"`
	Entries       []Entry    `json:"entries"`
}

func CreateProgression(c *gin.Context) {
	var progression Progression

	err := c.BindJSON(&progression)
	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_progression",
		})
		return
	}

	var id uuid.UUID
	id, _ = uuid.NewRandom()

	progression.IDProgression = id.String()

	err = db.Create(&progression).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"message": "created_progressio",
	})
	return
}

func ListProgressions(c *gin.Context) {

	var activites []Activite

	err := db.Find(&activites).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"activites": activites})
	return
}

func GetProgression(c *gin.Context) {
	var progression Progression
	var err error
	progression.IDProgression = c.Param("id")
	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err = db.Where(&progression).First(&progression).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"progression": progression})
	return
}

func UpdateProgression(c *gin.Context) {
	var progression Progression

	err := c.BindJSON(&progression)
	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_progression",
		})
		return
	}

	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err = db.Save(&progression).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"message": "updated_progression"})
	return
}

func UpdateEntry(c *gin.Context) {
	var entry Entry

	err := c.BindJSON(&entry)
	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_progression",
		})
		return
	}

	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err = db.Save(&entry).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"message": "updated_progression"})
	return
}
