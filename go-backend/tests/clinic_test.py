import requests
from time import sleep

url = "http://127.0.0.1:80/api/clinics"

def test_CreateClinic():
  data = {
    "vaccineName": "乙肝疫苗",
    "clinicInfo": "航天中心医院成人免疫接种门诊,39.916563,116.252366;北京大学人民医院狂犬疫苗接种门诊,39.937132,116.354416;"
  }
  response = requests.post(url, json=data)
  print(response.text)

def test_GetAllClinics():
  response = requests.get(url)
  print(response.text)

def test_DeleteClinic():
  response = requests.delete(url)
  print(response.text)

test_CreateClinic()
sleep(0.5)
test_GetAllClinics()