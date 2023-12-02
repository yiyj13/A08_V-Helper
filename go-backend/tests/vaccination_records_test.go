package tests

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"testing"
)

func TestCreateVaccinationRecord(t *testing.T) {
	newVaccinationRecord := []byte(
		`{"profileId": 1,
		"vaccineId": 2,
		"vaccinationDate": "2021-07-01",
		"voucher": "Voucher123",
		"vaccinationLocation": "本地社区医院",
		"reminder": true,
		"nextVaccinationDate": "2022-07-01",
		"note": "无明显不适反应"}`)
	resp, err := http.Post("http://localhost:8080/vaccination-records", "application/json", bytes.NewBuffer(newVaccinationRecord))
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	defer resp.Body.Close()

	// 读取 POST 请求的响应
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}
	log.Printf("POST Response: %s", string(body))
}
