package tests

import (
	"encoding/json"
	"io"
	"net/http"
	"v-helper/internal/model"
	"v-helper/pkg/utils"
)

// func sendRequestWithToken(method string, url string, body io.Reader) (resp *http.Response, err error) {
func sendRequestWithToken(method string, url string, body io.Reader, token string) (resp *http.Response, err error) {
	// user := model.User{OpenID: "Admin"}
	// token, err := utils.GenerateJWT(user)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token)
	return http.DefaultClient.Do(req)
}

func getArticleIdByName(name string) (uint, error) {
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	if err != nil {
		return 0, err
	}
	url := "http://localhost:80/api/articles"
	resp, err := sendRequestWithToken("GET", url, nil, token)
	if err != nil {
		return 0, err
	}
	if resp.StatusCode != http.StatusOK {
		return 0, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}
	var articles []model.Article
	if err := json.Unmarshal(body, &articles); err != nil {
		return 0, err
	}
	var targetID uint
	for _, article := range articles {
		if article.Title == name {
			targetID = article.ID
			break
		}
	}
	return targetID, nil
}

func getUserIdByUserName(name string) (uint, error) {
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	if err != nil {
		return 0, err
	}
	url := "http://localhost:80/api/users"
	resp, err := sendRequestWithToken("GET", url, nil, token)
	if err != nil {
		return 0, err
	}
	if resp.StatusCode != http.StatusOK {
		return 0, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}
	var users []model.User
	if err := json.Unmarshal(body, &users); err != nil {
		return 0, err
	}
	var targetID uint
	for _, user := range users {
		if user.UserName == name {
			targetID = user.ID
			break
		}
	}
	return targetID, nil
}

func getProfileIdByUserId(userId uint) (uint, error) {
	user := model.User{OpenID: "Admin"}
	token, err := utils.GenerateJWT(user)
	if err != nil {
		return 0, err
	}
	url := "http://localhost:80/api/users"
	resp, err := sendRequestWithToken("GET", url, nil, token)
	if err != nil {
		return 0, err
	}
	if resp.StatusCode != http.StatusOK {
		return 0, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}
	var profiles []model.Profile
	if err := json.Unmarshal(body, &profiles); err != nil {
		return 0, err
	}
	var targetID uint
	for _, profile := range profiles {
		if profile.UserID == userId {
			targetID = profile.ID
			break
		}
	}
	return targetID, nil
}
