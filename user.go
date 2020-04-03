package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/jinzhu/gorm"
)

type role string

const (
	Jeune     role = "jeune"
	Chef           = "chef"
	Relecteur      = "relecteur"
	Admin          = "admin"
)

type User struct {
	gorm.Model
	HashCodeAdherent string ` json:"code_adherent"`
	Role             role   `sql:"type:role" json:"role"`
}

func CreateUser(c *gin.Context) {
	var user User

	err := c.BindJSON(&user)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"message": "Failed to map user",
		})
		return
	}

	user.HashCodeAdherent, _ = HashPassword(user.HashCodeAdherent)
	user.Role = "jeune"

	DB.Create(&user)

	c.JSON(200, gin.H{
		"message": "Created User",
	})
	return
}
