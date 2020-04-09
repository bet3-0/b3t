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
	DummyParcours := Parcours{
		IDParcours: "-1",
		Nom:        "Dummy Parcours",
	}

	_ = db.Create(&BossesEtBobos).Error
	_ = db.Create(&TroisEtoiles).Error
	_ = db.Create(&CesArts).Error
	_ = db.Create(&Robinson).Error
	_ = db.Create(&Halte).Error
	_ = db.Create(&DummyParcours).Error

	// Create Activite
	DummyActivite := Activite{
		IDActivite:  "-1",
		IDParcours:  "-1",
		Nom:         "DummyActivite",
		Description: "Une activite de test",
		Duree:       60,
		Difficulte:  "facile",
		Pages:       3,
		Materiel:    []string{"Dummy1", "Dummy2"},
	}
	_ = db.Create(&DummyActivite).Error

	DummyActivite2 := Activite{
		IDActivite:  "-2",
		IDParcours:  "-1",
		Nom:         "DummyActivite 2",
		Description: "Une deuxieme activite de test",
		Duree:       120,
		Difficulte:  "difficile",
		Pages:       6,
		Materiel:    []string{"Dummy1", "Dummy2"},
	}
	_ = db.Create(&DummyActivite2).Error
}
