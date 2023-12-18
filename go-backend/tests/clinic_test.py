import requests
from time import sleep

url = "http://127.0.0.1:80/api/clinics"

def test_CreateClinic():
  data = {
    "vaccineId": 3,
    "vaccineName": "乙肝疫苗"
  }
  response = requests.post(url, json=data)
  print(response.text)

def test_GetAllClinics():
  response = requests.get(url)
  print(response.text)

test_CreateClinic()
sleep(0.5)
test_GetAllClinics()