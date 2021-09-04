import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import queryString from 'query-string';
import Modal from 'react-modal';
import loginHeader from './Header'


import 'react-tabs/style/react-tabs.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../Styles/details.css';

const constants = require('../constants');
const API_URL = constants.API_URL;

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '660px',
        maxHeight: '700px',
        zIndex: 1000
    },
};

Modal.setAppElement('#root');

export default class Details extends Component {

    constructor() {
        super();
        
        this.state = {
            username:"",
            restaurant: null,
            isMenuModalOpen: false,
            cartmenu:[],
            menu:[],
            menuname:"",
            totalPrice: 0,
            status:"Order Placed",
            user:undefined
        };
    }

    componentDidMount() {
        const qs = queryString.parse(this.props.location.search);
        const { id } = qs;
        
        axios.get(`${API_URL}/api/getRestaurantById/${id}`)
            .then(result => {
                this.setState({
                    restaurant: result.data.restaurant
                });
            })
            .catch(error => {
                console.log(error);
            });

        // get the menu for this restaurant
        axios.get(`${API_URL}/api/getMenuByRestaurant/${id}`)
            .then(result => {
                this.setState({
                    menu: result.data.menu
                });
            })
            .catch(error => {
                console.log(error);
            });
        
    }

    openMenuHandler = () => {
        this.setState({
            isMenuModalOpen: true
        });

        
    }

    closeMenuModal = () => {
        this.setState({
            isMenuModalOpen: false
        });
    }

    addItemHandler = (item,e) => {
        const { totalPrice,restaurant,username,itemmenu,cartmenu} = this.state;
        let xyz ;
//        totalPrice=totalPrice+item.itemPrice;
        xyz={
            itemName:item.itemName,
            price:item.itemPrice
        }
        cartmenu.push(xyz);

          this.setState({              
            totalPrice: totalPrice + item.itemPrice,  
            cartmenu:cartmenu
        }) 
    }

    
    saveOrderDetails = (e) => {
        const {username,restaurant,totalPrice,status,cartmenu,menu} = this.state;       
        const reduced = cartmenu.reduce(function(m, d) {
            if (!m[d.itemName]) {
              m[d.itemName] = {
                ...d,
                count: 1
              };
              //console.log(m);
              return m;
          
            }
           // m[d.itemName].rating += d.rating;
            m[d.itemName].count += 1;
            return m;
          }, {});
          
          
           const result = Object.keys(reduced).map(function(k) {
            const item = reduced[k];
            
            return {
              itemName: item.itemName,
              quantity: item.count,
          
            }
          
          })
          
        const obj = {
            username:sessionStorage.getItem('username'),
            restaurantId: restaurant.name,
            menu:result,
            totalPrice:totalPrice,
            status:status            
        };
        axios({
            method: 'POST',
            url: `${API_URL}/api/saveOrder`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem(JSON.stringify(result.data));
            localStorage.setItem("isMenuModalOpen", true);
            
            this.setState({
                OrderDetails: result.data,  
                Error:"Order detail sets!!",               
                isMenuModalOpen: false,
               // goToRestaurant(result)
            })
        }).catch(err => {
            this.setState({
                isMenuModalOpen: false,
                Error: "Please error while saving data"
            });
        })
    }

    goToRestaurant(item) {
        const url = `/orderDetails?username=${item.username}`;
        this.props.history.push(url);
    }
  
    getCheckSum(data) {
        return fetch(`${API_URL}/api/payment`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(data)
        }).then(result => { 
            
            return result.json();
            
        }).catch(err => {
            console.log(err);
        })
    }
    isObj = (val) => {
        return typeof val === 'object';
    }

    isDate = (val) => {
        return Object.prototype.toString.call(val) === '[object Date]';
    }

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    }

    buildForm = (details) => {
        const { action, params } = details;
        const form = document.createElement('form');
        form.setAttribute('method', 'post');
        form.setAttribute('action', action);
        Object.keys(params).forEach(key => {
            const input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', key);
            input.setAttribute('value', this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;
    }

    postTheInformation = (information) => {
        // you can post the payment and order related information to paytm gateway only through an HTML form
        // How will you create an HTML form in the Javascript - DOM manipulation

        // first we will create a form and then we will post the form to Paytm
        const form = this.buildForm(information);

        // attach form to the document body
        document.body.appendChild(form);
       // this.menuname=document.data.itemName;
        // submit
        form.submit();

        // destroy the form
        form.remove();

    }

    paymentHandler = (e) => {
        // Pyament integration logic

        //(1) make API call to the BE /payment and get the payment cheksum
        //(2) go to the paytm website

        const data = {
            amount: this.state.totalPrice,
            email: 'diptichaudharish@gmail.com',
            mobileNo: '9999999999'
        };

        this.getCheckSum(data)
            .then(result => {
                //saveOrderDetails();
                let information = {
                    action: 'https://securegw-stage.paytm.in/order/process',
                    params: result
                }
                this.postTheInformation(information);
                
            })
            .catch(error => {
                console.log(error);
            })
    }

    render() {
        const {username, restaurant, isMenuModalOpen,totalPrice,menu} = this.state;
       
        return (
            <div className="container details">
                {
                    restaurant
                    ?
                    <div>
                        <div className="images">
                            <Carousel showThumbs={false}>
                                {
                                    restaurant.thumb.map((item, index) => {
                                        return (
                                            <div>
                                                <img key={index} src={require('../' + item).default} alt="not found" />
                                            </div>
                                        )
                                    })
                                }
                            </Carousel>
                        </div>
                        <div className="restName my-3">
                            { restaurant.name }
                            <button className="btn btn-danger float-end mt-4" onClick={this.openMenuHandler}>Place Online Order</button>
                        </div>
                        <div className="myTabs mb-5">
                            <Tabs>
                                <TabList>
                                    <Tab>Overview</Tab>
                                    <Tab>Contact</Tab>
                                </TabList>

                                <TabPanel>
                                    <div className="about my-5">About this place</div>
                                    <div className="cuisine">Cuisine</div>
                                    <div className="cuisines">
                                        {
                                            restaurant.cuisine.map((item, index) => {
                                                return <span key={index}>{ item.name },</span>
                                            })
                                        }
                                    </div>
                                    <div className="cuisine mt-3">Average Cost</div>
                                    <div className="cuisines"> &#8377; { restaurant.min_price } for two people (approx.)</div>
                                </TabPanel>
                                <TabPanel>
                                    <div className="cuisines my-5">Phone Number
                                        <div className="text-danger">{ restaurant.contact_number }</div>
                                    </div>
                                    <div className="cuisine mt-4">{ restaurant.name }</div>
                                    <div className="text-muted mt-2">
                                        { restaurant.locality }, 
                                        <br/>
                                        { restaurant.city }
                                    </div>
                                </TabPanel>
                            </Tabs>
                        </div>
                        <Modal isOpen={isMenuModalOpen} style={customStyles}>
                            <h2 className="popup-heading">
                                { restaurant.name }
                                <button className="float-end btn btn-close mt-2" onClick={this.closeMenuModal}></button>
                                <ul className="menu">
                                    {
                                        menu.map((item, index) => {
                                            return (
                                                <li key={index}>
                                                    <div className="row no-gutters menuItem">
                                                        <div className="col-10">
                                                            {
                                                                item.isVeg
                                                                ?
                                                                <div className="text-success fs-6">Veg</div>
                                                                :
                                                                <div className="text-danger fs-6">Non-Veg</div>
                                                            }
                                                            <div className="cuisines">{ item.itemName }</div>
                                                            <div className="cuisines">&#8377;{ item.itemPrice }</div>
                                                            <div className="cuisines">{ item.itemDescription }</div>
                                                        </div>
                                                        <div className="col-2">
                                                            <button className="btn btn-light addButton" onClick={(e) => this.addItemHandler(item,e)}>Add</button>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                <div className="mt-3 restName fs-4">
                                    Subtotal <span className="m-4">&#8377; { totalPrice }</span>
                                   <button className="btn btn-danger float-end" onClick={(e)=>this.saveOrderDetails(e)}>Save Order</button>
                                   <button className="btn btn-danger float-end" onClick={(e)=>this.paymentHandler(e)}>Pay Now</button>
                                </div>
                            </h2>
                        </Modal>
                    </div>
                    :
                    null
                }
            </div>
        )
    }
}