package main

import (
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/lib/pq"
)

type state string

const (
	NotStarted state = "NOTSTARTED"
	InProgress       = "INPROGRESS"
	Finished         = "FINISHED"
	Reviewing        = "REVIEWING"
	Validated        = "VALIDATED"
	Refused          = "REFUSED"
)

type typeRendu string

const (
	Text typeRendu = "text"
	File           = "file"
)

type Entry struct {
	ID            string         `gorm:"primary_key" json:"id"`
	Question      string         `json:"question"`
	Documents     pq.StringArray `gorm:"type:varchar(100)[]" json:"documents"`
	TypeRendu     typeRendu      `sql:"type:type_rendu" json:"typeRendu"`
	Rendu         string         `json:"rendu"`
	State         state          `sql:"type:state" json:"state"`
	Tracked       bool           `json:"tracked"`
	Page          int            `json:"page"`
	IDProgression string
}

type Progression struct {
	ID           string  `gorm:"primary_key" json:"id"`
	ActiviteCode string  `json:"idActivite"`
	ParcoursCode string  `json:"idParcours"`
	State        state   `sql:"type:state" json:"state"`
	Duration     int     `json:"duration"`
	StartedAt    int64   `json:"startedAt"`
	FinishedAt   int64   `json:"finishedAt"`
	ReviewdAt    int64   `json:"reviewdAt"`
	Page         int     `json:"page"`
	Entries      []Entry `gorm:"foreignkey:IDProgression" json:"entries"`
	CodeAdherent string
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
	progression.ID = id.String()

	progression.StartedAt = time.Now().UnixNano()

	user := c.Request.Context().Value("user").(User)

	progression.CodeAdherent = user.CodeAdherent

	for i := 0; i < len(progression.Entries); i++ {
		id, _ = uuid.NewRandom()
		progression.Entries[i].ID = id.String()
		progression.Entries[i].IDProgression = progression.ID
	}

	err = db.Create(&progression).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"message":     "created_progression",
		"progression": progression,
	})
	return
}

func ListMyProgressions(c *gin.Context) {
	var progression Progression
	var err error

	user := c.Request.Context().Value("user").(User)

	progression.CodeAdherent = user.CodeAdherent

	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err = db.Where(&progression).Preload("Entries").Find(&progression).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"progression": progression})
	return
}

func ListFinishedProgressions(c *gin.Context) {

	var progressions []Progression

	err := db.Where("state = ?", "FINISHED").Find(&progressions).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"progressions": progressions})
	return
}

func GetUserProgression(c *gin.Context) {
	var progression Progression
	var err error
	progression.ID = c.Param("id")
	if err != nil {
		c.JSON(412, gin.H{"error": "wrong_id"})
		return
	}

	err = db.Where(&progression).Preload("Entries").First(&progression).Error
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
	user := c.Request.Context().Value("user").(User)

	progression.CodeAdherent = user.CodeAdherent

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
