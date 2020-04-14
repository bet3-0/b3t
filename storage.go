package main

import (
	"bytes"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
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
	var fileBuffer []byte

	user := c.Request.Context().Value("user").(User)

	fileID, err = uuid.NewRandom()

	fileName := fmt.Sprintf("%s/%s", user.CodeAdherent, fileID.String())

	fileBuffer, err = c.GetRawData()
	if err != nil {
		c.JSON(412, gin.H{"error": "cannot_read_file"})
		return
	}

	_, err = s3.New(sess).PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(user.CodeStructureGroupe),
		Key:         aws.String(fileName),
		Body:        bytes.NewReader(fileBuffer),
		ContentType: aws.String(http.DetectContentType(fileBuffer)),
	})

	if err != nil {
		c.JSON(500, gin.H{"error": "cannot_upload_file"})
		return
	}

	url := fmt.Sprintf("https://b3t.cleverapps.io/api/file/%s/%s", user.CodeStructureGroupe, fileName)

	c.JSON(200, gin.H{"message": "file_uploaded", "url": url})
}

func createBucket(codeAdherent string) error {
	var err error

	_, err = s3.New(sess).CreateBucket(&s3.CreateBucketInput{
		Bucket: aws.String(codeAdherent),
	})
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

func getUserFile(c *gin.Context) {
	var err error

	codeStructureGroupe := c.Param("code_structure_groupe")
	codeAdherent := c.Param("code_adherent")
	id := c.Param("id")

	fileName := fmt.Sprintf("%s/%s", codeAdherent, id)

	downloader := s3manager.NewDownloader(sess)

	buffer := &aws.WriteAtBuffer{}

	downloader.Download(buffer, &s3.GetObjectInput{
		Bucket: aws.String(codeStructureGroupe),
		Key:    aws.String(fileName),
	})

	data := buffer.Bytes()

	if err != nil {
		c.JSON(500, gin.H{"error": "cannot_get_file"})
		return
	}
	c.Data(200, "application/octet-stream", data)
}
