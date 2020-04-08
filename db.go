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
	err = db.Exec("CREATE TYPE parcours AS ENUM (0, 1, 2, 3, 4);").Error
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
	err = db.AutoMigrate(&Document{}).Error
	if err != nil {
		fmt.Println(err)
	}
	err = db.AutoMigrate(&Materiel{}).Error
	if err != nil {
		fmt.Println(err)
	}
}
