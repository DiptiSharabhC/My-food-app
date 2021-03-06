import { Route, BrowserRouter } from 'react-router-dom';
import React, { Component } from 'react';

import Home from './Components/Home';
import Filter from './Components/Filter';
import Details from './Components/Details';
import Header from './Components/Header';

import ViewOrder from './Components/viewOrder';
import Restaurant from './Components/restaurant';
import Orders from './Components/Order'
import Admin from './Components/admin'

export default class Router extends Component {
    render() {
        return (
            <BrowserRouter>
                <Header/>
                <Route exact path="/" component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/filter" component={Filter} />
                <Route path="/details" component={Details} />
                
                <Route path="/viewOrder" component={ViewOrder} />
                <Route path="/restaurant" component={Restaurant} />
                <Route path="/Order" component={Orders}/>
                <Route path="/admin" component={Admin}/>
            </BrowserRouter>
        )
    }
}
