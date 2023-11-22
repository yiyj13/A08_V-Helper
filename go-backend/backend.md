# TODO

- [x] 设置 Go 项目，创建测试路由
- [x] 编写简单数据库模型和接口
- [x] 配置文件，数据库连接
- [x] 通过docker-compose部署测试
- [ ] 完善数据库模型
- [ ] 用户注册登录，JWT验证


需要以下数据表来支持后端的功能：

1. **用户表 (Users)**:
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
    - PostID (主键)
    - UserID (外键)
    - Title
    - Content
    - CreatedAt
    - UpdatedAt

9. **社区回复表 (CommunityReplies)**:
    - ReplyID (主键)
    - PostID (外键)
    - UserID (外键)
    - Content
    - CreatedAt

10. **接种地点表 (VaccinationLocations)**:
    - LocationID (主键)
    - Name
    - Address
    - ContactNumber
    - OperatingHours

以上表结构设计是基于项目的需求和通常的数据库设计实践。每个表都包含了必要的字段来支持相关的功能，并通过外键关联来保持数据的完整性和准确性。同时，`CreatedAt`和`UpdatedAt`字段可以帮助我们跟踪数据的变更历史。
