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

func verifyToken(token string) (User, error) {
	// verify a JWT
	claims, err := jwt.HMACCheck([]byte(token), []byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return User{}, fmt.Errorf("bad_token")
	}
	if !claims.Valid(time.Now()) {
		return User{}, fmt.Errorf("token_too_old")
	}

	codeAdherent, _ := claims.String("code_adherent")
	roleAdherent, _ := claims.String("role")

	user := User{
		CodeAdherent: codeAdherent,
		Role:         role(roleAdherent),
	}
	return user, nil
}
