package main

import (
	"fmt"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jinzhu/gorm"
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

type Progression struct {
	gorm.Model
	ID         string     `gorm:"PRIMARY_KEY" json:"id"`
	ActivityID int        `json:"activityID"`
	State      state      `sql:"type:state" json:"state"`
	Duration   int        `json:"duration"`
	StartedAt  int        `json:"startedAt"`
	FinishedAt int        `json:"finishedAt"`
	ReviewdAt  int        `json:"reviewdAt"`
	Difficulte difficulte `sql:"type:difficulte" json:"difficulte"`
	Pages      int        `json:"pages"`
	Entries    []Entry    `json:"entries"`
}

func CreateProgression(c *gin.Context) {
	var progression Progression

	err := c.BindJSON(&progression)

	var id uuid.UUID
	id, _ = uuid.NewRandom()

	progression.ID = id.String()

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_progression",
		})
		return
	}

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
