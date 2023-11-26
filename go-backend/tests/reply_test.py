import requests
from time import sleep

url = "http://127.0.0.1:80/api/replys"

def test_CreateReply():
    data = {
        "content": "hi",
        "userName": "tzh",
        "articleId": 1
    }
    response = requests.post(url, json=data)
    print(response.text)

def test_GetAllReplys():
    response = requests.get(url)
    print(response.text)

def test_GetReplyByArticleId():
    response = requests.get(url, params={"article_id": 1})
    print(response.text)

def test_GetReplyByReplyId():
    response = requests.get(url + "/1")
    print(response.text)

def test_UpdateReply():
    data = {
        "content": "greeting",
        "userName": "tzh",
        "articleId": 1
    }
    response = requests.put(url + "/1", json=data)
    print(response.text)

test_CreateReply()
sleep(0.5)
test_GetAllReplys()
sleep(0.5)
test_GetReplyByArticleId()
sleep(0.5)
test_UpdateReply()
sleep(0.5)
test_GetReplyByReplyId()