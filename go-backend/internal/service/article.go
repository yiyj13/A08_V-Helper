package service

import (
	"v-helper/internal/model"
	"v-helper/pkg/utils"
	// "gorm.io/gorm"
)

type ArticleService struct {
	db utils.InterfaceDB
}

func NewArticleService(db utils.InterfaceDB) *ArticleService {
	return &ArticleService{db: db}
}

func (s *ArticleService) CreateArticle(article model.Article) error {
	return s.db.Create(&article).Error
}

func (s *ArticleService) GetAllArticles() ([]model.Article, error) {
	var articles []model.Article
	if err := s.db.Find(&articles).Error; err != nil {
		return nil, err
	}
	return articles, nil
}

func (s *ArticleService) GetArticleByID(id uint) (model.Article, error) {
	var article model.Article
	if err := s.db.First(&article, id).Error; err != nil {
		return article, err
	}
	return article, nil
}

func (s *ArticleService) GetArticlesByUserID(userID uint) ([]model.Article, error) {
	var articles []model.Article
	if err := s.db.Where("user_id = ?", userID).Find(&articles).Error; err != nil {
		return nil, err
	}
	return articles, nil
}

// 根据疫苗 ID 获取文章
func (s *ArticleService) GetArticlesByVaccineID(vaccineID uint) ([]model.Article, error) {
	var articles []model.Article
	if err := s.db.Where("vaccine_id = ?", vaccineID).Find(&articles).Error; err != nil {
		return nil, err
	}
	return articles, nil
}

// 查询isBind为false的文章，即未绑定疫苗的文章
func (s *ArticleService) GetUnbindArticles() ([]model.Article, error) {
	var articles []model.Article
	if err := s.db.Where("is_bind = ?", false).Find(&articles).Error; err != nil {
		return nil, err
	}
	return articles, nil
}

func (s *ArticleService) UpdateArticleByID(id uint, article model.Article) error {
	return s.db.Model(&article).Where("id = ?", id).Updates(article).Error
}

func (s *ArticleService) DeleteArticleByID(id uint) error {
	return s.db.Where("id = ?", id).Delete(&model.Article{}).Error
}
