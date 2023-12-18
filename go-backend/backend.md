[TOC]
# TODO

- [X] 设置 Go 项目，创建测试路由
- [X] 编写简单数据库模型和接口
- [X] 配置文件，数据库连接
- [X] 通过docker-compose部署测试
- [ ] 完善数据库模型
  - [ ] 在model中加入新模型时，需要在init中进行迁移
  - [ ] 在service中实现对模型的增删改查
  - [ ] 在handler中实现API接口，并注册路由
- [x] 用户登录，主要通过微信接口实现(可能考虑用JWT验证保证安全)
- [ ] 对有需要的模型在获取时进行分页、排序(时间排序)和筛选(按疫苗)
  - [x] 帖子
  - [ ] 疫苗
- [x] 更方便地通过json数据更新数据库
- [ ] 更新文档中相关API
- [x] 接种记录的字段完善
- [ ] 收藏帖子和疫苗
- [x] 解耦 接种记录 和 接种预约
- [x] 根据疫苗筛选帖子
- [ ] 消息提醒的发送 (https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/subscribe-message.html)
- [x] 图床



# API 设计

这部分介绍提供给前端的 API 接口，包括请求方法、请求路径、请求参数、请求体、响应体等。

## 用户

登录(通过微信接口而无需密码)，修改个人信息

| 方法 | 路由 | 功能 |
| ---- | ---- | ---- |
| GET | /api/users/login?code=xxx | 通过微信接口登录，第一次登录时会自动注册 |
| GET | /api/users | 获取全部用户信息 |
| PUT | /api/users/:id | 更新指定 id 的用户信息 |
| GET | /api/users/:id/following | 获取指定 id 的用户关注的所有用户 |
| GET | /api/users/addfollowingVaccine/:id?vaccine_id | 指定 id 的用户关注指定 vaccine_id 的疫苗 |
| GET | /api/users/removefollowingVaccine/:id?vaccine_id | 指定 id 的用户取消关注指定 vaccine_id 的疫苗 |
| GET | /api/users/addfollowingArticle/:id?article_id | 指定 id 的用户关注指定 article_id 的帖子 |
| GET | /api/users/removefollowingArticle/:id?article_id | 指定 id 的用户取消关注指定 article_id 的帖子 |


Put 时的 json样例：
```json
{
   "openId": "1234567890",
   "userName": "张三",
   "email": "123@mails.tsinghua.edu.cm",
   "phone": "1234567890",
   "avatar": "http://xxx.com/xxx.jpg"
}
```

## 身份

| 方法 | 路由 | 功能 |
| ---- | ---- | ---- |
| POST | /api/profiles | 添加身份 |
| GET | /api/profiles | 获取全部身份信息 |
| GET | /api/profiles/:id | 获取指定 id 的身份信息 |
| GET | /api/profiles/user/:id | 获取指定 id 的用户管理的所有身份信息 |
| PUT | /api/profiles/:id | 更新指定 id 的身份信息 |
| DELETE | /api/profiles/:id | 删除指定 id 的身份 |

Post 时的json样例
```json
{
   "userId": 1,
   "fullName": "张三",
   "Gender": "男",
   "dateOfBirth": "1999-01-01",
   "relationship": "本人"
}
```


## 接种记录

| 方法 | 路由 | 功能 |
| ---- | ---- | ---- |
| POST | /api/vaccination-records | 添加接种记录 |
| GET | /api/vaccination-records?isCompleted=true | 获取全部已完成接种记录(若为false则获取未完成接种记录) |
| GET | /api/vaccination-records/:id | 获取指定 id 的接种记录 |
| GET | /api/vaccination-records/user/:userID | 获取指定 userID 的用户的接种记录 |
| GET | /api/vaccination-records/profile/:profileID?isCompleted=true | 获取指定 profileID 的接种者的已完成接种记录(若为false则获取未完成接种记录) |
| PUT | /api/vaccination-records/:id | 更新指定 id 的疫苗信息 |
| DELETE | /api/vaccination-records/:id | 删除指定 id 的疫苗信息 |

Post 时的json样例：
```json
{
   "profileId": 1, // 接种者的id, 必填
   "vaccineId": 2, // 疫苗的id, 必填
   "voucher": "Voucher123", // 接种凭证, 选填
   "vaccinationDate": "2021-07-01", // 接种日期, 必填
   "vaccinationLocation": "本地社区医院",
   "vaccinationType": "第一针", // 接种类型, 选填
   "nextVaccinationDate": "2021-08-01", // 下次接种日期, 选填
   "note": "无明显不适反应", // 备注, 选填
   "isCompleted": true, // 是否已完成接种, 选填
   "reminder": true, // 是否提醒本次接种，仅在isCompleted为false时有效，选填
   "remindTime": "2021-06-30 12:00" // 提醒时间，仅在isCompleted为false且reminder为true时有效，选填
}
```

## 体温记录

| 方法 | 路由 | 功能 |
| ---- | ---- | ---- |
| POST | /api/temperature-records | 添加体温记录 |
| GET | /api/temperature-records | 获取全部体温记录 |
| GET | /api/temperature-records/:id | 获取指定 id 的体温记录 |
| GET | /api/temperature-records/profile/:id | 获取指定 id 的接种者的体温记录 |
| PUT | /api/temperature-records/:id | 更新指定 id 的体温记录 |
| DELETE | /api/temperature-records/:id | 删除指定 id 的体温记录 |

json样例：
```json
{
  "profileId": 1,
  "date": "2023-09-01 12:00",
  "temperture": 36.7
}
```

## 帖子

| 方法 | 路由 | 功能 |
| ---- | ---- | ---- |
| POST | /api/articles | 发布帖子 |
| GET | /api/articles?size=10&page=1&isBind=true&vaccineId=1 | 获取全部帖子，可选参数：size(每页大小，默认获取全部)、page(页码，默认为1)、isBind(是否绑定疫苗，不绑定则归为其他类型，默认获取全部)、vaccineId(疫苗id，不指定则获取全部) |
| GET | /api/articles/:id | 获取指定 id 的帖子 |
| GET | /api/articles/user/:userId | 获取指定 userId 的用户发布的所有帖子 |
| PUT | /api/articles/:id | 更新指定 id 的帖子 |
| DELETE | /api/articles/:id | 删除指定 id 的帖子 |

Post 时的json样例：
```json
{
   "title": "疫苗接种经历",
   "content": "今天去接种了新冠疫苗，感觉还不错",
   "userName": "张三",
   "userId": 1,
   "isBind": true,
   "vaccineId": 1
}
```

## 回复

| 方法 | 路由 | 功能 |
| ---- | ---- | ---- |
| POST | /api/replys | 发布回复 |
| GET | /api/replys?articleId=1 | 获取指定 articleId 的帖子的所有回复，如果不指定 articleId 则获取全部回复 |
| GET | /api/replys/:id | 获取指定 id 的回复 |
| PUT | /api/replys/:id | 更新指定 id 的回复 |
| DELETE | /api/replys/:id | 删除指定 id 的回复 |

Post 时的json样例：
```json
{
   "articleId": 1,
   "content": "我也是",
   "userName": "李四",
   "userId": 2
}
```

# 模型设计

通过以下数据表来支持后端的功能：

1. **用户表 (Users)**:

```go
// User 用户模型
// 查询关注的疫苗和文章时，使用 Preload 方法
// 增加和删除关注的疫苗和文章时，使用 Association 方法
type User struct {
	gorm.Model                  //gorm.Model 包含了 CreatedAt、UpdatedAt、DeletedAt（用于软删除）以及 ID 字段
	OpenID            string    `gorm:"unique" json:"openId"`
	UserName          string    `json:"userName"`
	Password          string    `json:"-"` // 存储哈希值，JSON中忽略 -> 使用微信API，不需要密码
	Email             string    `json:"email"`
	Phone             string    `json:"phone"`
	Avatar            string    `json:"avatar"`                                                      // 头像链接
	FollowingVaccines []Vaccine `gorm:"many2many:user_following_vaccines;" json:"followingVaccines"` // 用户关注的疫苗
	FollowingArticles []Article `gorm:"many2many:user_following_articles;" json:"followingArticles"` // 用户关注的文章
}
```


2. **身份表 (Profiles)**:

```go
// Profile 身份模型
type Profile struct {
	gorm.Model
	UserID       uint   `json:"userId"`
	FullName     string `json:"fullName"`
	Gender       string `json:"gender"`
	DateOfBirth  string `json:"dateOfBirth"`
	Relationship string `json:"relationship"`
}
```


3. **疫苗表 (Vaccines)**:

```go
// Vaccine 疫苗模型
type Vaccine struct {
	gorm.Model
	Name          string `json:"name"`
	Description   string `json:"description"`
	TargetDisease string `json:"targetDisease"`
	SideEffects   string `json:"sideEffects"`
	Precautions   string `json:"precautions"` // 接种前注意事项
	ValidPeriod   int    `json:"validPeriod"` // 有效期，单位为天
	Type          string `json:"type"`        // 疫苗类型，常规疫苗、特殊疫苗、其他
}
```

修改数据库初始疫苗信息 `pkg/db/vaxinfo.json`


4. **接种记录表 (VaccinationRecords)**:

```go
// VaccinationRecord 接种记录模型
// 对应一个Profile和一个Vaccine，记录接种类型、接种时间、接种地点、接种凭证、疫苗失效时间、备注，同时希望能看到疫苗的详细信息(名称、有效期...)
// 是否完成接种，未完成则为预约接种
// 是否提醒，提醒时间，用字符串存具体时间，例如"2021-07-01 12:00"
type VaccinationRecord struct {
	gorm.Model
	ProfileID           uint    `json:"profileId"`
	VaccineID           uint    `json:"vaccineId"`
	Vaccine             Vaccine `gorm:"foreignKey:VaccineID" json:"vaccine"`
	VaccinationDate     string  `json:"vaccinationDate"` // 注意用string与前端交互，例如"2021-07-01"
	Voucher             string  `json:"voucher"`         // 接种凭证，之后实现为图片链接
	VaccinationLocation string  `json:"vaccinationLocation"`
	VaccinationType     string  `json:"vaccinationType"`     // 接种类型，第一针、第二针、加强针
	NextVaccinationDate string  `json:"nextVaccinationDate"` // 疫苗失效时间
	Note                string  `json:"note"`

	IsCompleted bool   `json:"isCompleted"` // 是否完成接种，未完成则为预约接种
	Reminder    bool   `json:"reminder"`    // 是否提醒
	RemindTime  string `json:"remindTime"`  // 提醒时间，用字符串存具体时间，例如"2021-07-01 12:00"
}
```


5. **体温记录表 (TemperatureRecords)**:

```go
// TemperatureRecord 体温记录模型
type TemperatureRecord struct {
   gorm.Model
   ProfileID uint    `json:"profileId"`
   Date      string  `json:"date"` // 包含日期和时间，例如"2021-07-01 12:00"
   Temperature float32 `json:"temperature"`
}
```


6. **文章表 (Articles)**:

```go
// Article 文章模型，与疫苗绑定
type Article struct {
   gorm.Model
   Title     string `json:"title"`
   Content   string `json:"content"`
   UserName  string `json:"userName"`
   UserID    uint   `json:"userId"`
   IsBind    bool   `json:"isBind"` // 是否绑定疫苗，如果未绑定，则归为其他类型
   VaccineID uint   `json:"vaccineId"`
}
```


7. **回复表 (Replys)**:

```go
type Reply struct {
   gorm.Model
   ArticleID uint   `json:"articleId"`
   Content   string `json:"content"`
   UserName  string `json:"userName"`
   UserID    uint   `json:"userId"`
}
```


8. **消息提醒表 (Messages)**:

```go
// Message 消息模型
type Message struct {
	gorm.Model
	Content  string `json:"content"` // 消息内容，将不同字段拼接成字符串
	UserName string `json:"userName"`
	UserID   uint   `json:"userId"`
	SendTime string `json:"sendTime"` // 发送时间，注意用string与前端交互，例如"2021-07-01 12:00"
}
```

  **接种地点表 (VaccinationLocations)**:

- Name
- Address 
- ContactNumber
- OperatingHours
- PositionX
- PositionY
- OptionalVaccine 



## 遇到的问题

1. 每次更改后第一次启动app就连不上数据库？需要第2次才能连上

虽然 `depends_on` 确保了服务的启动顺序（即在启动 `app` 之前启动 `db`），但它并不保证 `db`（数据库）服务已经完全启动并准备好接受连接。

换句话说，当 `app` 服务开始启动时，MySQL 数据库可能还没完全初始化完成，这就会导致 `app` 在第一次尝试连接数据库时失败。

### 解决方案

1. **重试逻辑**：在 `app` 服务中添加数据库连接的重试逻辑。许多数据库客户端库提供了重试机制，或者您可以在应用代码中实现。
2. **等待脚本**：在 `app` 服务中使用一个等待脚本，确保在应用启动之前数据库已经准备好。这可以通过编写一个小的 shell 脚本来实现，该脚本在启动应用之前检查数据库连接。
3. **健康检查**：在 `docker-compose.yml` 中为 `db` 服务配置健康检查（healthcheck）。这样，Docker 将等待直到健康检查通过后才视为 `db` 服务已经准备好。

### 示例：等待脚本

这是一个简单的等待脚本示例，可以将它添加到 `app` 服务的 Dockerfile 中：

```bash
# wait-for-it.sh 或类似脚本
while !</dev/tcp/db/3306; do sleep 1; done;
```

然后，在启动应用之前执行这个脚本。

### 示例：Docker Compose 健康检查

在 `docker-compose.yml` 中为 MySQL 服务添加健康检查：

```yaml
services:
  db:
    image: mysql:8.1
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: ${DB_NAME}
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10
    # 其他配置...
```

## JWT

JSON Web Token（JWT）是一种开放标准（RFC 7519），用于在两个方之间安全地传输信息。在 Web 应用中，它通常用于身份验证和信息交换。JWT 是一个紧凑的、自包含的方式来安全地传输用户信息。

### JWT 的组成部分

JWT 主要包含三个部分，用点（`.`）分隔：

1. **头部（Header）**

   - 描述 JWT 的元数据，通常包含令牌的类型（`JWT`）和所使用的签名算法（如 `HS256`）。
   - 示例：`{"alg": "HS256", "typ": "JWT"}`
2. **有效载荷（Payload）**

   - 包含所要传递的数据。这些数据称为声明（Claims），包括注册声明（如用户ID，过期时间）和公共声明（如用户名，用户角色）。
   - 示例：`{"sub": "1234567890", "name": "John Doe", "admin": true}`
3. **签名（Signature）**

   - 用于验证消息的完整性和确保消息未被篡改。
   - 生成方式：将编码的头部和有效载荷连同一个密钥使用头部中指定的算法进行签名。

### JWT 鉴权流程

1. **用户登录**

   - 用户通过提供凭证（如用户名和密码）登录。
2. **服务器验证并生成 JWT**

   - 服务器验证用户凭证的有效性。如果验证通过，服务器将创建一个包含用户信息的 JWT。
   - 服务器对 JWT 进行签名，并将其发送回用户。
3. **客户端存储 JWT**

   - 客户端（通常是浏览器）接收 JWT 并将其存储在本地（如 localStorage）。
4. **客户端随请求发送 JWT**

   - 客户端在之后的每个请求的 `Authorization` 头中附带 JWT。
   - 示例：`Authorization: Bearer <token>`
5. **服务器验证 JWT**

   - 每当服务器收到一个请求，它会验证 JWT 的签名。
   - 如果签名有效，服务器将解析 JWT 中的有效载荷以识别和授权用户。

### 安全性和实践建议

- **保密性**: 服务器的签名密钥必须保密，只有服务器知道。
- **HTTPS**: 在生产环境中，始终通过 HTTPS 发送 JWT，以避免中间人攻击。
- **存储**: 不要在 JWT 中存储敏感信息，因为有效载荷可以被解码。
- **短期有效性**: 为 JWT 设置合理的过期时间，以减少被盗用的风险。

通过使用 JWT，我们可以实现无状态的身份验证，这意味着服务器不需要存储任何用户的登录信息，从而使应用更加易于扩展。同时，它也为客户端和服务器之间的通信提供了一种安全可靠的方式来验证和传输用户身份信息。
