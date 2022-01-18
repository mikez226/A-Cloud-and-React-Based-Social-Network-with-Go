// user related logic. similar role as post.go
package main

import (
	"fmt"
	"reflect"

	"github.com/olivere/elastic"
)

const (
	USER_INDEX = "user"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Age      int64  `json:"age"`
	Gender   string `json:"gender"`
}

func checkUser(username, password string) (bool, error) {
	// 这个query相当于：select * from USER_INDEX where username = username
	query := elastic.NewTermQuery("username", username)
	searchResult, err := readFromES(query, USER_INDEX) // 使用了readFromES
	// 如果找不到就username，就return false。
	if err != nil {
		return false, err
	}
	// 如果找到了username，就检查password是否正确。需要解析searchResult
	var utype User
	// 遍历，筛选能被cast成类型utype的。
	// range返回的index和value；reflect就是个library，它提供了TypeOf这个功能。
	for _, item := range searchResult.Each(reflect.TypeOf(utype)) {
		if u, ok := item.(User); ok { // 取出item的User
			if u.Password == password { // 把它的Password手动比对一下。
				fmt.Printf("Login as %s\n", username)
				return true, nil
			}
		}
	}
	return false, nil
}

func addUser(user *User) (bool, error) {
	// 检查有没有重名的（本项目username要唯一）
	query := elastic.NewTermQuery("username", user.Username)
	searchResult, err := readFromES(query, USER_INDEX)
	if err != nil { // 是否搜索出错？
		return false, err
	}
	if searchResult.TotalHits() > 0 { // 搜索结果是否为空？（是否重复？）
		return false, nil
	}
	// 没重名，则把user存储到USER_INDEX里，id是user.Username
	err = saveToES(user, USER_INDEX, user.Username)
	if err != nil {
		return false, err
	}
	fmt.Printf("User is added: %s\n", user.Username)
	return true, nil
}
