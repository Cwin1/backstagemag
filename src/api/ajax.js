import { message } from 'antd'

/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值的promise对象
1.优化:统一处理请求异常
在外层包一个自己创建的promise对象
在请求出错时，不去reject(error)，而是提示异常信息
*/

import axios from 'axios';

export default function ajax(url, data = {}, type = 'GET') {
    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if (type === 'GET') {
            promise = axios.get(url, { //配置对象
                params: data //指定请求参数
            })
        } else {
            promise = axios.post(url, data)
        }
        promise.then(response => {
            //2.如果成功了，调用resolve(value)
            resolve(response.data)
        }).catch(error => {
            //3.如果失败了，不调用reject(reason),而是提示异常信息
            message.error('请求出错:' + error.message)
        })
    })
}



