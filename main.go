package main

import (
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	connect()
	connectS3()
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("site", false)))

	api := router.Group("/api")
	{
		api.POST("/register", createUser)
		api.POST("/login", login)
		api.GET("/users", listUsers)
		api.POST("/file", pushFile)

		api.GET("/parcours", ListParcours)

		api.GET("/activites", ListActivites)
		api.GET("/activite/:idParcours/:idActivite", GetActivite)

		api.POST("/progression", CreateProgression)
		api.GET("/progressions", ListProgressions)
		api.GET("/progression/:id", GetProgression)

		api.PUT("/progression", UpdateProgression)
		api.PUT("/entry", UpdateEntry)

		api.Use(authenticate())
		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Welcome to the API",
			})
		})

	}

	router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
