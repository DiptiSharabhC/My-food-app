
import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Table, Button } from 'react-bootstrap'
import axios from 'axios';
import queryString from 'query-string';
import loginHeader from './Header';
import '../Styles/order.css'
import AdminPanel from './adminHome'
const constants = require('../constants');
const API_URL = constants.API_URL;

export default class Order extends Component {

    constructor() {
        super();   

    this.state = {
    orders: [],
    menu:[],
    selectedstatus:"Order Placed",
    statuslist:["Order Placed","Order Preparing","Out for Delivery","Order Completed"],
    isSelected:false,
    orderid:null
    }
  }

  componentDidMount() {
      const {statuslist,orders,menu}=this.state
    axios.get(`${API_URL}/api/getAllOrders`)
            .then(result => {
                this.setState({
                    orders: result.data.restaurants,
                    statuslist:statuslist,
                    menu:result.data.restaurants.menu,
                    
                });
            })
            .catch(error => {
                console.log(error);
            });
  }
  statusChangeHandler(event,order)
  {
      const selectedstatus=event.target.value;
      this.setState({
          selectedstatus:selectedstatus,
          status:selectedstatus,
          orderid:order._id,
          isSelected:true
      })
  }
  updateOrder(e,order){
    const{isSelected,orderid,status}=this.state
    if(isSelected== true)
    {
      //const {updateorder} = this.state;
      const obj = {
        _id:orderid,
        username:order.username,
        restaurantId:order.restaurantId,
        menu:order.menu,
        totalPrice:order.totalPrice,
        status:status
        
      };
      axios({
          method: 'PUT',
          url: `${API_URL}/api/updateOrder/${order._id}`,
          header: { 'Content-Type': 'application/json' },
          data: obj
      }).then(result => {
          localStorage.setItem("order", JSON.stringify(result.data.order));
       this.setState({
              order: result.data.order,  
              message:"Updated sucessfully!!", 
              isSelected:false
          });
      }).catch(err => {
          this.setState({
             isSelected:true,
             error:err
          });
      })

    }
  }
  removeOrder(e,order){
    const id=order._id;
    axios({
      method: 'DELETE',
      url: `${API_URL}/api/removeOrder/${id}`,
      header: { 'Content-Type': 'application/json' },
     // data: obj
  }).then(result => {
      //localStorage.setItem("order", JSON.stringify(result.data.order));
   this.setState({
         // order: result.data.order,  
          message:"Deleted sucessfully!!", 
          
      });
  }).catch(err => {
      this.setState({
         message:"Order Not Found",
         error:err
      });
  })
  
  }

  render() {
      const {orders,statuslist,menu,selectedstatus,status}=this.state;
    return (
      <React.Fragment>
      <div className="container ordersection">
        <AdminPanel/>
        <div className="headingsection">Order List View:</div>
      <Table striped bordered hover responsive bordered color="#192f60" className='table-sm tableheading'>
          <thead className='tableheading'>
            <tr>
              <th>ID</th>
              <th>RRESTAURANT</th>
              <th>TOTAL PRICE</th>
              <th>ORDERED ITEMS</th>
              
              <th>STATUS</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
        {
          orders.map(orders => {
              const id=orders._id
             
            return <tr> 
               
                <td> {orders._id}</td>
                <td>{orders.restaurantId}</td> 
                <td>&#8377;{orders.totalPrice}</td>
                <td>{
                  orders.menu.map((item)=>{
                    return  <label>{item.itemName}-{item.quantity},</label>
                  })
                  
                  } </td>
                <td> <span>
                <select className="" defaultValue={orders.status} onChange={(event) => this.statusChangeHandler(event,orders)}>
                            <option disabled >{orders.status}</option>
                            {
                                statuslist.map((listitem,index) => {
                                    return <option key={index} value={listitem}>{listitem}</option>
                                })
                            }
                        </select>
                             </span></td>
                <td>   <button className="btnstyle" type="submit" onClick={(e)=>this.updateOrder(e,orders)}>Update</button>
                <button className="btnstyle" type="submit" onClick={(e)=>this.removeOrder(e,orders)}>Delete</button></td>
                
                </tr>
            })
            }  
            </tbody>
          </Table>      
      </div>
      </React.Fragment>
    );
  }
}

