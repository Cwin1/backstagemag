import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Icon, } from 'antd';

import logo from '../../assets/images/logo.png';
import './index.less';
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils';

const { SubMenu } = Menu;
/*
左侧导航组件
*/

class LeftNav extends Component {

    //判断当前登录用户是否对item有权限
    hasAuth = (item) => {
        const { path, isPublic } = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username

        //1.如果当前用户是admin
        //2.如果当前item是公开的
        //3.当前用户有此item的权限：key有没有在menus中

        if (username === 'admin' || isPublic || menus.indexOf(path) !== -1) {
            return true
        } else if (item.children) { //如果当前用户有此item的某个子item的权限
            return !!item.children.find(child => menus.indexOf(child.path) !== -1)
        }
        return false
    }


    /*
    根据menu的数据组生成对应的标签数组
    使用reduce() + 递归调用
    */
    getMenuNodes = (menuList) => {
        //得到当前请求的路由路径 
        const path = this.props.location.pathname
        return menuList.reduce((pre, item) => {
            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        //向pret添加MenuItem
                        <Menu.Item key={item.path} className='left-menu'>
                            <Link to={item.path}>
                                <Icon type={item.icon} className='item-title'/>
                                <span className='item-title'>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {
                    //查找一个与当前请求路径匹配的子item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.path) === 0)
                    // console.log(cItem)
                    //如果存在.说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.path
                    }

                    pre.push((
                        //向pret添加SubMenu
                        < SubMenu
                            key={item.path}
                            title={
                                < span >
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {/* {递归调用} */}
                            {this.getMenuNodes(item.children)}
                        </SubMenu >
                    ))
                }
            }
            return pre;
        }, [])
    };

    //在第一次render()之前执行一次
    // 为第一个render()准备数据（必须同步）
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)

    }
    render() {
        // debugger
        //得到当前请求的路由路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {  //当前请求的是商品或其子路由界面
            path = '/product'
        }
        //得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='logo' />
                    <h1>后台管理</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>

        );
    }
}
/*
withRouter高阶组件：
包装非路由组件返回一个新的组件
新的组件向非路由组件传递三个属性：history/location/match
*/
export default withRouter(LeftNav);