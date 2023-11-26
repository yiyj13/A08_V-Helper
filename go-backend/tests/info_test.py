import requests
import random
from time import sleep

url = "http://127.0.0.1:80/api/vaccines"

rand_name = "Vaccine" + str(random.randint(0, 1000))
rand_name_updated = "Vaccine" + str(random.randint(2000, 3000))

def test_CreateVaccine():
    data = {
        "name": rand_name,
        "description": "This is a test vaccine",
        "targetDisease": "COVID-19",
        "sideEffects": "None",
        "precautions": "None"
    }
    response = requests.post(url, json=data)
    print(response.text)

def test_GetAllVaccines():
    response = requests.get(url)
    print(response.text)

def test_GetVaccineByID():
    response = requests.get(url + "/1")
    print(response.text)

def test_UpdateVaccine():
    data = {
        "name": rand_name_updated,
        "description": "updated",
        "targetDisease": "COVID-19",
        "sideEffects": "None",
        "precautions": "None"
    }
    response = requests.put(url + "/1", json=data)
    print(response.text)

test_CreateVaccine()
sleep(0.5)
test_GetAllVaccines()
sleep(0.5)
test_UpdateVaccine()
sleep(0.5)
test_GetVaccineByID()