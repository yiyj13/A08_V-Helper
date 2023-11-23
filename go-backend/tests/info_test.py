import requests
from time import sleep

url = "http://127.0.0.1:80/api/vaxinfo"

def test_vaxinfo_all():
    response = requests.get(url)
    print(response.text)

def test_vaxinfo_specified():
    params = {"name":"Pfizer"}
    response = requests.get(url, params=params)
    print(response.text)

test_vaxinfo_all()
sleep(0.5)
test_vaxinfo_specified()
