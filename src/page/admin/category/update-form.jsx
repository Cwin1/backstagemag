import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Input
} from 'antd';



//更新分类的form组件

const Item = Form.Item

class UpdateForm extends React.Component {

    static propTypes = {
        categoryName: PropTypes.string.isRequired,
        setForm: PropTypes.func.isRequired 
    }

    componentWillMount() {
        //将form对象通过serForm()方法传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { categoryName } = this.props
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Item>
                    {getFieldDecorator('categoryName', {
                        initialValue: categoryName,
                        rules: [
                            { required: true, whitespace: true, message: '分类名称必须输入' },
                        ]
                    })(
                        <Input placeholder='请输入分类名称' />
                    )}
                </Item>
            </Form>
        );
    }
}


export default Form.create()(UpdateForm);