import React, { Component } from 'react';
import { ROLE_PAGE_SIZE } from '../../../utils/constant';
import memoryUtils from '../../../utils/memoryUtils';
import storageUtils from '../../../utils/storageUtils';
import { formateData } from '../../../utils/dataUtils';
import { reqRoles, reqAddRole, reqUpdateRole } from '../../../api';
import AddForm from './add-form';
import UpdateForm from './update-form'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
//角色路由
class Role extends Component {

    state = {
        roles: [], //所有角色的列表
        role: {}, //选中的role
        isShowAdd: false,
        isShowUpdate: false,
    }

    constructor(props) {
        super(props);
        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                // width: '20%',
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                // width: '30%',
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateData
            },
            {
                // width: '30%',
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateData
            },
            {
                // width: '15%',
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ]
    }

    onRow = (role) => {
        return {
            onClick: event => { //点击行
                console.log(role);
                this.setState({
                    role
                })
            }
        }
    }

    //异步获取所有角色列表
    getRoles = async () => {
        const result = await reqRoles()
        // console.log(result);
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    };

    //添加角色
    addRole = () => {
        this.form.validateFields(async (err, values) => {
            // console.log(values);
            if (!err) {
                //隐藏确认框
                this.setState({
                    isShowAdd: false
                })
                //准备数据
                const { roleName } = values
                //清除输入数据
                this.form.resetFields()
                //发请求添加分类
                const result = await reqAddRole(roleName)
                if (result.status === 0) { //重新显示列表
                    message.success('添加角色成功')
                    // this.getRoles() //使用另一种方法重新显示
                    //新产生的角色
                    const role = result.data
                    //更新role状态
                    //const roles = this.state.roles  //react不建议

                    // const roles = [...this.state.roles]
                    // roles.push(role)
                    // this.setState({
                    //     roles
                    // })

                    //更新roles状态：基于原本状态
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))

                } else {
                    message.err('添加角色失败')
                }
            }
        })
    };

    //更新角色
    updateRole = async () => {
        this.setState({
            isShowUpdate: false
        })
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = memoryUtils.user.username
        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            //如果当前更新的是自己角色的权限，强制退出
            if (role.id === memoryUtils.user.role._id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                this.props.history.replace('./login')
                message.success('修改权限成功，请重新登录')
            } else {
                message.success('设置角色权限成功')
                this.getRoles()
                // this.setState({
                //     roles: [...this.state.roles]
                // })
            }
        } else {
            message.err('设置角色权限失败')
        }
    }

    componentWillMount() {
        this.initColumns()
    }
    componentDidMount() {
        this.getRoles()
    }


    render() {
        //读取状态数据
        const { roles, role, isShowAdd, isShowUpdate } = this.state
        //读取指定的分类
        // const role = this.role || {} //如果没有指定一个空对象

        const title = (
            <span>
                <Button type='primary' onClick={() => this.setState({ isShowAdd: true })} >创建角色</Button> &nbsp;&nbsp;
                <Button type='primary'
                    disabled={!role._id}
                    onClick={() => {
                        console.log(memoryUtils)
                        this.setState({ isShowUpdate: true })
                    }}
                >设置角色权限</Button>
            </span >
        )
        return (
            <div>
                <Card title={title}>
                    <Table
                        dataSource={roles}
                        columns={this.columns}
                        onRow={this.onRow}
                        bordered
                        rowKey='_id'
                        rowSelection={
                            {
                                type: 'radio',
                                selectedRowKeys: [role._id],
                                onSelect: (role) => { // 选择某个radio时回调
                                    this.setState({
                                        role
                                    })
                                }
                            }}
                        pagination={{
                            defaultPageSize: ROLE_PAGE_SIZE,
                            showQuickJumper: true,
                        }}
                    />
                </Card>

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => this.setState({
                        isShowAdd: false
                    })}
                >
                    <AddForm
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowUpdate}
                    onOk={this.updateRole}
                    onCancel={() => this.setState({
                        isShowUpdate: false
                    })}
                >
                    <UpdateForm
                        ref={this.auth}
                        role={role}
                        setForm={(form) => { this.form = form }}
                    />
                </Modal>
            </div>

        );
    }
}

export default Role;