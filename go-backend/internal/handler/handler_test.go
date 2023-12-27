package handler

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strconv"
	"testing"
	"v-helper/internal/model"
)

// 该函数的覆盖率为 0，请求方法没有被 go test 统计
// 若想得到覆盖率，需要使用 gomock，方法参见 internal/service 下的测试文件
func TestSetupRoutes(t *testing.T) {
	http.Get("http://localhost:80/api/users")
	http.Get("http://localhost:80/api/profiles")
	http.Get("http://localhost:80/api/vaccines")
	http.Get("http://localhost:80/api/vaccination-records")
	http.Get("http://localhost:80/api/temperature-records")
	http.Get("http://localhost:80/api/articles")
}

func TestClinic(t *testing.T) {
	// 测试 POST
	newClinicInfo := []byte(
		`{"vaccineName": "测试疫苗",
			"ClinicList": "测试医院1;测试医院2"},`)
	resp, err := http.Post(
		"http://localhost:80/api/clinics",
		"application/json",
		bytes.NewBuffer(newClinicInfo))
	if err != nil {
		t.Fatalf("Failed to send POST request: %v", err)
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}
	log.Printf("POST Response: %s", string(body))

	// 测试 GET
	resp, err = http.Get("http://localhost:80/api/clinics")
	if err != nil {
		t.Fatalf("Failed to send GET request: %v", err)
	}

	defer resp.Body.Close()
	body, err = io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}

	var vaccineClinicLists []model.VaccineClinicList
	err = json.Unmarshal(body, &vaccineClinicLists)
	if err != nil {
		t.Fatalf("Failed to unmarshal GET response body: %v", err)
	}

	var testIDs []uint
	for _, vaccineClinicList := range vaccineClinicLists {
		if vaccineClinicList.VaccineName == "测试疫苗" {
			testIDs = append(testIDs, vaccineClinicList.ID)
		}
	}
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}
	log.Printf("GET Response: %s", string(body))

	// 测试 DELETE
	for _, testID := range testIDs {
		req, err := http.NewRequest("DELETE", "http://localhost:80/api/clinics/"+strconv.Itoa(int(testID)), nil)
		if err != nil {
			t.Fatalf("Failed to create DELETE request: %v", err)
		}

		deleteResp, err := http.DefaultClient.Do(req)
		if err != nil {
			t.Fatalf("Failed to send DELETE request: %v", err)
		}
		defer deleteResp.Body.Close()

		// 读取 DELETE 请求返回的数据
		deleteBody, err := io.ReadAll(deleteResp.Body)
		if err != nil {
			t.Fatalf("Failed to read DELETE response body: %v", err)
		}
		log.Printf("DELETE Response: %s", string(deleteBody))
	}
}
