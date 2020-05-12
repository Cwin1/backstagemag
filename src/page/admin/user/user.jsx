import React, { Component } from 'react';
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../../api';
import LinkButton from '../../../components/link-button';
import AddForm from './add-form';
import { formateData } from '../../../utils/dataUtils';

import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { ROLE_PAGE_SIZE } from '../../../utils/constant';

const { confirm } = Modal;

class User extends Component {
    //用户路由

    state = {
        users: [],
        roles: [],
        isShowAdd: false
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateData
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.showDeleteConfirm(user)}>删除</LinkButton>
                    </span>
                )
            }
        ]
    }

    //根据role数组，生成包含所有角色名的对象(属性名用角色id值)
    initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    //获取所有用户列表
    getUsers = async () => {
        const result = await reqUsers()
        console.log(result);
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    //显示删除用户框
    showDeleteConfirm = (user) => {
        console.log(user);
        confirm({
            title: `确认删除${user.username}吗?`,
            okText: '是',
            okType: 'primary',
            cancelText: '否',
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                }
            },
        });
    };

    //显示修改确认框
    showUpdate = (user) => {
        this.user = user 
        this.setState({ isShowAdd: true })
    }

    //显示添加确认框
    showAdd = () => {
        this.user = null   //清除前面保存的user
        this.setState({ isShowAdd: true })
    }

    //添加或更新用户
    addOrUpdateUser = () => {
        this.form.validateFields(async (err, values) => {
            console.log(values);
            //清除输入数据
            this.form.resetFields()
            if (!err) {
                this.setState({
                    isShowAdd: false
                })
                //准备数据
                const user = values
                if (this.user) { //更新
                    user._id = this.user._id
                }
                //发请求添加用户
                const result = await reqAddOrUpdateUser(user)
                console.log(result);
                if (result.status === 0) {
                    message.success(`${this.user ? '修改' : '添加'}用户成功`)
                    this.getUsers()
                }
            }
        })

    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }

    render() {

        const title = (
            <span>
                <Button type='primary' onClick={this.showAdd}>创建用户</Button> &nbsp;&nbsp;
            </span>
        )
        const { users, isShowAdd } = this.state
        const user = this.user  || {}
        return (
            <div>
                <Card title={title}>
                    <Table
                        dataSource={users}
                        columns={this.columns}
                        // onRow={}
                        rowKey='_id'
                        bordered
                        pagination={{
                            defaultPageSize: ROLE_PAGE_SIZE,
                            // showQuickJumper: true,
                        }}
                    />
                </Card>

                <Modal
                    title={user ? '修改用户' : '添加用户'}
                    visible={isShowAdd}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        //清除输入数据
                        this.form.resetFields()
                        this.setState({
                            isShowAdd: false
                        })
                    }}
                >
                    <AddForm
                        roles={this.state.roles}
                        user={user}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </div >
        );
    }
}

export default User;