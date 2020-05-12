import React, { PureComponent } from 'react';
import LinkButton from '../../../components/link-button';
import { reqCategory, reqAddUpdateProduct } from '../../../api';
import PicturesWall from './pictures-wall '
import RichTextEditor from './rich-text-editor';
import memoryUtils from '../../../utils/memoryUtils';
import {
    Card,
    Form,
    Input,
    Icon,
    Cascader,
    Button,
    message
} from 'antd';


const { Item } = Form
const { TextArea } = Input

class AddUpdate extends PureComponent {

    state = {
        options: [],
    };

    constructor(props) {
        super(props);
        //创建ref容器，并保存到组件对象
        this.pwRef = React.createRef();
        this.editorRef = React.createRef();
    }

    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.map((item) => ({
            value: item._id,
            label: item.name,
            isLeaf: false, //不是叶子
        }))
        //如果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成一个二级下拉列表的options
            const childOptions = subCategorys.map(item => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }))

            //找到当前商品对应的一级option对象
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联对应的一级option上
            targetOption.children = childOptions
        }

        //更新options状态
        this.setState({
            options
        })
    }

    //异步获取一级/二级分类列表并显示
    getCategorys = async (parentId) => {
        const result = await reqCategory(parentId)
        // console.log(result);
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') { //如果是一级列表
                this.initOptions(categorys)
            } else { //如果是二级列表
                return categorys  //返回二级列表 ==> 当前async函数返回的promise就会成功且value为categorys
            }
        }
    }

    //验证价格的自定义函数
    validatePrice = (rule, value, callback) => {
        // console.log(value, typeof value)
        if (value * 1 > 0) {
            callback()  //验证通过
        } else {
            callback('价格必须大于0') //验证不通过
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        //显示loading
        targetOption.loading = true;
        //根据选中的分类，请求获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false;
        if (subCategorys && subCategorys.length > 0) {  //如果二级分类有数据
            //生成一个二级列表的options
            const childOptions = subCategorys.map((item) => ({
                label: item.name,
                value: item._id,
                isLeaf: true
            }));
            //关联到当前的option上
            targetOption.children = childOptions
        } else {  //如果当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options],
        });
    };


    submit = () => {
        //进行表单验证，如果通过，则发送axjx请求
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                //收集数据
                const { name, desc, price, categoryIds } = values
                console.log('发送axjx请求', name, desc, price, categoryIds);
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }

                //收集上传的图片文件名的数组
                const imgs = this.pwRef.current.getImgs()
                // console.log(imgs);
                //输入的商品详情的标签字符串
                const detail = this.editorRef.current.getDetail()
                // console.log(detail);

                //封装product对象
                const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
                if (this.isUpdate) {
                    product._id = this.product._id
                    
                }

                //发请求添加或修改
                const result = await reqAddUpdateProduct(product)
                console.log(result);
                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack('/product')
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }
            }
        })
    }

    componentWillMount() {
        this.product = memoryUtils.product
        //保存是否是更新的标识
        this.isUpdate = !!this.product._id
        // console.log(!!this.product._id);
        this.product = this.product || {}
    }

    componentDidMount() {
        this.getCategorys('0')
    }



    render() {
        const { isUpdate, product } = this
        const { options } = this.state
        //用来接收级联分类ID的数组
        const { pCategoryId, categoryId } = product

        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {   //商品是一个一级分类的商品
                categoryIds.push(categoryId)
            } else {  //商品是一个二级分类的商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 6 }
        }

        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{ color: '#ff9373', marginRight: 10, fontSize: 20 }}
                        onClick={() => this.props.history.goBack()} 
                    />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form


        return (
            <div>
                <Card title={title} className='product-addupdate'>
                    <Form {...formItemLayout}>
                        <Item label='商品名称'>
                            {
                                getFieldDecorator('name', {
                                    initialValue: product.name,
                                    rules: [
                                        { required: true, message: '请输入商品名称' }
                                    ]
                                })(<Input placeholder='请输入商品名称' />)
                            }
                        </Item>
                        <Item label='商品描述'>
                            {
                                getFieldDecorator('desc', {
                                    initialValue: product.desc,
                                    rules: [
                                        { required: true, message: '请输入商品描述' }
                                    ]
                                })(<TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, maxRows: 6 }} />)
                            }
                        </Item>
                        <Item label='商品价格'>
                            {
                                getFieldDecorator('price', {
                                    initialValue: product.price,
                                    rules: [
                                        { required: true, message: '请输入商品价格' },
                                        { validator: this.validatePrice }
                                    ]
                                })(<Input type='number' placeholder='请输入商品价格' addonAfter='元' />)
                            }
                        </Item>
                        <Item label='商品分类'>
                            {
                                getFieldDecorator('categoryIds', {
                                    initialValue: categoryIds,
                                    rules: [
                                        { required: true, message: '请指定商品分类' },
                                    ]
                                })(<Cascader
                                    options={options} //需要显示的列表数据数组
                                    loadData={this.loadData}     //当选择某个列表项，加载下一级列表的监听回调
                                />)
                            }

                        </Item>
                        <Item label='商品图片' wrapperCol={{ span: 7 }}>
                            {/*将容器交给需要标记的标签对象，在解析时就会自动将标签对象保存到容器中(属性名为：current，属性值标签对象) */}
                            <PicturesWall ref={this.pwRef} imgs={product.imgs} />
                        </Item>
                        <Item label='商品详情' wrapperCol={{ span: 20 }}>
                            {/*富文本编辑器 */}
                            <RichTextEditor ref={this.editorRef} detail={product.detail} />
                        </Item>
                        <Item>
                            <Button type='primary' onClick={this.submit}>提交</Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default Form.create()(AddUpdate);