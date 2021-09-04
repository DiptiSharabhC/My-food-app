import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from 'axios';
import queryString from 'query-string';
import Modal, { prototype } from 'react-modal';
//import loginHeader from './Header';
import '../Styles/filter.css';
import '../Styles/details.css';
import '../App.css'
import '../Styles/ProgressBar.css'
import Progressbar from './Progress_bar';

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

export default class viewOrder extends Component {
  
      
    constructor() {
        super();
        
        this.state = {
            username:sessionStorage.getItem("username"),
            restaurant: undefined,
            
            menu:[],
            totalPrice: 0,
            status:"No Orders",
            
            user:undefined
        };
    }


componentDidMount() {
   // const qs = queryString.parse(this.props.username);
    const username=sessionStorage.getItem("username");
    this.setState({
       username:username
    });
    const uname = localStorage.getItem('username');
   let newmenu=[];
   localStorage.setItem('username',username);
    axios.get(`${API_URL}/api/getOrderByUsername/${username}`)
        .then(result => {
            let xyz ;
            //        totalPrice=totalPrice+item.itemPrice;
                    xyz=result.data.order[0].menu
                        
                    
                    newmenu.push(xyz);
                   // menu=newmenu;
            this.setState({
                id: result.data.order[0]._id,
                restaurant:result.data.order[0].restaurantId,
                menu:xyz,
                totalPrice:result.data.order[0].totalPrice,
                status:result.data.order[0].status                

            });
           
        })
        .catch(error => {
            console.log(error);
        });
        
    }

    render(){
        
        const {id,restaurant,menu,totalPrice,status} = this.state;
        let progressval="";
        if(!id && status=="No Orders"){
            progressval="0%";
            
        }
       else{
           if(status=="Order Placed")
           {
           progressval="20%";
           }else if(status=="Order Preparing")
           {
            progressval="40%";
           }else if(status=="Order Preparing")
           {
            progressval="60%";
           }else if(status=="Out for Delivery")
           {
            progressval="80%";
           }
           else if(status=="Order Completed")
           {
            progressval="100%";  
           }
           }
       
        return(
        <React.Fragment>
            <div >
                    <div className="container ">
                       
                       <div className=""> Order Status:<Tab/>{status}</div>
                               <div className="progressBarSize">
                                
                                <Progressbar bgcolor="green" progress={progressval}  height={10} status={status} />
                                
                             </div>
                       </div>        
                
                    <hr/>
                    <div className="orderstyle">OrderDetails:
                    <div className="orderstyle">
                        <span>Order Id :{id}</span><br/>
                        <span>Restaurant :{restaurant}</span><br/>
                        <span>MenuOrdered :
                        {
                            menu.map((item, index) => {
                             return <div className="filter-heading"><Tab/><Tab/><Tab/><Tab/><span key={index}>ItemName :{ item.itemName }
                            , Qty :{item.quantity}<br/></span></div>
                             
                            })
                        }
                             </span><br/>
                        <span>TotalPrice  :  &#8377;{totalPrice}</span><br/>
                        <span>Status :{status}</span><br/>
                    </div>
                    </div>
                    </div>
        </React.Fragment>
        )
    }
}