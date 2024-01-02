package tests

import (
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"testing"

	"v-helper/internal/model"
)

func TestMessage(t *testing.T) {
	const url string = "http://localhost:80/api/messages"

	// GET /messages
	resp, err := http.Get(url)
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

	var messages []model.Message
	if err := json.Unmarshal(body, &messages); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint = 0
	for _, message := range messages {
		if message.OpenID == "testOpenID" {
			targetID = message.ID
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))

	// DELETE /messages/:id
	req, err := http.NewRequest("DELETE", urlWithId, nil)
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
