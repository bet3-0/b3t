package main

import (
	"fmt"
	"os"
	"strings"
	"time"

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
		Region:      aws.String("us-east-1"),
		Credentials: credentials.NewStaticCredentials(os.Getenv("CELLAR_ADDON_KEY_ID"), os.Getenv("CELLAR_ADDON_KEY_SECRET"), ""),
		Endpoint:    aws.String(os.Getenv("CELLAR_ADDON_HOST")),
	})
	if err != nil {
		panic(err)
	}
}

func pushFile(c *gin.Context) {
	var err error
	var fileID uuid.UUID

	user := c.Request.Context().Value("user").(User)

	file, header, err := c.Request.FormFile("file")
	if err != nil {
		panic(err)
	}

	s := strings.Split(header.Filename, ".")

	fileID, err = uuid.NewRandom()

	fileName := fmt.Sprintf("%s/%s/%s.%s", user.CodeStructureGroupe, user.CodeAdherent, fileID.String(), s[len(s)-1])

	if err != nil {
		c.JSON(412, gin.H{"error": "cannot_read_file"})
		return
	}

	fmt.Println(header.Header)

	_, err = s3.New(sess).PutObject(&s3.PutObjectInput{
		Bucket:      aws.String("bet2020"),
		Key:         aws.String(fileName),
		Body:        file,
		ContentType: aws.String("application/octet-stream"),
	})

	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{"error": "cannot_upload_file"})
		return
	}

	c.JSON(200, gin.H{"message": "file_uploaded", "id": fileName})
}

func getUrl(c *gin.Context) {

	codeStructureGroupe := c.Param("code_structure_groupe")
	codeAdherent := c.Param("code_adherent")
	name := c.Param("name")

	user := c.Request.Context().Value("user").(User)

	// In case a chef wants to get a file, forces codeStructureGroupe value to its group
	if user.Role == role("chef") {
		codeStructureGroupe = user.CodeStructureGroupe
	}

	// In case a chef wants to get a file, forces codeStructureGroupe value to its group
	if user.Role == role("ap") {
		c.AbortWithError(401, fmt.Errorf("unauthorized"))
		return
	}

	svc := s3.New(sess)

	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String("bet2020"),
		Key:    aws.String(fmt.Sprintf("%s/%s/%s", codeStructureGroupe, codeAdherent, name)),
	})

	url, err := req.Presign(30 * time.Minute)

	if err != nil {
		fmt.Println(err)
		c.JSON(500, gin.H{"error": "cannot_get_url"})
		return
	}
	c.JSON(200, gin.H{"url": url})
}
