package utils

import (
	"bytes"
	"crypto/aes"
	"crypto/cipher"
	"encoding/base64"
	"os"
)

var cryptoKey = []byte(os.Getenv("CRYPTO_KEY"))

// Encrypt 加密
func Encrypt(plaintext string) (string, error) {
	block, err := aes.NewCipher(cryptoKey)
	if err != nil {
		return "", err
	}

	plaintextBytes := PKCS7Padding([]byte(plaintext), block.BlockSize())
	ciphertext := make([]byte, len(plaintextBytes))
	mode := cipher.NewCBCEncrypter(block, cryptoKey[:block.BlockSize()])
	mode.CryptBlocks(ciphertext, plaintextBytes)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// PKCS7Padding 填充
func PKCS7Padding(ciphertext []byte, blockSize int) []byte {
	padding := blockSize - len(ciphertext)%blockSize
	padtext := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(ciphertext, padtext...)
}

// Decrypt 解密
func Decrypt(ciphertext string) (string, error) {
	block, err := aes.NewCipher(cryptoKey)
	if err != nil {
		return "", err
	}

	decodedCiphertext, err := base64.StdEncoding.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	plaintext := make([]byte, len(decodedCiphertext))
	mode := cipher.NewCBCDecrypter(block, cryptoKey[:block.BlockSize()])
	mode.CryptBlocks(plaintext, decodedCiphertext)

	plaintext = PKCS7Unpadding(plaintext)
	return string(plaintext), nil
}

// PKCS7Unpadding 反填充
func PKCS7Unpadding(plaintext []byte) []byte {
	length := len(plaintext)
	unpadding := int(plaintext[length-1])
	return plaintext[:(length - unpadding)]
}
