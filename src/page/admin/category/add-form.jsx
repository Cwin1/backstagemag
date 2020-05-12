import React from 'react';
import PropTypes from 'prop-types';
import {
    Form,
    Select,
    Input
} from 'antd';

//添加分类的form组件

const Item = Form.Item
const Option = Select.Option

class AddForm extends React.Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired, //用来传递form对象的函数
        categorys: PropTypes.array.isRequired, //一级分类的数组
        parentId: PropTypes.string.isRequired  //父分类ID

    }

    componentWillMount() {
        //将form对象通过serForm()方法传递给父组件
        this.props.setForm(this.props.form)
    }

    render() {
        const { categorys, parentId } = this.props
        const { getFieldDecorator } = this.props.form;

        return (
            <Form>
                <Item>
                    {getFieldDecorator('parentId', {
                        initialValue: parentId,
                    })(
                        <Select>
                            <Option value='0'>一级分类</Option>
                            {
                                categorys.map((item,key) => <Option key={key} value={item._id}>{item.name}</Option>)

                            }
                        </Select>
                    )}
                </Item>

                <Item>
                    {getFieldDecorator('categoryName', {
                        initialValue: '',
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


export default Form.create()(AddForm);
