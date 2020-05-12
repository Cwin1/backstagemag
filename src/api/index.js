import ajax from './ajax';
import jsonp from 'jsonp';
import { message } from 'antd';

/*
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
*/

// const api = 'https://www.fastmock.site/mock/9b8dacc0336698c5c95c481b35ab9923/first'
const api = ''

//登录
export const reqLogin = (username, password) => ajax(api + '/login', { username, password }, 'POST')

//获取所有用户列表
export const reqUsers = () => ajax(api + '/manage/user/list')

//添加或更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//更新用户
export const reqUpdateUser = (user) => ajax('/manage/user/update', user, 'POST')

//删除用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')

//获取一级/二级分类的列表
export const reqCategory = (parentId) => ajax(api + '/manage/category/list', { parentId })

//添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(api + '/manage/category/add', { parentId, categoryName }, 'POST')

//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(api + '/manage/category/update', { categoryId, categoryName }, 'POST')

//获取商品分类列表
export const reqProducts = (pageNum, pageSize) => ajax(api + '/manage/product/list', { pageNum, pageSize })

//搜索产品分页列表(根据商品名称/商品描述)
//searchType:搜索的类型，productName/productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(api + '/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName
})

//根据ID获取分类
export const reqCategoryId = (categoryId) => ajax(api + '/manage/category/info', { categoryId })

//更新商品状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(api + '/manage/product/updateStatus', { productId, status }, 'POST')

//删除图片
export const reqDeleteImg = (name) => ajax(api + '/manage/img/delete', { name }, 'POST')

//更新添加产品
// export const reqAddUpdateProduct = (product) => ajax(api + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
export const reqAddUpdateProduct = (product) => ajax(api + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

//获取所有角色列表
export const reqRoles = () => ajax(api + '/manage/role/list')

//添加角色
export const reqAddRole = (roleName) => ajax(api + '/manage/role/add', { roleName }, 'POST')

//更新角色
export const reqUpdateRole = (role) => ajax(api + '/manage/role/update', role, 'POST')






// jsonp请求的接口请求函数


// 天气
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=qaCkk2AtN0ysQNQCpwKelPm6LrKY3A1D`
        jsonp(url, {}, (err, data) => {
            // console.log(err,data)
            //去除需要数据
            if (!err || data.status === 'success') {
                //请求成功 
                // console.log(data);
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]
                resolve({ dayPictureUrl, weather })
            } else {
                //请求失败
                message.error('获取天气信息失败')
            }
        })
    })
}
reqWeather('珠海')
