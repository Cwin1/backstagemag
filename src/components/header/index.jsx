import React, { Component } from 'react';
import './index.less';
import { formateData } from '../../utils/dataUtils';
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { reqWeather } from '../../api';
import { withRouter } from 'react-router-dom';
import { menuList } from '../../config/menuConfig';
import { Link } from 'react-router-dom';
import { Modal, Menu, Dropdown, Icon } from 'antd';
import LinkButton from '../link-button';


/*
头部导航组件
*/

class Header extends Component {

    state = {
        currentTime: formateData(Date.now()),//当前时间字符串
        dayPictureUrl: '',//天气图片文本
        weather: '' //天气的文本
    }


    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateData(Date.now())
            this.setState({ currentTime })
        }, 1000);
    };

    getWeather = async () => {
        //调用接口请求异步获取数据
        const { dayPictureUrl, weather } = await reqWeather('珠海')
        //更新
        this.setState({ dayPictureUrl, weather })
    };

    getTitle = () => {
        const path = this.props.location.pathname
        let title
        menuList.forEach(item => {
            if (item.path === path) {  //如果当前item对象的key与path一样，item的title就是需要显示的title
                title = item.title
            } else if (item.children) {
                //在所有子item中查找匹配的
                const cItem = item.children.find(cItem => path.indexOf(cItem.path) === 0)
                //如果有值才说明有匹配
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    };

    getUser = () => {
        const username = memoryUtils.user.username
        const menu = (
            <Menu>
                <Menu.Item>
                    <div style={{ cursor: 'pointer' }}  onClick={this.logout}>
                        <Icon type='logout' className='icon-logout'/>
                        退出
                    </div>
                </Menu.Item>
            </Menu>
        );
        if (username) {
            return (
                <Dropdown className='header-dropdown' overlay={menu} trigger={['click']} placement="bottomRight" >
                    <div style={{ cursor: 'pointer' }}>
                        <Icon type='user' className='icon-user' />
                        {username}
                        <Icon type="down" className='icon-down' />
                    </div>
                </Dropdown>
            )
        } else {
            return <Link to='/login'><LinkButton>请登录</LinkButton></Link>
        }
    };

    logout = () => {
        Modal.confirm({
            title: '确认退出吗？',
            onOk: () => {
                // console.log('OK');
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}

                //跳转到login
                this.props.history.replace('/login')
            }
        })
    };

    /*第一次render()之后执行一次
    一般在此执行异步操作：发ajax请求/启动定时器
    */
    componentDidMount() {
        this.getTime();
        this.getWeather();
    };

    /*
        当前组件卸载之前调用
    */
    componentWillUnmount() {
        //清除定时器
        clearInterval(this.intervalId)
    };

    render() {
        const { currentTime, dayPictureUrl, weather } = this.state
        // const username = memoryUtils.user.username
        const title = this.getTitle()

        return (
            <div className='header'>
                <div className='header-top'>
                    {this.getUser()}
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                        <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl} alt='/' />
                        <span>{weather}</span>
                    </div>

                </div>
            </div>
        );
    }
}

export default withRouter(Header);