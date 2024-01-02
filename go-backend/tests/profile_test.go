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

func TestProfile(t *testing.T) {
	const url string = "http://localhost:80/api/profiles"

	// POST /profiles
	newProfile := model.Profile{
		UserID:       1,
		FullName:     "testFullName",
		Gender:       "testGender",
		DateOfBirth:  "testDateOfBirth",
		Relationship: "testRelationship",
		Avatar:       "testAvatar",
	}
	jsonData, _ := json.Marshal(newProfile)
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /profiles
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

	var profiles []model.Profile
	if err := json.Unmarshal(body, &profiles); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, profile := range profiles {
		if profile.FullName == "testFullName" {
			targetID = profile.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// GET /profiles/:id
	resp, err = http.Get(urlWithId)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /profiles/:id
	newProfile.FullName = "testUpdateFullName"
	jsonData, _ = json.Marshal(newProfile)
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

	// DELETE /profiles/:id
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
