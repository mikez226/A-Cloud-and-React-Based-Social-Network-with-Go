package main

import (
	"context"
	"fmt"
	"github.com/olivere/elastic"
)

const (
	ES_URL = "http://10.170.0.2:9200"
)

func readFromES(query elastic.Query, index string) (*elastic.SearchResult, error) {
	// Step 1. connection
	fmt.Println("step into readFromES")
	client, err := elastic.NewClient(
		elastic.SetURL(ES_URL),
		elastic.SetBasicAuth("elastic", DATABASE_PASSWORD))
	if err != nil {
		fmt.Println("client creation error")
		return nil, err
	}
	// Step 2. Search using arguments
	// searchResult是搜索结果, search with a term query
	searchResult, err := client.Search().
		Index(index).            // search in index ‘index’
		Query(query).            // specify the query
		Pretty(true).            // pretty print request and response JSON
		Do(context.Background()) // execute
	if err != nil {
		return nil, err
	}
	// Step 3. Return the result
	return searchResult, nil
}

func saveToES(i interface{}, index string, id string) error {
	// 要存储的内容是一个 i, interface。不是一个具体的数据类型。（本次只存post）
	// 1. 建立连接
	client, err := elastic.NewClient(
		elastic.SetURL(ES_URL),
		elastic.SetBasicAuth("elastic", DATABASE_PASSWORD))
	if err != nil {
		return err
	}
	// 2. 存储数据(i)到index里，给的id是id
	_, err = client.Index().
		Index(index).
		Id(id).
		BodyJson(i).
		Do(context.Background())

	if err != nil {
		return err
	}

	return nil
}
