# TODO

- [X] 设置 Go 项目，创建测试路由
- [X] 编写简单数据库模型和接口
- [X] 配置文件，数据库连接
- [X] 通过docker-compose部署测试
- [ ] 完善数据库模型
  - [ ] 在model中加入新模型时，需要在init中进行迁移
  - [ ] 在service中实现对模型的增删改查
  - [ ] 在handler中实现API接口，并注册路由
- [ ] 用户注册登录，JWT验证

需要以下数据表来支持后端的功能：

1. **用户表 (Users)**:

   - UserID (主键)
   - UserName
   - Password (存储哈希值)
   - Email
   - Phone
   - UserID (主键)
   - UserName
   - Password (存储哈希值)
   - Email
   - Phone
   - CreatedAt
   - UpdatedAt
2. **身份表 (Profiles)**:

   - ProfileID (主键)
   - UserID (外键)
   - FullName
   - Gender
   - DateOfBirth
   - Relationship (例如本人、子女等)
3. **疫苗表 (Vaccines)**:

   - VaccineID (主键)
   - Name
   - Description
   - TargetDisease
   - SideEffects
   - Precautions

   修改数据库初始疫苗信息 `pkg/db/vaxinfo.json`

4. **接种记录表 (VaccinationRecords)**:

   - RecordID (主键)
   - ProfileID (外键)
   - VaccineID (外键)
   - VaccinationDate
   - VaccinationLocation
   - VaccinationDoctor
   - NextVaccinationDate
   - CreatedAt
   - UpdatedAt
5. **医生表 (Doctors)**:

   - DoctorID (主键)
   - FullName
   - Specialty
   - Hospital
   - ContactInfo
6. **预约表 (Appointments)**:

   - AppointmentID (主键)
   - ProfileID (外键)
   - DoctorID (外键)
   - VaccineID (外键)
   - AppointmentDate
   - AppointmentLocation
   - CreatedAt
   - UpdatedAt
7. **体温记录表 (TemperatureRecords)**:

   - RecordID (主键)
   - ProfileID (外键)
   - Date
   - Temperature
8. **社区帖子表 (CommunityPosts)**:

   ```go
   type Post struct {
      gorm.Model
      Title       string `json:"title"`
      Content     string `json:"content"`
      CreatorName string `json:"creatorName"` // 创建者名称
   }
   ```

   | 方法 | 路由 | 功能 |
   | ---- | ---- | ---- |
   |GET   |/articles   |获取全部帖子   |
   |POST   |/articles   |发布帖子      |
   |GET   |/articles/:id   |获取指定 id 的帖子      |
   |PUT   |/articles/:id   |更新指定 id 的帖子      |
   |DELETE |/articles/:id   |删除指定 id 的帖子      |

10. **社区回复表 (CommunityReplies)**:

    - ReplyID (主键)
    - PostID (外键)
    - UserID (外键)
    - Content
    - CreatedAt
11. **接种地点表 (VaccinationLocations)**:

    - LocationID (主键)
    - Name
    - Address
    - ContactNumber
    - OperatingHours
12. 收藏表

    - VaccineID（主键）
    - Name

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
