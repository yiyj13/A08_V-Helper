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

func TestProfile(t *testing.T) {
	const url string = "http://localhost:80/api/profiles"
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}

	// POST /profiles
	newProfile := model.Profile{
		UserID:       1,
		FullName:     timeStr,
		Gender:       "testGender",
		DateOfBirth:  "testDateOfBirth",
		Relationship: "testRelationship",
		Avatar:       "testAvatar",
	}
	jsonData, _ := json.Marshal(newProfile)
	resp, err := sendRequestWithToken("POST", url, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /profiles
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

	var profiles []model.Profile
	if err := json.Unmarshal(body, &profiles); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	var targetUserId uint
	for _, profile := range profiles {
		if profile.FullName == timeStr {
			targetID = profile.ID
			targetUserId = profile.UserID
			break
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))
	urlUserId := url + "/user/" + strconv.Itoa(int(targetUserId))

	// GET /profiles/:id
	resp, err = sendRequestWithToken("GET", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /profiles/:id
	newProfile.FullName = "testUpdateFullName"
	jsonData, _ = json.Marshal(newProfile)
	resp, err = sendRequestWithToken("PUT", urlWithId, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /profiles/user/:userID
	resp, err = sendRequestWithToken("GET", urlUserId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// DELETE /profiles/:id
	resp, err = sendRequestWithToken("DELETE", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
}
