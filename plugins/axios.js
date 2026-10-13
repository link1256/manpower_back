import axios from 'axios'

export default axios.create({
  proxy: true,
  crossDomain: true,
  withCredentials: true,
  baseURL: process.env.apiUrl
})
