package main

import (
	"fmt"
	"strings"

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
	CodeAdherent string `json:"code_adherent" gorm:"PRIMARY_KEY"`
	Role         role   `sql:"type:role" json:"role"`
}

func authenticate() gin.HandlerFunc {
	return func(c *gin.Context) {
		bearerToken := c.GetHeader("Authorization")
		slice := strings.Split(bearerToken, " ")
		if len(slice) == 2 {
			token := slice[1]
			payload, err := verifyToken(token)
			if err != nil {
				c.AbortWithStatusJSON(400, gin.H{"error": "invalid_token"})
				return
			}
			c.Header("payload", payload)
			c.Next()
			return
		} else {
			c.AbortWithStatusJSON(400, gin.H{"error": "invalid_token"})
		}
	}
}

func createUser(c *gin.Context) {
	var user User

	err := c.BindJSON(&user)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_user",
		})
		return
	}

	err = db.Create(&user).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
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
		c.JSON(412, gin.H{
			"error": "failed_to_map_user",
		})
		return
	}
	err = db.Where(&user).First(&user).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"login": false,
			"error": "user_does_not_exists",
		})
		return
	}

	c.JSON(200, gin.H{
		"login": true,
		"token": generateToken(user),
	})
	return
}

func listUsers(c *gin.Context) {

	var users []User

	err := db.Find(&users).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{"users": users})
	return
}
