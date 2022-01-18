package main

import (
	"context"
	"fmt"

	"github.com/olivere/elastic"
)

const (
	POST_INDEX = "post"
	USER_INDEX = "user"
	ES_URL     = "http://10.170.0.2:9200"
)

func main() {
	// Obtain a client. Provide the HTTP CLIENT url (target) and my ID.
	client, err := elastic.NewClient(
		elastic.SetURL(ES_URL),                               // target
		elastic.SetBasicAuth("elastic", DATABASE_PASSWORD)) // id
	if err != nil {
		panic(err)
	}
	// 问问有没有这个Index，如果连接成功并且不存在POST_INDEX，就创建一个index.
	exists, err := client.IndexExists(POST_INDEX).Do(context.Background()) // 提供空的context
	if err != nil {
		panic(err)
	}
	if !exists {
		// mapping相当于schema，标记一个document有哪些properties。是POST struct里面的内容。
		// type指明了类型，index指明是否需要建立索引，默认是true。
		// keyword相当于一个单词，短string。建立索引意味着加快搜索。同hashmap或BST等
		// text则是一段话，长string。
		// url和type是指明了img或者video的url。不需要被搜索就不建立index了
		mapping := `{
                        "mappings": {
                                "properties": {
                                        "user":     { "type": "keyword" },
                                        "message":  { "type": "text" },
                                        "url":      { "type": "keyword", "index": false },
                                        "type":     { "type": "keyword", "index": false }
                                }
                        }
                }`
		// 创建一个index（database），用到了index名字、mapping（schema）、Do()开始执行。
		_, err := client.CreateIndex(POST_INDEX).Body(mapping).Do(context.Background())
		// 如果没有错误，这个index就创建成功了
		if err != nil {
			panic(err)
		}
	}

	exists, err = client.IndexExists(USER_INDEX).Do(context.Background())
	if err != nil {
		panic(err)
	}

	if !exists {
		mapping := `{
                        "mappings": {
                                "properties": {
                                        "username": {"type": "keyword"},
                                        "password": {"type": "keyword", "index": false},
                                        "age":      {"type": "long", "index": false},
                                        "gender":   {"type": "keyword", "index": false}
                                }
                        }
                }`
		_, err = client.CreateIndex(USER_INDEX).Body(mapping).Do(context.Background())
		if err != nil {
			panic(err)
		}
	}

	fmt.Println("Indexes are created.")
}

