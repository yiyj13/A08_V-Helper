package service

import (
	"v-helper/internal/model"
	"v-helper/pkg/utils"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

func (s *UserService) CreateUser(user model.User) error {
	return s.db.Create(&user).Error
}

func (s *UserService) GetAllUsers() ([]model.User, error) {
	var users []model.User
	if err := s.db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *UserService) GetUserByID(id uint) (model.User, error) {
	var user model.User
	if err := s.db.First(&user, id).Error; err != nil {
		return user, err
	}
	return user, nil
}

func (s *UserService) UpdateUserByID(id uint, user model.User) error {
	return s.db.Model(&user).Where("id = ?", id).Updates(user).Error
}

func (s *UserService) DeleteUserByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.User{}).Error
}

// GetUserByOpenID 根据 OpenID 获取用户
func (s *UserService) GetUserByOpenID(openID string) (model.User, error) {
	var user model.User
	// 尝试根据 OpenID 获取用户
	if err := s.db.Where("open_id = ?", openID).First(&user).Error; err != nil {
		// 如果没有找到对应的用户，创建一个新用户
		if err == gorm.ErrRecordNotFound {
			user.OpenID = openID
			if err := s.db.Create(&user).Error; err != nil {
				return user, err
			}
			return user, nil
		}
	}
	return user, nil
}

// 以下暂时不用
// Register 新用户注册
func (s *UserService) Register(user model.User) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)
	return s.db.Create(&user).Error
}

// Login 用户登录
func (s *UserService) Login(email, password string) (string, error) {
	var user model.User
	if err := s.db.Where("email = ?", email).First(&user).Error; err != nil {
		return "", err
	}

	// 检查密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		// 密码不匹配
		return "", err
	}

	// 生成 JWT
	token, err := utils.GenerateJWT(user)
	if err != nil {
		return "", err
	}

	return token, nil
}
