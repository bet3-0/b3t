package main

import (
	"github.com/gin-contrib/secure"
	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to dabase and load Parcours and Activites
	connect()
	// Connect to cellar
	connectS3()

	router := gin.Default()

	secureConfig := secure.DefaultConfig()
	secureConfig.SSLProxyHeaders = map[string]string{"X-Forwarded-Proto": "http"}

	router.Use(secure.New(secureConfig))

	router.Use(static.Serve("/", static.LocalFile("front/dist", false)))

	router.NoRoute(func(c *gin.Context) {
		c.File("front/dist/index.html")
	})

	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Bienvenu sur l'API du BET 3.0",
			})
		})

		api.POST("/login", login)

		api.GET("/parcours", ListParcours)

		api.GET("/activites", ListActivites)
		api.GET("/activite/:idParcours/:idActivite", GetActivite)

		// Accessible by all users

		api.Use(authenticate())
		api.POST("/file", pushFile)
		api.POST("/progression", CreateProgression)
		api.GET("/progressions", ListMyProgressions)
		api.PUT("/progression", UpdateProgression)
		api.PUT("/entry", UpdateEntry)

		// Accessible by Relecteur, AP, Chef and Admin only

		api.Use(restrictAccess([]role{role("relecteur"), role("ap"), role("chef"), role("admin")}))
		api.GET("/groupe", GetGroupe)
		api.GET("/groupe/progressions", ListGroupeProgressions)

		// Accessible by Relecteur, AP and Admin only

		api.Use(restrictAccess([]role{role("relecteur"), role("ap"), role("admin")}))
		api.GET("/territoire", GetTerritoire)
		api.GET("/territoire/progressions", ListTerritoireProgressions)

		// Accessible by Relecteurs and Admins only

		api.Use(restrictAccess([]role{role("relecteur"), role("admin")}))
		api.GET("/file/url/:code_structure_groupe/:code_adherent/:name", getUrl)
		api.GET("/user/progressions", ListFinishedProgressions)
		api.GET("/user/progression/:id", GetUserProgression)
		api.PUT("/user/progression", UpdateUserProgression)

		// Accessible by Admins only

		api.Use(restrictAccess([]role{role("admin")}))
		api.POST("/register", createUser)
		api.GET("/users", listUsers)
		api.POST("/groupe", CreateGroupe)
		api.POST("/territoire", CreateTerritoire)
		api.GET("/progressions/all", ListAllProgressions)
	}

	router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
