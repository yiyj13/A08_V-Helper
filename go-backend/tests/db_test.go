package tests

import (
	"database/sql"
	"fmt"
	"log"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func TestDB(t *testing.T) {
	// 构建 DSN
	dsn := "root:password@tcp(127.0.0.1:3306)/vhelper?charset=utf8mb4&parseTime=True&loc=Local"

	// 连接到数据库
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// 测试数据库连接
	err = db.Ping()
	if err != nil {
		log.Fatal("Database connection error: ", err)
	}

	fmt.Println("Successfully connected to the database")
}
