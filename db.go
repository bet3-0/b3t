package main

import (
	"fmt"
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
	err = db.Exec("CREATE EXTENSION 'uuid-ossp';").Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Exec("CREATE EXTENSION pgcrypto;").Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Exec("CREATE TYPE role AS ENUM ('jeune','chef','relecteur', 'admin');").Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Exec("CREATE TYPE difficulte AS ENUM ('facile', 'moyen', 'difficile');").Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Exec("CREATE TYPE state AS ENUM ('notStarted', 'inProgress', 'finished', 'validated', 'refused');").Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Exec("CREATE TYPE type_rendu AS ENUM ('text', 'file');").Error
	if err != nil {
		fmt.Println(err)
	}
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

	err = db.Create(&BossesEtBobos).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Create(&TroisEtoiles).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Create(&CesArts).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Create(&Robinson).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.Create(&Halte).Error
	if err != nil {
		fmt.Println(err)
	}

	// Create Activite
	DummyActivite := Activite{
		ActiviteCode: "-1",
		ParcoursCode: "-1",
		Nom:          "DummyActivite",
		Description:  "Une activite de test",
		Duree:        60,
		Difficulte:   "facile",
		Pages:        3,
		Materiel:     []string{"Dummy1", "Dummy2"},
	}
	err = db.Create(&DummyActivite).Error
	if err != nil {
		fmt.Println(err)
	}
}
