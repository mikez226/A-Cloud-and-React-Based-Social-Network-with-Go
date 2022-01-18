package main

import (
	"context"
	"fmt"
	"io"

	"cloud.google.com/go/storage"
)

const (
	BUCKET_NAME = "around-yaowei-bucket"
)

func saveToGCS(r io.Reader, objectName string) (string, error) { // 两个返回值
	ctx := context.Background()
	// i. 建立连接
	client, err := storage.NewClient(ctx) // 建立client，elastic里面是Elastic.NewClient
	if err != nil {
		return "", err
	}
	// ii. 上传文件
	// 1 得到object,它代表即将写入的新文件（类似一个文件）
	object := client.Bucket(BUCKET_NAME).Object(objectName)
	// 2 再获得该object的writer。这里拆成两步了。
	wc := object.NewWriter(ctx) // ctx可以提供一个ddl，这里没提供
	// 3 写数据到object
	if _, err := io.Copy(wc, r); err != nil {
		return "", err
	}

	if err := wc.Close(); err != nil {
		return "", err
	}
	// ※ 这句话的意思：修改object的Access Control，所有users的权限都是reader。其实是为了让前端能够访问。
	if err := object.ACL().Set(ctx, storage.AllUsers, storage.RoleReader); err != nil {
		return "", err
	}

	// iii. 返回文件的Link
	// 1 先试图获得attributes
	attrs, err := object.Attrs(ctx)
	if err != nil {
		return "", err
	}
	// 2 返回attrs.MediaLink，即Link
	fmt.Printf("Image is saved to GCS: %s\n", attrs.MediaLink)
	return attrs.MediaLink, nil // 两个返回值，第一个是存好后的GCS的link，一会儿存ES里。
}
