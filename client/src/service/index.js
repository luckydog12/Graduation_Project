import axios from 'axios'
import store from '../store'

const req = axios.create({
    // baseURL: 'http://127.0.0.1:8081/',
    // timeout: 10000
})
//拦截器
const token = store.state.token
req.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${token}`  //必须加上Bearer
    return config
})
req.interceptors.response.use(res => {
    return res
}), function (error) {
    console.log(error)
    return Promise.reject(error)
}

export default req