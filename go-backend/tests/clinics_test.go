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

func TestVaccineClinicList(t *testing.T) {
	const url string = "http://localhost:80/api/clinics"

	// POST /clinics
	newVaccineClinicList := model.VaccineClinicList{
		VaccineName: "testVaccineName",
		ClinicList:  "testClinicList",
	}
	jsonData, _ := json.Marshal(newVaccineClinicList)
	resp, err := http.Post(
		url,
		"application/json", bytes.NewBuffer(jsonData),
	)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /clinics
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

	var vaccineClinicLists []model.VaccineClinicList
	if err := json.Unmarshal(body, &vaccineClinicLists); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, vaccineClinicList := range vaccineClinicLists {
		if vaccineClinicList.VaccineName == "testVaccineName" {
			targetID = vaccineClinicList.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// GET /clinics/:id
	resp, err = http.Get(urlWithId)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /clinics/:id
	newVaccineClinicList.VaccineName = "testUpdateVaccineName"
	jsonData, _ = json.Marshal(newVaccineClinicList)
	req, err := http.NewRequest("PUT", urlWithId, bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to create PUT request: %v", err)
	}
	resp, err = http.DefaultClient.Do(req)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to update: %v", resp.StatusCode)
	}

	// DELETE /clinics/:id
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
