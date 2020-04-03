package main

import (
	"fmt"
	"os"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
)

var DB *gorm.DB

func init() {

	DB, err := gorm.Open("postgres", fmt.Sprintf("host=%s port=%s user=%s dbname=%s password=%s sslmode=disable", os.Getenv("POSTGRESQL_ADDON_HOST"), os.Getenv("POSTGRESQL_ADDON_PORT"), os.Getenv("POSTGRESQL_ADDON_USER"), os.Getenv("POSTGRESQL_ADDON_DB"), os.Getenv("POSTGRESQL_ADDON_PASSWORD")))
	if err != nil {
		fmt.Println(err)
		panic("failed to connect database")
	}
	// Migrate the schema
	DB.Exec("CREATE TYPE role AS ENUM ('jeune','chef','relecteur', 'admin');")
	DB.AutoMigrate(&User{})
}
