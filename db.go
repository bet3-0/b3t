package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var db *gorm.DB

func connect() {
	var err error
	db, err = gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", os.Getenv("POSTGRESQL_ADDON_HOST"), os.Getenv("POSTGRESQL_ADDON_PORT"), os.Getenv("POSTGRESQL_ADDON_USER"), os.Getenv("POSTGRESQL_ADDON_DB"), os.Getenv("POSTGRESQL_ADDON_PASSWORD")))
	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}
	// Migrate the schema
	_ = db.Exec("CREATE EXTENSION pgcrypto;").Error
	_ = db.Exec("CREATE TYPE role AS ENUM ('jeune','chef','relecteur', 'admin');").Error
	_ = db.Exec("CREATE TYPE difficulte AS ENUM ('facile', 'moyen', 'difficile');").Error
	_ = db.Exec("CREATE TYPE state AS ENUM ('NOTSTARTED', 'INPROGRESS', 'FINISHED', 'VALIDATED', 'REFUSED');").Error
	_ = db.Exec("CREATE TYPE type_rendu AS ENUM ('text', 'file');").Error

	err = db.AutoMigrate(&Parcours{}).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.AutoMigrate(&User{}).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.AutoMigrate(&Activite{}).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.AutoMigrate(&Progression{}).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.AutoMigrate(&Entry{}).Error
	if err != nil {
		fmt.Println(err)
	}

	// Create Parcours
	BossesEtBobos := Parcours{
		IDParcours: "0",
		Nom:        "Bosses et bobos",
	}
	TroisEtoiles := Parcours{
		IDParcours: "1",
		Nom:        "Trois étoiles",
	}
	CesArts := Parcours{
		IDParcours: "2",
		Nom:        "Ces'Arts",
	}
	Robinson := Parcours{
		IDParcours: "3",
		Nom:        "Robinson",
	}
	Halte := Parcours{
		IDParcours: "4",
		Nom:        "Halte",
	}

	_ = db.Create(&BossesEtBobos).Error
	_ = db.Create(&TroisEtoiles).Error
	_ = db.Create(&CesArts).Error
	_ = db.Create(&Robinson).Error
	_ = db.Create(&Halte).Error

	parcours, err := ioutil.ReadDir("front/src/activities")
	if err != nil {
		fmt.Println(err)
	}
	var activiteCode string
	var parcoursCode string

	for _, parcour := range parcours {
		parcoursCode = parcour.Name()
		activites, err := ioutil.ReadDir("front/src/activities/" + parcoursCode)
		if err != nil {
			fmt.Println(err)
		}
		for _, activite := range activites {
			activiteCode = activite.Name()
			jsonContent, err := ioutil.ReadFile("front/src/activities/" + parcoursCode + "/" + activiteCode + "/activity.json")
			if err != nil {
				fmt.Println(err)
			}
			Activite := Activite{Difficulte: "moyen"}
			err = json.Unmarshal([]byte(jsonContent), &Activite)
			if err != nil {
				fmt.Println(err)
			}
			err = db.Create(&Activite).Error
			if err != nil {
				err = db.Save(&Activite).Error
			}
		}
	}
}
