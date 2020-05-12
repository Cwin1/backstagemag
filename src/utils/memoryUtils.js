import storageUtils from './storageUtils'

/*
用来在内存保存一些数据的工具模块
*/

//初始时取一次并保存为user
const user = storageUtils.getUser()
export default {
    user, //保存当前登录的user，初始值为local中读取的user 
    product: {}
}
