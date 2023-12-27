# locustfile.py
from locust import HttpUser, task, between

class WebsiteUser(HttpUser):
    wait_time = between(1, 5)  # 用户执行任务之间等待的时间（秒）

    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJPcGVuSUQiOiJBZG1pbiIsImV4cCI6MTcwMzY2MjY5NX0.jOcFKCwvtiQtDVZezsXjYc5PV2yOnJqvr2HwxuaAZ-c"

    headers = {
        "Authorization": f"Bearer {token}"
    }

    @task
    def index_page(self):
        self.client.get("/")  # 访问首页

    @task(2)
    def users_page(self):
        self.client.get("/api/users", headers=self.headers)  # 访问用户列表

    @task(2)
    def profile_page(self):
        self.client.get("/api/profiles", headers=self.headers)  # 访问用户列表

    @task(4)
    def vaccine_page(self):
        self.client.get("/api/vaccines", headers=self.headers)

    @task(4)
    def vaccination_record_page(self):
        self.client.get("/api/vaccination-records", headers=self.headers)

    @task(4)
    def temperature_record_page(self):
        self.client.get("/api/temperature-records", headers=self.headers)
