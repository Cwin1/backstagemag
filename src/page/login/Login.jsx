import React, { Component } from 'react';
import './login.less';
import { Form, Icon, Input, Button, message } from 'antd';
import { reqLogin } from '../../api';
import logo from '../../assets/images/logo.png'
import memoryUtils from '../../utils/memoryUtils';
import storageUtils from '../../utils/storageUtils';
import { Redirect } from 'react-router-dom'

class Login extends Component {

  handleSubmit = (event) => {
    event.preventDefault();

    //对所有表单字段进行校验
    reqLogin()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values
        const response = await reqLogin(username, password)
        console.log('请求成功', response)

        if (response.status === 0) {
          //登录成功
          message.success('登录成功')
          // 保存user
          const user = response.data
          memoryUtils.user = user       //保存到内存中
          storageUtils.saveUser(user)         //保存到local中

          //跳转到管理界面(不需要回退到登录页面用replace，需要回到登录页面用push)
          this.props.history.replace('/')
        } else {
          //登录失败
          message.error(response.msg)
        }

      } else {
        console.log('校验失败');
      }
      // if (!err) {
      //   console.log('提交登录的ajax的登录请求', values);
      //   const { username, password } = values
      //   reqLogin(username, password).then(response => {
      //     // console.log('成功了', response.data)

      //     //提示登录成功
      //     message.success('登录成功')

      //     //保存user
      //     const user = response.data.data[0]
      //     // console.log(user)
      //     memoryUtils.user = user       //保存到内存中
      //     storageUtils.saveUser(user)         //保存到local中
      //     //跳转到管理界面(不需要回退到登录页面用replace，需要回到登录页面用push)
      //     this.props.history.replace('/')
      //   }).catch(error => {
      //     console.log('失败', error)
      //   })

      // } else {
      //   console.log('校验失败');

      // }
    });
  }

  validatorPwd = (rule, value, callback) => {
    if (!value) {
      callback('请输入密码')
    } else if (value.length < 4) {
      callback('密码长度不能小于4')
    } else if (value.length > 12) {
      callback('密码长度不能大于12')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('密码必须是英文、数字和下划线组成')
    } else {
      callback();
    }
  }

  render() {

    // 如果用户已经登录，自动跳转到管理界面
    const user = memoryUtils.user
    if (user._id) {
      return <Redirect to='/' />
    }

    //得到具有强大功能的form对象
    const { getFieldDecorator } = this.props.form;

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt='logo' />
          <h1>后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2> 
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', { //配置对象：属性名是特定的一些名称
                //声明式验证
                rules: [
                  { required: true, whitespace: true, message: '用户名必须输入' },
                  { min: 4, message: '用户名至少4位' },
                  { max: 12, message: '用户名最多12位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字和下划线组成' },
                ],
                initialValue: 'admin'  //指定初始值
              })(
                <Input
                  prefix={< Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="用户名" />
              )
              }
            </Form.Item>

            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  { validator: this.validatorPwd }
                ]
              })(
                <Input
                  prefix={< Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="密码" />
              )
              }
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    );
  }
}

const WrapLogin = Form.create()(Login)
export default WrapLogin;