package handler

import (
	"log"
	"net/http"
	"strconv"
	"v-helper/internal/model"
	"v-helper/internal/service"

	"github.com/gin-gonic/gin"
)

type ArticleHandler struct {
	articleService *service.ArticleService
}

func NewArticleHandler(articleService *service.ArticleService) *ArticleHandler {
	return &ArticleHandler{articleService: articleService}
}

func (h *ArticleHandler) HandleCreateArticle(c *gin.Context) {
	var article model.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.articleService.CreateArticle(article); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("article created successfully: ", article)
	c.JSON(http.StatusOK, article)
}

func (h *ArticleHandler) HandleGetAllArticles(c *gin.Context) {
	// 可能需要分页，page指定页数，size指定每页大小
	var page uint64 = 1
	var size uint64 = 0
	var err error
	p := c.Query("page")
	s := c.Query("size")
	if p != "" {
		page, err = strconv.ParseUint(p, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page number"})
			return
		}
	}
	if s != "" {
		size, err = strconv.ParseUint(s, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page size"})
			return
		}
	}

	var articles []model.Article

	isBind := c.Query("isBind")
	vaccineID := c.Query("vaccineID")
	if isBind != "" && isBind == "false" {
		articles, err = h.articleService.GetUnbindArticles()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else if vaccineID != "" {
		vaccineIDUint, err := strconv.ParseUint(vaccineID, 10, 32)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid vaccine ID"})
			return
		}
		articles, err = h.articleService.GetArticlesByVaccineID(uint(vaccineIDUint))
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		articles, err = h.articleService.GetAllArticles()
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "error fetching articles"})
			return
		}
	}
	// log.Println("articles fetched successfully: ", articles)

	// 分页
	if size != 0 {
		start := (page - 1) * size
		end := page * size
		if start > uint64(len(articles)) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid page number"})
			return
		}
		if end > uint64(len(articles)) {
			end = uint64(len(articles))
		}
		log.Println("pagination: ", start, end)
		articles = articles[start:end]
	}

	c.JSON(http.StatusOK, articles)
}

func (h *ArticleHandler) HandleGetArticleByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	article, err := h.articleService.GetArticleByID(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, article)
}

func (h *ArticleHandler) HandleGetArticlesByUserID(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userID"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user ID"})
		return
	}
	articles, err := h.articleService.GetArticlesByUserID(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, articles)
}

func (h *ArticleHandler) HandleUpdateArticleByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var article model.Article
	if err := c.ShouldBindJSON(&article); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.articleService.UpdateArticleByID(uint(id), article); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("article updated successfully: ", article)
	c.JSON(http.StatusOK, article)
}

func (h *ArticleHandler) HandleDeleteArticleByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.articleService.DeleteArticleByID(uint(id)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	log.Println("article deleted successfully: ", id)
	c.JSON(http.StatusOK, gin.H{"message": "article deleted successfully"})
}
