import React, { Component } from 'react';
import LinkButton from '../../../components/link-button';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../../api';
import memoryUtils from '../../../utils/memoryUtils'
import { PAGE_SIZE } from '../../../utils/constant'
import {
    Card,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message,
} from 'antd';

const Option = Select.Option

class Home extends Component {
    state = {
        total: 0,  //商品的总数量
        products: [], //商品的数组
        loading: false,
        searchName: '', //搜索的关键字
        searchType: 'productName', //根据哪个字段搜索
    }

    //初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                width: '50%',
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                width: '20%',
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                width: '10%',
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price //当前指定了对应的属性，传入的是对应的属性值
            },
            {
                width: '8%',
                title: '状态',
                // dataIndex: 'status',
                render: (product) => {
                    const { status, _id } = product
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.updateStatus(_id, newStatus)}
                            >
                                {status === 1 ? '下架' : '上架'}
                            </Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: '10%',
                title: '操作',
                render: (product) => {
                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { product })}>详情</LinkButton>
                            <LinkButton
                                onClick={() => {
                                    //在内存中保存product
                                    memoryUtils.product = product
                                    this.props.history.push('/product/addupdate', product)
                                }}
                            >
                                修改
                                </LinkButton>
                        </span>
                    )
                }
            },
        ];
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum  //保存pageNum，让其他方法可以看到
        this.setState({ loading: true })  //显示loading
        const { searchName, searchType } = this.state

        let result
        if (searchName) {//如果搜索关键字有值，说明要做搜索分页
            result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
        } else {  //一般分页请求
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({ loading: false })  //隐藏loading

        if (result.status === 0) {
            //取出分页数据，更新状态，显示分页列表
            const { total, list } = result.data
            this.setState({
                total,
                products: list
            })
        }
    }

    //更新商品状态
    updateStatus = async (productId, status) => {
        const result = await reqUpdateStatus(productId, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    handleDelete = key => {
        const products = [...this.state.products];
        this.setState({ products: products.filter(item => item.key !== key) });
    };

    searchProducts = () => {
        if (this.state.searchName) {
            this.getProducts(1)
        } else {
            message.warning('请输入要搜索的关键字')
        }
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const { products, total, loading, searchName, searchType } = this.state
        const title = (
            <span>
                <Select value={searchType} style={{ width: '120px' }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input value={searchName} placeholder='关键字' style={{ width: '150px', margin: '0 15px' }}
                    onChange={e => this.setState({ searchName: e.target.value })}
                    // onKeyUp={e => { if (e.keyCode === 13 && searchName) this.getProducts(1) }}
                    onKeyUp={e => { if (e.keyCode === 13) this.searchProducts() }}
                />
                <Button type='primary' onClick={this.searchProducts}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={() => {
                memoryUtils.product = {}
                this.props.history.push('/product/addupdate')
            }}>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <div>
                <Card title={title} extra={extra}>
                    <Table
                        dataSource={products}
                        columns={this.columns}
                        bordered
                        loading={loading}
                        rowKey='_id'
                        pagination={{
                            current: this.pageNum,
                            total,
                            defaultPageSize: PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.getProducts,
                        }}
                    />
                </Card>
            </div>
        );
    }
}

export default Home;