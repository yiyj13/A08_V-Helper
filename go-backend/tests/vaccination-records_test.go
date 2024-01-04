package tests

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"testing"
	"time"

	"v-helper/internal/model"
	"v-helper/pkg/utils"
)

func TestVaccinationRecord(t *testing.T) {
	// Create user for testing
	const urlUser string = "http://localhost:80/api/users"
	const url string = "http://localhost:80/api/vaccination-records"
	adminUser := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(adminUser)
	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	newUser := model.User{
		OpenID:   timeStr,
		UserName: timeStr,
		Token:    token,
	}
	jsonData, _ := json.Marshal(newUser)
	resp, _ := sendRequestWithToken("POST", urlUser, bytes.NewBuffer(jsonData), token)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}
	userId, _ := getUserIdByUserName(newUser.UserName)

	// Create profile for testing
	const urlProfile string = "http://localhost:80/api/profiles"
	newProfile := model.Profile{
		UserID: userId,
	}
	jsonData, _ = json.Marshal(newProfile)
	resp, _ = sendRequestWithToken("POST", urlProfile, bytes.NewBuffer(jsonData), token)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}
	profileId, _ := getProfileIdByUserId(userId)

	// POST /vaccination-records
	newVaccinationRecord := model.VaccinationRecord{
		ProfileID:           profileId,
		VaccineID:           1,
		Vaccine:             model.Vaccine{},
		VaccinationDate:     timeStr,
		Voucher:             timeStr,
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
	jsonData, _ = json.Marshal(newVaccinationRecord)
	resp, err = sendRequestWithToken("POST", url, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /vaccination-records
	resp, err = sendRequestWithToken("GET", url, nil, token)
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
	var recordId uint
	for _, vaccinationRecord := range vaccinationRecords {
		if vaccinationRecord.Voucher == timeStr {
			recordId = vaccinationRecord.ID
			break
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(recordId))
	urlProfileId := url + "/profile/" + strconv.Itoa(int(profileId))

	// GET /vaccination-records/:id
	resp, err = sendRequestWithToken("GET", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /vaccination-records/profile/:profileID
	resp, err = sendRequestWithToken("GET", urlProfileId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /vaccination-records/user/:userID
	urlUserId := url + "/user/" + strconv.Itoa(int(userId))
	resp, err = sendRequestWithToken("GET", urlUserId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /vaccination-records/:id
	newVaccinationRecord.Voucher = "testUpdateVoucher"
	jsonData, _ = json.Marshal(newVaccinationRecord)
	resp, err = sendRequestWithToken("PUT", urlWithId, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// DELETE /vaccination-records/:id
	resp, err = sendRequestWithToken("DELETE", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// Remove profile for testing
	resp, err = sendRequestWithToken("DELETE", "http://localhost:80/api/profiles"+"/"+strconv.Itoa(int(profileId)), nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// Remove user for testing
	resp, err = sendRequestWithToken("DELETE", "http://localhost:80/api/users"+"/"+strconv.Itoa(int(userId)), nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
}
