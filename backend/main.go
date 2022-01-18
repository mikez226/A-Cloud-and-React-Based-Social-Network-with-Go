package main

import (
	"fmt"
	"log"
	"net/http"

	jwtmiddleware "github.com/auth0/go-jwt-middleware"
	jwt "github.com/dgrijalva/jwt-go"
	"github.com/gorilla/mux"
)

func main() {
	fmt.Println("started-service")
	// Format: New(Options{ ValidationKeyGetter: callback, SigningMethod: method })
	//    ValidationKeyGetter: 一个回调函数，提供安全密钥。
	//    SigningMethod: token的加密算法（这里是HS256）
	jwtMiddleware := jwtmiddleware.New(jwtmiddleware.Options{
		ValidationKeyGetter: func(token *jwt.Token) (interface{}, error) {
			// return interface{}, 因为key类型多样
			return []byte(mySigningKey), nil
		},
		SigningMethod: jwt.SigningMethodHS256,
	})

	r := mux.NewRouter()
	// 只能用token保护upload、search。
	r.Handle("/upload", jwtMiddleware.Handler(http.HandlerFunc(uploadHandler))).Methods("POST", "OPTIONS")
	r.Handle("/search", jwtMiddleware.Handler(http.HandlerFunc(searchHandler))).Methods("GET", "OPTIONS")
	r.Handle("/signup", http.HandlerFunc(signupHandler)).Methods("POST", "OPTIONS")
	r.Handle("/signin", http.HandlerFunc(signinHandler)).Methods("POST", "OPTIONS")

	log.Fatal(http.ListenAndServe(":8080", r))
}
