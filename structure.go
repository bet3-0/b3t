package main

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

type Groupe struct {
	CodeStructure string `json:"code_structure" gorm:"primary_key;unique"`
	Users         []User `gorm:"foreignkey:CodeStructureGroupe" json:"users"`
}

type Territoire struct {
	CodeStructure string `json:"code_structure" gorm:"primary_key;unique"`
	Users         []User `gorm:"foreignkey:CodeStructureTerritoire" json:"users"`
}

func CreateGroupe(c *gin.Context) {
	var groupe Groupe

	err := c.BindJSON(&groupe)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_groupe",
		})
		return
	}

	err = db.Create(&groupe).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"message": "created_groupe",
	})
	return
}

func CreateTerritoire(c *gin.Context) {
	var territoire Territoire

	err := c.BindJSON(&territoire)

	if err != nil {
		fmt.Println(err)
		c.JSON(400, gin.H{
			"error": "failed_to_map_territoire",
		})
		return
	}

	err = db.Create(&territoire).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"message": "created_territoire",
	})
	return
}

func GetGroupe(c *gin.Context) {
	var groupe Groupe

	user := c.Request.Context().Value("user").(User)

	groupe.CodeStructure = user.CodeStructureGroupe

	// Using nested preload, quite nice feature https://jinzhu.me/gorm/crud.html#nested-preloading
	err := db.Where(&groupe).Preload("Users.Progressions.Entries").First(&groupe).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"groupe": groupe,
	})
	return
}

func GetTerritoire(c *gin.Context) {
	var territoire Territoire

	user := c.Request.Context().Value("user").(User)

	territoire.CodeStructure = user.CodeStructureTerritoire

	err := db.Where(&territoire).Preload("Users.Progressions.Entries").First(&territoire).Error
	if err != nil {
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"territoire": territoire,
	})
	return
}

func ListGroupeProgressions(c *gin.Context) {
	var progressions []UserProgression

	user := c.Request.Context().Value("user").(User)

	err := db.Raw("SELECT p.* FROM users AS u JOIN progressions as p ON p.code_adherent=u.code_adherent WHERE code_structure_groupe=?;", user.CodeStructureGroupe).Scan(&progressions).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"Progressions": progressions,
	})
	return
}

func ListTerritoireProgressions(c *gin.Context) {
	var progressions []UserProgression

	user := c.Request.Context().Value("user").(User)

	err := db.Raw("SELECT p.* FROM users AS u JOIN progressions as p ON p.code_adherent=u.code_adherent WHERE code_structure_territoire=?;", user.CodeStructureTerritoire).Scan(&progressions).Error
	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{"error": "internal_server_error"})
		return
	}

	c.JSON(200, gin.H{
		"Progressions": progressions,
	})
	return
}
