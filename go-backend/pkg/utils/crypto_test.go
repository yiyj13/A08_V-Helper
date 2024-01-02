package utils

import (
	"fmt"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestEncryptionAndDecryption(t *testing.T) {
	cryptoKey = []byte("12345678901234567890123456789012")
	originalText := "Hello, World!"

	encryptedText, err := Encrypt(originalText)
	assert.Nil(t, err, "Encryption should not produce an error")
	assert.NotEqual(t, originalText, encryptedText, "Encrypted text should not be the same as the original text")

	decryptedText, err := Decrypt(encryptedText)
	assert.Nil(t, err, "Decryption should not produce an error")
	assert.Equal(t, originalText, decryptedText, "Decrypted text should match the original text")
	var _ = err
	fmt.Println("originalText:", originalText)
	fmt.Println("encryptedText:", encryptedText)
	fmt.Println("decryptedText:", decryptedText)
}
