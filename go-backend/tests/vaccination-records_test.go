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

func TestVaccinationRecord(t *testing.T) {
	const url string = "http://localhost:80/api/vaccination-records"

	// POST /vaccination-records
	newVaccinationRecord := model.VaccinationRecord{
		ProfileID:           1,
		VaccineID:           1,
		Vaccine:             model.Vaccine{},
		VaccinationDate:     "2021-07-01",
		Voucher:             "testVoucher",
		VaccinationLocation: "testLocation",
		VaccinationType:     "testType",
		NextVaccinationDate: "2021-08-01",
		Note:                "testNote",
		IsCompleted:         true,
		Reminder:            true,
		RemindTime:          "2021-07-01 12:00",
		Valid:               "2021-07-01 12:00",
		RemindBefore:        "2021-07-01 12:00",
	}
	jsonData, _ := json.Marshal(newVaccinationRecord)
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

	// GET /vaccination-records
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

	var vaccinationRecords []model.VaccinationRecord
	if err := json.Unmarshal(body, &vaccinationRecords); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, vaccinationRecord := range vaccinationRecords {
		if vaccinationRecord.Voucher == "testVoucher" {
			targetID = vaccinationRecord.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// GET /vaccination-records/:id
	resp, err = http.Get(urlWithId)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /vaccination-records/:id
	newVaccinationRecord.Voucher = "testUpdateVoucher"
	jsonData, _ = json.Marshal(newVaccinationRecord)
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

	// DELETE /vaccination-records/:id
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
