import axios from 'axios'

let instance
if (process.env.NODE_ENV === 'development') {
  instance = new axios.create({
    baseURL: 'http://localhost:5000/',
  })
} else {
  instance = new axios.create({
    baseURL: 'https://api.vosh.club/',
  })
}

export default instance
