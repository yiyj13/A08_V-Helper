package tests

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"testing"
)

func TestAPICalls(t *testing.T) {

	// 发送 GET 请求
	// resp, err := http.Get("http://localhost:8080/vaccines")
	// if err != nil {
	// 	log.Fatalf("Failed to send GET request: %v", err)
	// }
	// defer resp.Body.Close()

	// // 读取 GET 请求的响应
	// body, err := io.ReadAll(resp.Body)
	// if err != nil {
	// 	log.Fatalf("Failed to read response body: %v", err)
	// }
	// log.Printf("GET Response: %s", string(body))

	// 构造 POST 请求的 JSON 数据
	postData := []byte(`{"name":"TestVaccine","description":"TestDesc","targetDisease":"TestDisease"}`)

	// 发送 POST 请求
	resp, err := http.Post("http://localhost:8080/vaccines", "application/json", bytes.NewBuffer(postData))
	if err != nil {
		log.Fatalf("Failed to send POST request: %v", err)
	}
	defer resp.Body.Close()

	// 读取 POST 请求的响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response body: %v", err)
	}
	log.Printf("POST Response: %s", string(body))

	// 发送 GET 请求
	resp, err = http.Get("http://localhost:8080/vaccines")
	if err != nil {
		log.Fatalf("Failed to send GET request: %v", err)
	}
	defer resp.Body.Close()

	// 读取 GET 请求的响应
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		log.Fatalf("Failed to read response body: %v", err)
	}
	log.Printf("GET Response: %s", string(body))
}
