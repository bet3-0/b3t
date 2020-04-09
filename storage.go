package main

import (
	"bytes"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

var sess *session.Session

func connectS3() {
	var err error
	sess, err = session.NewSession(&aws.Config{
		Region:      aws.String("us-west-2"),
		Credentials: credentials.NewStaticCredentials(os.Getenv("CELLAR_ADDON_KEY_ID"), os.Getenv("CELLAR_ADDON_KEY_SECRET"), ""),
		Endpoint:    aws.String(os.Getenv("CELLAR_ADDON_HOST")),
	})
	if err != nil {
		panic(err)
	}
}

func pushFile(c *gin.Context) {
	var err error

	var fileName uuid.UUID

	fileName, err = uuid.NewRandom()

	fileBuffer := make([]byte, 30)

	_, err = s3.New(sess).PutObject(&s3.PutObjectInput{
		Bucket:      aws.String("site"),
		Key:         aws.String(fileName.String()),
		Body:        bytes.NewReader(fileBuffer),
		ContentType: aws.String(http.DetectContentType(fileBuffer)),
	})

	if err != nil {
		c.JSON(500, gin.H{"error": "cannot_upload_file"})
		return
	}
	c.JSON(200, gin.H{"message": "file_uploaded", "id": fileName.String})
}

func getFile() {

}
