const devURL = 'http://localhost:9527'
const prodURL = 'http://101.43.194.58'
export const BASE_URL = process.env.NODE_ENV === 'development' ? devURL : prodURL
