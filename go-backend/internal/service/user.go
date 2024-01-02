package service

import (
	"v-helper/internal/model"

	"gorm.io/gorm"
)

type IUserService interface {
	CreateUser(user model.User) error
	GetAllUsers() ([]model.User, error)
	GetUserByID(id uint) (model.User, error)
	GetUserWithFollowings(id uint) (model.User, error)
	AddFollowingVaccine(userID uint, vaccineID uint) error
	RemoveFollowingVaccine(userID uint, vaccineID uint) error
	AddFollowingArticle(userID uint, articleID uint) error
	RemoveFollowingArticle(userID uint, articleID uint) error
	UpdateUserByID(user model.User) error
	DeleteUserByID(id uint) error
	GetPublicUserByID(id uint) (model.User, error)
	GetUserByOpenID(openID string) (model.User, error)
}

type UserService struct {
	db *gorm.DB
}

func NewUserService(db *gorm.DB) *UserService {
	return &UserService{db: db}
}

// CreateUser 创建用户
func (s *UserService) CreateUser(user model.User) error {
	return s.db.Create(&user).Error
}

// GetAllUsers 获取所有用户
func (s *UserService) GetAllUsers() ([]model.User, error) {
	var users []model.User
	if err := s.db.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

// GetUserByID 根据id获取用户
func (s *UserService) GetUserByID(id uint) (model.User, error) {
	var user model.User
	if err := s.db.First(&user, id).Error; err != nil {
		return user, err
	}
	return user, nil
}

// GetUserWithFollowings 根据id获取用户，包括关注的疫苗和文章
func (s *UserService) GetUserWithFollowings(id uint) (model.User, error) {
	var user model.User
	if err := s.db.Preload("FollowingVaccines").Preload("FollowingArticles").First(&user, id).Error; err != nil {
		return user, err
	}
	return user, nil
}

// AddFollowingVaccine 添加关注的疫苗
func (s *UserService) AddFollowingVaccine(userID uint, vaccineID uint) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}
	var vaccine model.Vaccine
	if err := s.db.First(&vaccine, vaccineID).Error; err != nil {
		return err
	}
	return s.db.Model(&user).Association("FollowingVaccines").Append(&vaccine)
}

// RemoveFollowingVaccine 取消关注的疫苗
func (s *UserService) RemoveFollowingVaccine(userID uint, vaccineID uint) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}
	var vaccine model.Vaccine
	if err := s.db.First(&vaccine, vaccineID).Error; err != nil {
		return err
	}
	return s.db.Model(&user).Association("FollowingVaccines").Delete(&vaccine)
}

// AddFollowingArticle 添加关注的文章
func (s *UserService) AddFollowingArticle(userID uint, articleID uint) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}
	var article model.Article
	if err := s.db.First(&article, articleID).Error; err != nil {
		return err
	}
	return s.db.Model(&user).Association("FollowingArticles").Append(&article)
}

// RemoveFollowingArticle 取消关注的文章
func (s *UserService) RemoveFollowingArticle(userID uint, articleID uint) error {
	var user model.User
	if err := s.db.First(&user, userID).Error; err != nil {
		return err
	}
	var article model.Article
	if err := s.db.First(&article, articleID).Error; err != nil {
		return err
	}
	return s.db.Model(&user).Association("FollowingArticles").Delete(&article)
}

// UpdateUserByID 根据id更新用户
func (s *UserService) UpdateUserByID(user model.User) error {
	return s.db.Model(&user).Where("id = ?", user.ID).Updates(user).Error
}

// DeleteUserByID 根据id删除用户
func (s *UserService) DeleteUserByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.User{}).Error
}

// 根据id获取UserName和Avatar
func (s *UserService) GetPublicUserByID(id uint) (model.User, error) {
	var user model.User
	if err := s.db.Select("user_name", "avatar").First(&user, id).Error; err != nil {
		return user, err
	}
	return user, nil
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
