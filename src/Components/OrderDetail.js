import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

const constants = require('../constants');
const API_URL = constants.API_URL;

class OrderDetail extends Component {

    constructor() {
        super();
        
            this.state = {
                username:"",
                restaurant: null,
                menu:[],
                totalPrice: 0,
                status:"Order Placed"
            
            };
        }
    

    componentDidMount() {
       // const qs = queryString.parse(this.props.username.search);
       /* const { mealType, mealTypeId } = qs;
        this.setState({
            mealType: mealType,
            mealTypeId: mealTypeId
        });
        const city_id = localStorage.getItem('city_id');
*/
        // get list of order by username
        const username=sessionStorage.username;
        axios.get(`${API_URL}/api/getOrderByUsername/username:${username}`)
            .then(result => {
                
                
                this.setState({
                    username: result.data.username,
                    restaurant: result.data.restaurantId,
                    menu: result.data.menu,
                    totalPrice: result.data.totalPrice,
                    status:result.data.status
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

   

    

    handleStatusChange(e) {
        const status=e.target.value;
        this.setState({
           status:status
        });
        
    }



    goToRestaurant(item) {
        const url = `/OrderDetail?username=${item.username}`;
        this.props.history.push(url);
    }

    

    render() {
        const {username,restaurant,totalPrice,status,cartmenu,menu,orderList} = this.state;    
        const ColoredLine = ({ color }) => (
            <hr
               style={{
            color: color,
                backgroundColor: color,
                height: 5
         }}
           />
           );
        return (
            <React.Fragment>
                <div className="container-fluid no-padding filter-layout">
                    <div className="container">
                      <div className="heading">Order List</div>
                        <div className="row statusLine">
                        {ColoredLine('purple')}
                      </div>
                        <div className="row">
                            
                            <div className="leftSection col-xl-3 col-lg-4 col-md-5">
                                <div className="filterSection">
                                    <div className="filter-heading">Orders</div>
                                    <div className="filter-subheading">Select status of order</div>
                                    <select className="filter-location" onChange={(e) => this.handleStatusChange(e)}>
                                       
                                     <option key={0} value='Order Placed'>Order Placed</option>
                                     <option key={1} value='Order Preparing'>Order Preparing</option>       
                                     <option key={2} value='Out for Delivery'>Out for Delivery</option> 
                                     <option key={3} value='Order Completed'>Order Completed</option> 
                                    
                                    </select>
                                    <div className="rightSection col-xl-9 col-lg-8 col-md-7">
                                <div className="resultSection">
                                    {
                                        //orderList.length > 0
                                        //?
                                        //orderList.map((item, index) => {
                                        //})
                                        //:
                                        <div className="text-danger text-center my-5">No Orders Found</div>
                                    }
                            
                                    <div className="filter-subheading">{status}</div>
                                    {
                                        status==='Order Placed'
                                        ?
                                        <div className="mypagination">
                                         
                                        </div>
                                        :
                                        null
                                    }
                            </div>
                            
                            </div>     </div>     </div> 
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withRouter(OrderDetail);
