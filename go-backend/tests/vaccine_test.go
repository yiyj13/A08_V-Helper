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

func TestVaccine(t *testing.T) {
	const url string = "http://localhost:80/api/vaccines"

	// POST /vaccines
	newVaccine := model.Vaccine{
		Name:          "testName",
		Description:   "testDescription",
		TargetDisease: "testTargetDisease",
		SideEffects:   "testSideEffects",
		Precautions:   "testPrecautions",
		ValidPeriod:   1,
		Type:          "testType",
	}
	jsonData, _ := json.Marshal(newVaccine)
	resp, err := http.Post(
		"http://localhost:80/api/vaccines",
		"application/json", bytes.NewBuffer(jsonData),
	)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET
	resp, err = http.Get("http://localhost:80/api/vaccines")
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

	var vaccines []model.Vaccine
	if err := json.Unmarshal(body, &vaccines); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, vaccine := range vaccines {
		if vaccine.Name == "testName" {
			targetID = vaccine.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// PUT /vaccines/:id
	newVaccine.Name = "testName2"
	jsonData, _ = json.Marshal(newVaccine)
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

	// DELETE /vaccines/:id
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
