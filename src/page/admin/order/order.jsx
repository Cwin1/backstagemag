import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import OrderHome from './home';
import OrderDetail from './detail';


class Order extends React.Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/order' component={OrderHome} />
                    <Route path='/order/detail' component={OrderDetail} />
                    <Redirect to='/order' />
                </Switch>
            </div>
        );
    }
}

export default Order;