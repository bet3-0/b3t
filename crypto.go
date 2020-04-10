package main

import (
	"fmt"
	"os"
	"time"

	"github.com/pascaldekloe/jwt"
)

func generateToken(user User) string {
	var claims jwt.Claims
	claims.Issued = jwt.NewNumericTime(time.Now().Round(time.Second))
	claims.Set = map[string]interface{}{"code_adherent": user.CodeAdherent, "role": user.Role}
	// issue a JWT
	token, err := claims.HMACSign("HS512", []byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		panic(err)
	}
	return string(token)
}

func verifyToken(token string) (string, string, error) {
	// verify a JWT
	claims, err := jwt.HMACCheck([]byte(token), []byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", "", fmt.Errorf("bad_token")
	}
	if !claims.Valid(time.Now()) {
		return "", "", fmt.Errorf("token_too_old")
	}
	codeAdherent, _ := claims.String("code_adherent")
	role, _ := claims.String("role")
	return codeAdherent, role, nil
}
