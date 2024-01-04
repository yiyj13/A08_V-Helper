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

func TestTempertureRecord(t *testing.T) {
	// Create user for testing
	const url string = "http://localhost:80/api/temperature-records"
	const apiUsers string = "http://localhost:80/api/users"
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	adminUser := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(adminUser)
	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}
	newUser := model.User{
		OpenID:   timeStr,
		UserName: timeStr,
		Token:    token,
	}
	jsonData, _ := json.Marshal(newUser)
	resp, _ := sendRequestWithToken("POST", apiUsers, bytes.NewBuffer(jsonData), token)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}
	userId, _ := getUserIdByUserName(newUser.UserName)

	// Create profile for testing
	const apiProfiles string = "http://localhost:80/api/profiles"
	newProfile := model.Profile{
		UserID: userId,
	}
	jsonData, _ = json.Marshal(newProfile)
	resp, _ = sendRequestWithToken("POST", apiProfiles, bytes.NewBuffer(jsonData), token)
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}
	profileId, _ := getProfileIdByUserId(userId)

	// POST /articles
	newTempertureRecord := model.TempertureRecord{
		ProfileID:   profileId,
		Date:        timeStr,
		Temperature: 36.5,
	}
	jsonData, _ = json.Marshal(newTempertureRecord)
	resp, err = sendRequestWithToken("POST", url, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /articles
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

	var articles []model.TempertureRecord
	if err := json.Unmarshal(body, &articles); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var recordId uint
	for _, article := range articles {
		if article.Date == timeStr {
			recordId = article.ID
			break
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(recordId))
	urlProfileId := url + "/profile/" + strconv.Itoa(int(profileId))

	// GET /articles/:id
	resp, err = sendRequestWithToken("GET", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /articles/profile/:profileID
	resp, err = sendRequestWithToken("GET", urlProfileId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /articles/user/:userID
	urlUserId := url + "/user/" + strconv.Itoa(int(userId))
	resp, err = sendRequestWithToken("GET", urlUserId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /articles/:id
	newTempertureRecord.Date = "2023-01-01 12:00"
	jsonData, _ = json.Marshal(newTempertureRecord)
	resp, err = sendRequestWithToken("PUT", urlWithId, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// DELETE /articles/:id
	resp, err = sendRequestWithToken("DELETE", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// Remove profile for testing
	resp, err = sendRequestWithToken("DELETE", apiProfiles+"/"+strconv.Itoa(int(profileId)), nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// Remove user for testing
	resp, err = sendRequestWithToken("DELETE", apiUsers+"/"+strconv.Itoa(int(userId)), nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
}
