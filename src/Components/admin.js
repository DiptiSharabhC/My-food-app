import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import AdminPanel from './adminHome'

import queryString from 'query-string';
import '../Styles/home.css';
import '../Styles/restaurant.css'
import '../Styles/admin.css'


const constants = require('../constants');
const API_URL = constants.API_URL;

export default class admin extends Component {

    constructor() {
        super();

   
    }
    componentDidMount(){

    }

    render(){
        return(
        <React.Fragment>
           <div className="container headersection">
             <AdminPanel/> 
                   
            </div>
      </React.Fragment>
        )}

}
