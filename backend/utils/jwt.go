package utils

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSigningKey = []byte("taskmanager_jwt_key")

func GenerateToken(userId int, roleId int) (string, error) {
	claims := jwt.MapClaims{
		"userId": userId,
		"role":   roleId,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSigningKey)
}
