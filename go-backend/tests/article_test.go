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

func TestArticle(t *testing.T) {
	const url string = "http://localhost:80/api/articles"
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}

	// POST /articles
	newArticle := model.Article{
		Title:     timeStr,
		Content:   "testContent",
		UserName:  "testUserName",
		UserID:    1,
		IsBind:    true,
		VaccineID: 1,
	}
	jsonData, _ := json.Marshal(newArticle)
	resp, err := sendRequestWithToken("POST", url, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
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

	var articles []model.Article
	if err := json.Unmarshal(body, &articles); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var targetID uint
	var targetUserId uint
	for _, article := range articles {
		if article.Title == timeStr {
			targetID = article.ID
			targetUserId = article.UserID
			break
		}
	}
	urlWithId := url + "/" + strconv.Itoa(int(targetID))
	urlUserId := url + "/user/" + strconv.Itoa(int(targetUserId))

	// GET /articles/:id
	resp, err = sendRequestWithToken("GET", urlWithId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /articles/user/:userID
	resp, err = sendRequestWithToken("GET", urlUserId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /articles/:id
	newArticle.Title = "testTitle2"
	jsonData, _ = json.Marshal(newArticle)
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
}
