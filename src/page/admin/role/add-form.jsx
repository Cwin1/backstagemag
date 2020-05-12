import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input
} from 'antd';

//添加角色的form组件

const Item = Form.Item

class AddForm extends React.Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
    }

    componentWillMount() {
        //将form对象通过serForm()方法传递给父组件
        this.props.setForm(this.props.form)
    };

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 18 }
        }

        return (
            <Form {...formItemLayout}>
                <Item label='角色名称'>
                    {getFieldDecorator('roleName', {
                        initialValue: '',
                        rules: [
                            { required: true, whitespace: true, message: '角色名称必须输入' },
                        ]
                    })(
                        <Input placeholder='请输入角色名称' />
                    )}
                </Item>
            </Form>
        );
    }
}


export default Form.create()(AddForm);
