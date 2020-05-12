import React, { Component } from 'react';
import './product.less';
import LinkButton from '../../../components/link-button';
import { BASE_IMG } from '../../../utils/constant';
import { reqCategoryId } from '../../../api';
import { PhotoProvider, PhotoConsumer } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
import {
    Card,
    Icon,
    List
} from 'antd'

const Item = List.Item

class Detail extends Component {

    state = {
        cName1: '', //一级分类名称
        cName2: '', //二级分类名称
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') { //一级分类下的商品
            const result = await reqCategoryId(categoryId)
            this.setState({
                cName1: result.data.name
            })
        } else {
            /*
            //通过多个await方式发送请求：后面一个请求是在前一个请求成功返回后才发送
            const result1 = await reqCategoryId(pCategoryId)
            const result2 = await reqCategoryId(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name
            */

            //一次性发送多个请求，只有都成功了才正常处理
            const results = await Promise.all([reqCategoryId(pCategoryId), reqCategoryId(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {

        //读取携带过来的state数据
        const { name, price, imgs, desc, detail } = this.props.location.state.product
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{ color: '#ff9373', marginRight: 10, fontSize: 20 }}
                        onClick={() => this.props.history.goBack()} 
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )
        return (
            <div>
                <Card title={title} className='product-detail'>
                    <List>
                        <Item>
                            <span className='left'>商品名称：</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className='left'>商品描述：</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className='left'>商品价格：</span>
                            <span>{price}元</span>
                        </Item>
                        <Item>
                            <span className='left'>所属分类：</span>
                            <span>{cName1}{cName2 ? '-->' + cName2 : ''}</span>
                        </Item>
                        <Item>
                            <span className='left'>商品图片：</span>
                            <span>
                                {/* {
                                    imgs.map(img => (
                                        <img
                                            key={img}
                                            className='product-img'
                                            src={BASE_IMG + img}
                                            alt={img} />
                                    ))
                                } */}
                                {
                                    <PhotoProvider
                                        photoClosable='true'
                                    >
                                        {imgs.map(img => (
                                            <PhotoConsumer
                                                key={img}
                                                src={BASE_IMG + img}
                                            >
                                                <img
                                                    src={BASE_IMG + img}
                                                    key={img} alt="img"
                                                    className='product-img' />
                                            </PhotoConsumer>
                                        ))}
                                    </PhotoProvider>
                                }

                            </span>
                        </Item>
                        <Item>
                            <span className='left'>商品详情：</span>
                            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                        </Item>
                    </List>
                </Card>
            </div>
        );
    }
}

export default Detail;