import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../Styles/admin.css'
class adminHome extends Component {

   
    render() {
        const { image, title, description, mealType } = this.props;
        return (
            <>
                 
                 <div className="col-xs-4  ">
                 <span> <a href="https://locahost:3000/admin">Home</a></span>
                 <span><a href="https://locahost:3000/restaurant">Add restaurant</a></span>
                 <span>  <a href="https://locahost:3000/order">Orders</a></span>
                </div>
                    
                   
            
            </>
        )
    }
}

export default withRouter(adminHome);
