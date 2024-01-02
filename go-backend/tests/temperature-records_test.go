package tests

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"testing"

	"v-helper/internal/model"
)

func TestTempertureRecord(t *testing.T) {
	const url string = "http://localhost:80/api/temperature-records"

	// POST
	newTempertureRecord := model.TempertureRecord{
		ProfileID:   1,
		Date:        "2021-07-01 12:00",
		Temperature: 36.5,
	}
	jsonData, _ := json.Marshal(newTempertureRecord)
	resp, err := http.Post(
		url,
		"application/json", bytes.NewBuffer(jsonData),
	)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /articles
	resp, err = http.Get(url)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}
	t.Logf("GET Response: %s", string(body))

	var articles []model.TempertureRecord
	if err := json.Unmarshal(body, &articles); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, article := range articles {
		if article.Date == "2021-07-01 12:00" {
			targetID = article.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// GET /articles/:id
	resp, err = http.Get(urlWithId)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /articles/:id
	newTempertureRecord.Date = "2023-01-01 12:00"
	jsonData, _ = json.Marshal(newTempertureRecord)
	req, err := http.NewRequest("PUT", urlWithId, bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create PUT request: %v", err)
	}
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// DELETE /articles/:id
	req, err = http.NewRequest("DELETE", urlWithId, nil)
	if err != nil {
		t.Fatalf("Failed to create DELETE request: %v", err)
	}
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
}
