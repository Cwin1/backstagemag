import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ProductHome from './home';
import ProductDetail from './detail';
import ProductAddUpadte from './add-update';


class Product extends Component {
    //产品路由
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/product' component={ProductHome} />
                    <Route path='/product/detail' component={ProductDetail} />
                    <Route path='/product/addupdate' component={ProductAddUpadte} />
                    <Redirect to='/product' />
                </Switch>
            </div>
        );
    }
}

export default Product;