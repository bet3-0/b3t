package main

import (
	"log"
	"time"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func Authentificator() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()

		// Set example variable
		c.Set("example", "12345")

		// before request
		c.Next()

		// after request
		latency := time.Since(t)
		log.Print(latency)

		// access the status we are sending
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {
	connect()
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("site", false)))

	api := router.Group("/api")
	{
		api.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "Welcome to the API",
			})
		})
		api.POST("/register", createUser)
		api.POST("/login", login)
		api.GET("/users", listUsers)
	}

	router.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
