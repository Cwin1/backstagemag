import React, { Component } from 'react';
import LinkButton from '../../../components/link-button';
import initOrders from './orders';
import { ORDER_PAGE_SIZE } from '../../../utils/constant';
import {
    Card,
    Select,
    Input,
    Button,
    Table,
    message
} from 'antd';

const Option = Select.Option


class Detail extends Component {
    state = {
        orders: [], //订单号
        pageNum: 1,
        total: 0,
        searchName: '',
        searchType: 'orderNum',
        peerHtml: [],
    }

    //初始化table的列的数组
    initColumns = () => {
        this.columns = [
            {
                width: '20%',
                title: '订单号',
                dataIndex: 'orderNum',
            },
            {
                width: '15%',
                title: '收件人',
                dataIndex: 'recipient',
            },
            {
                width: '10%',
                title: '订单状态',
                dataIndex: 'status',
            },
            {
                width: '10%',
                title: '订单总价',
                dataIndex: 'price',
                render: (price) => '￥' + price //当前指定了对应的属性，传入的是对应的属性值

            },
            {
                width: '15%',
                title: '创建时间',
                dataIndex: 'time'
            },
            {
                width: '10%',
                title: '操作',
                render: () => {
                    return (
                        <span>
                            {/*将product对象使用state传递给目标路由组件*/}
                            <LinkButton onClick={() => message.warning('该功能正在开发中')}>查看</LinkButton>
                        </span >
                    )
                }
            },
        ];
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getOrders(1)
    }

    getOrders = (pageNum) => {
        this.pageNum = pageNum  //保存pageNum，让其他方法可以看到
        const { searchName, searchType } = this.state
        if (searchName) {  //如果输入框有值
            // console.log(searchType);
            if (searchType === 'orderNum') {
                const searchOrders = []
                initOrders.forEach(item => {
                    if (item.orderNum.indexOf(searchName) >= 0) {
                        searchOrders.push(item)
                        // console.log(searchOrders);
                    }
                    this.setState({
                        orders: searchOrders,
                        total: searchOrders.length,
                        pageNum,
                    })
                });
            } else {
                const searchRecipient = []
                initOrders.forEach(item => {
                    if (item.recipient.indexOf(searchName) >= 0) {
                        searchRecipient.push(item)
                        // console.log(searchRecipient);
                    }
                    this.setState({
                        orders: searchRecipient,
                        total: searchRecipient.length,
                        pageNum
                    })
                })
            }

        } else {
            this.setState({
                orders: initOrders,
                total: initOrders.length,
                pageNum,
            })
        }

    }

    search = () => {
        if (this.state.searchName) {
            this.getOrders()
        } else {
            message.warning('请输入要搜索的关键字')
        }
    }


    render() {
        const { total, searchType, searchName } = this.state
        const title = (
            <span>
                <Select value={searchType} style={{ width: '125px' }}
                    onChange={value => this.setState({ searchType: value })}
                >
                    <Option value='orderNum'>按订单号查询</Option>
                    <Option value='recipient'>按收件人查询</Option>
                </Select>
                <Input
                    value={searchName}
                    placeholder={searchType === 'orderNum' ? '订单号' : '收件人'}
                    style={{ width: '150px', margin: '0 15px' }}
                    onChange={e => this.setState({ searchName: e.target.value })}
                    onKeyUp={e => { if (e.keyCode === 13) this.search() }}
                />
                <Button type='primary' onClick={this.search}>搜索</Button>
            </span>
        )
        return (
            <div>
                <Card title={title} >
                    <Table
                        dataSource={this.state.orders}
                        columns={this.columns}
                        bordered
                        rowKey='id'
                        pagination={{
                            current: this.pageNum,
                            total,
                            defaultPageSize: ORDER_PAGE_SIZE,
                            showQuickJumper: true,
                            onChange: this.getOrders,
                        }}
                    />
                </Card>
            </div >
        );
    }
}

export default Detail;