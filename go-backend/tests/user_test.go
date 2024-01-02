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
)

func TestUser(t *testing.T) {
	const url string = "http://localhost:80/api/users"
	timeStr := time.Now().Format("2006-01-02 15:04:05")

	// POST /users
	newUser := model.User{
		OpenID:            timeStr,
		UserName:          "testUserName",
		Email:             "testEmail",
		Phone:             "testPhone",
		Avatar:            "testAvatar",
		FollowingVaccines: []model.Vaccine{},
		FollowingArticles: []model.Article{},
		Token:             "testToken",
	}
	jsonData, _ := json.Marshal(newUser)
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

	// GET /users
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

	var users []model.User
	if err := json.Unmarshal(body, &users); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, user := range users {
		if user.UserName == "testUserName" {
			targetID = user.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// GET /users/:id
	resp, err = http.Get(urlWithId)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /users/:id
	newUser.UserName = "testUpdateUserName"
	jsonData, _ = json.Marshal(newUser)
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

	// DELETE /users/:id
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
