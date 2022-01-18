package main

import (
	"fmt"
	"mime/multipart"
	"reflect"

	"github.com/olivere/elastic"
	"github.com/pborman/uuid"
)

const (
	POST_INDEX = "post"
)

type Post struct { // 后面这一段相当于是Jackson的功能，映射了member和key
	User    string `json:"user"`
	Message string `json:"message"` // `` 反引号，意思是里面都是raw string，就不用反义了
	Url     string `json:"url"`
	Type    string `json:"type"`
}

func searchPostsByUser(user string) ([]Post, error) {
	// 准备好query的内容，即搜索条件
	query := elastic.NewTermQuery("user", user)
	// 把query和index作为参数放到readFromES里面搜索
	searchResult, err := readFromES(query, POST_INDEX)
	if err != nil {
		return nil, err
	}
	// 返回从搜索结果中获得的最终结果
	return getPostFromSearchResult(searchResult), nil
}

func searchPostsByKeywords(keywords string) ([]Post, error) {
	// 搜索条件
	query := elastic.NewMatchQuery("message", keywords)
	// AND 是要求message里包括所有关键词，可以改成OR
	query.Operator("AND")
	if keywords == "" {
		query.ZeroTermsQuery("all")
	}
	searchResult, err := readFromES(query, POST_INDEX)
	if err != nil {
		return nil, err
	}
	return getPostFromSearchResult(searchResult), nil
}

func getPostFromSearchResult(searchResult *elastic.SearchResult) []Post {
	var ptype Post // 要是post这个type，用于筛选搜索结果。
	var posts []Post
	// 一个循环，range返回的index和value。
	// 遍历的是搜索结果，把那些数据类型是ptype的拿出来.
	// sql是不需要还判断一下TypeOf的，但是nosql的可能搜出不符合这个结构的东西。安全起见要过滤。
	// reflect就是个library，它提供了TypeOf这个功能。
	for _, item := range searchResult.Each(reflect.TypeOf(ptype)) {
		// := item.(Post) 意思是item cast成(Post)类型的数据。Go里叫 type assertion
		if p, ok := item.(Post); ok {
			posts = append(posts, p)
		}
	}
	return posts
}

func savePost(post *Post, file multipart.File) error {
	// generate id -- using uuid, 产生随机unique的string。和它之前产生的string不会相同
	id := uuid.New()
	// save to GCS，并获得url。
	medialink, err := saveToGCS(file, id)
	if err != nil {
		return err
	}
	post.Url = medialink // 把Url属性填写了
	// save to ES
	err = saveToES(post, POST_INDEX, id)
	if err != nil {
		return err
	}
	fmt.Printf("Post is saved to Elasticsearch: %s", post.Message)
	return nil
}
