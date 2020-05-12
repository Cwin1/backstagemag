import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input,
    Select,

} from 'antd';

//添加角色的form组件

const Item = Form.Item
const Option = Select.Option


class AddForm extends React.PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        roles: PropTypes.array.isRequired,
        user: PropTypes.object
    }



    componentWillMount() {
        //将form对象通过serForm()方法传递给父组件
        this.props.setForm(this.props.form)
    };


    render() {
        const { getFieldDecorator } = this.props.form;
        const { roles } = this.props
        const user = this.props.user

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }

        return (
            <Form {...formItemLayout}>
                <Item label='用户名'>
                    {getFieldDecorator('username', {
                        initialValue: user.username,
                        rules: [
                            { required: true, whitespace: true, message: '用户名称必须输入' },
                        ]
                    })(
                        <Input placeholder='请输入用户名称' />
                    )}
                </Item>

                {
                    user._id ? null : (
                        <Item label='密码'>
                            {getFieldDecorator('password', {
                                initialValue: user.password,
                                rules: [
                                    { required: true, whitespace: true, message: '必须输入密码' },
                                ]
                            })(
                                <Input type='password' placeholder='请输入密码' />
                            )}
                        </Item>
                    )
                }


                <Item label='手机号'>
                    {getFieldDecorator('phone', {
                        initialValue: user.phone,
                    })(
                        <Input placeholder='请输入手机号码' />
                    )}
                </Item>

                <Item label='邮箱'>
                    {getFieldDecorator('email', {
                        initialValue: user.email,
                    })(
                        <Input placeholder='请输入邮箱' />
                    )}
                </Item>

                <Item label='角色'>
                    {getFieldDecorator('role_id', {
                        initialValue: user.role_id,
                    })(
                        <Select>
                            {
                                roles.map((role) => {
                                    return <Option key={role._id} value={role._id}>{role.name}</Option>
                                })
                            }
                        </Select>
                    )}
                </Item>
            </Form>
        );
    }
}


export default Form.create()(AddForm);
