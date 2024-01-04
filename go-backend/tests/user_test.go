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

func TestUser(t *testing.T) {
	const url string = "http://localhost:80/api/users"
	timeStr := time.Now().Format("2006-01-02 15:04:05")
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	t.Logf("token: %s", token)
	if err != nil {
		t.Fatalf("Failed to generate JWT: %v", err)
	}

	// POST /users
	newUser := model.User{
		OpenID:            timeStr,
		UserName:          timeStr,
		Email:             "testEmail",
		Phone:             "testPhone",
		Avatar:            "testAvatar",
		FollowingVaccines: []model.Vaccine{},
		FollowingArticles: []model.Article{},
		Token:             token,
	}
	jsonData, _ := json.Marshal(newUser)
	resp, err := sendRequestWithToken("POST", url, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	// GET /users
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

	var users []model.User
	if err := json.Unmarshal(body, &users); err != nil {
		t.Fatalf("Failed to unmarshal response body: %v", err)
	}
	var userId uint
	for _, user := range users {
		if user.UserName == timeStr {
			userId = user.ID
			break
		}
	}
	urlId := url + "/" + strconv.Itoa(int(userId))
	t.Logf("urlId: %s", urlId)

	// GET /users/:id
	resp, err = sendRequestWithToken("GET", urlId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// PUT /users/:id
	newUser.UserName = "testUpdateUserName"
	jsonData, _ = json.Marshal(newUser)
	resp, err = sendRequestWithToken("PUT", urlId, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send PUT request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to update: %v", resp.StatusCode)
	}

	// GET /user/:id/following
	urlIdFollowing := urlId + "/following"
	resp, err = sendRequestWithToken("GET", urlIdFollowing, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /users/addfollowingVaccine/:id
	urlIdAddFollowingVaccine := url + "/addfollowingVaccine/" + strconv.Itoa(int(userId)) + "?vaccine_id=1"
	resp, err = sendRequestWithToken("GET", urlIdAddFollowingVaccine, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /users/deletefollowingVaccine/:id
	urlIdDeleteFollowingVaccine := url + "/removefollowingVaccine/" + strconv.Itoa(int(userId)) + "?vaccine_id=1"
	resp, err = sendRequestWithToken("GET", urlIdDeleteFollowingVaccine, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// Create article for test
	newArticle := model.Article{
		Title:     timeStr,
		Content:   "testContent",
		UserName:  "testUserName",
		UserID:    userId,
		IsBind:    true,
		VaccineID: 1,
	}
	jsonData, _ = json.Marshal(newArticle)
	urlArticle := "http://localhost:80/api/articles"
	resp, err = sendRequestWithToken("POST", urlArticle, bytes.NewBuffer(jsonData), token)
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to create: %v", resp.StatusCode)
	}

	articleId, err := getArticleIdByName(timeStr)
	if err != nil {
		t.Fatalf("Failed to get article id: %v", err)
	}
	t.Logf("articleId: %d", articleId)

	// GET /users/addfollowingArticle/:id
	urlIdAddFollowingArticle := url + "/addfollowingArticle/" + strconv.Itoa(int(userId)) + "?article_id=" + strconv.Itoa(int(articleId))
	resp, err = sendRequestWithToken("GET", urlIdAddFollowingArticle, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// GET /users/deletefollowingArticle/:id
	urlIdDeleteFollowingArticle := url + "/removefollowingArticle/" + strconv.Itoa(int(userId)) + "?article_id=" + strconv.Itoa(int(articleId))
	resp, err = sendRequestWithToken("GET", urlIdDeleteFollowingArticle, nil, token)
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}

	// remove article for test
	urlArticleId := urlArticle + "/" + strconv.Itoa(int(articleId))
	resp, err = sendRequestWithToken("DELETE", urlArticleId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to delete: %v", resp.StatusCode)
	}

	// DELETE /users/:id
	resp, err = sendRequestWithToken("DELETE", urlId, nil, token)
	if err != nil {
		t.Fatalf("Failed to send DELETE request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to get: %v", resp.StatusCode)
	}
}
