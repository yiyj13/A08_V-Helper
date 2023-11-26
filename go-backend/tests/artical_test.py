import requests
from time import sleep
from datetime import datetime

# 获取当前时间
current_time = datetime.now()

# 将时间转换成字符串
formatted_time = current_time.strftime("%Y-%m-%d %H:%M:%S")

url = "http://127.0.0.1:80/api/articles"

def test_CreateArticle():
    data = {
        "title": formatted_time + " test title",
        "content": "hello",
        "creatorName": "tzh"
    }
    response = requests.post(url, json=data)
    print(response.text)

def test_GetAllArticles():
    response = requests.get(url)
    print(response.text)

def test_UpdateArticle():
    data = {
        "title": formatted_time + " test update title",
        "content": "hello",
        "creatorName": "tzh"
    }
    response = requests.put(url + "/1", json=data)
    print(response.text)

def test_GetArticleById():
    response = requests.get(url + "/1")
    print(response.text)

test_CreateArticle()
sleep(0.5)
test_GetAllArticles()
sleep(0.5)
test_UpdateArticle()
sleep(0.5)
test_GetArticleById()
