import React, { Component } from 'react';
import memoryUtils from '../../utils/memoryUtils';
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';
import LeftNav from '../../components/left-nav';
import Header from '../../components/header';
import Home from './home/home';
import Category from './category/category';
import Product from './product/product';
import Role from './role/role';
import User from './user/user';
import Bar from './charts/bar';
import Line from './charts/line';
import Pie from './charts/pie';
import Order from './order/order';


const { Footer, Sider, Content } = Layout;
class Admin extends Component {
    render() {
        const user = memoryUtils.user
        //如果内存没有存储user，则当前没有登录
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{ minHeight: '100%' }}>
                <Sider
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                    }}>
                    <LeftNav />
                </Sider>
                <Layout style={{ marginLeft: 200 }}>
                    <Header />
                    <Content style={{ background: 'white', margin: 20, overflow: 'initial' }}>
                        <Switch>
                            <Route path='/home' component={Home}></Route>
                            <Route path='/category' component={Category}></Route>
                            <Route path='/product' component={Product}></Route>
                            <Route path='/role' component={Role}></Route>
                            <Route path='/user' component={User}></Route>
                            <Route path='/order' component={Order}></Route>
                            <Route path='/charts/bar' component={Bar}></Route>
                            <Route path='/charts/line' component={Line}></Route>
                            <Route path='/charts/pie' component={Pie}></Route>
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: "center" }}>欢迎使用后台管理系统</Footer>
                </Layout>
            </Layout>

        );
    }
}

export default Admin;