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
	CodeAdherent string ` json:"code_adherent"`
	Role         role   `sql:"type:role" json:"role"`
}

func createUser(c *gin.Context) {
	var user User

	err := c.BindJSON(&user)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"message": "failed_to_map_user",
		})
		return
	}

	err = db.Create(&user).Error
	if err != nil {
		c.JSON(500, gin.H{"message": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"message": "created_user",
	})
	return
}

func login(c *gin.Context) {
	var user User

	err := c.BindJSON(&user)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"message": "failed_to_map_user",
		})
		return
	}
	err = db.Where(&user).First(&user).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"login": false,
		})
		return
	}

	c.JSON(200, gin.H{
		"login": true,
	})
	return
}

func listUsers(c *gin.Context) {

	var users []User

	err := db.Find(&users).Error
	if err != nil {
		c.JSON(500, gin.H{"message": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"users": users})
	return
}
