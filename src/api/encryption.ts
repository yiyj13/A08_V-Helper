import { enc, AES, mode, pad } from 'crypto-js'
import { SECRET_KEY } from './config'

const key = enc.Utf8.parse(SECRET_KEY)
const iv = enc.Utf8.parse(SECRET_KEY.substring(0, 16))

const encryptApiNames = [
  // prefix of protected api
  '/api/profiles',
  '/api/vaccination-records',
]

export function checkEncryptionNecessity(url: string): boolean {
  return encryptApiNames.some((apiName) => url.includes(apiName))
}

export function decrypt(ciphertext: string): string {
  // server returns ciphertext in Hex
  const decrypted = AES.decrypt(ciphertext, key, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  })
  return enc.Utf8.stringify(decrypted)
}

export function encrypt(plaintext: string): string {
  const encrypted = AES.encrypt(plaintext, key, {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  })
  return encrypted.toString()
}
