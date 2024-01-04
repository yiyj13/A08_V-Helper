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

func TestReply(t *testing.T) {
	const url string = "http://localhost:80/api/replys"
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}

	// POST /replys
	newReply := model.Reply{
		ArticleID: 1,
		UserID:    1,
		Content:   "testContent",
		UserName:  timeStr,
	}
	jsonData, _ := json.Marshal(newReply)
	resp, err := sendRequestWithToken("POST", url, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /replys
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

	var profiles []model.Reply
	if err := json.Unmarshal(body, &profiles); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	for _, profile := range profiles {
		if profile.UserName == timeStr {
			targetID = profile.ID
			break
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// GET /replys/:id
	resp, err = sendRequestWithToken("GET", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /replys/:id
	newReply.Content = "testUpdateContent"
	jsonData, _ = json.Marshal(newReply)
	resp, err = sendRequestWithToken("PUT", urlWithId, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to update: %v", resp.StatusCode)
	}

	// DELETE /replys/:id
	resp, err = sendRequestWithToken("DELETE", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
}
