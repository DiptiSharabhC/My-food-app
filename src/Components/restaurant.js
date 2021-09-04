import React, { Component } from 'react';
import '../Styles/home.css';
import '../Styles/restaurant.css'
import AdminPanel from './adminHome'
import axios from 'axios';
const constants = require('../constants');
const API_URL = constants.API_URL;

export default class restaurant extends Component {

    constructor() {
        super();
        this.state = {
            name:"",
            city:"",
            location_id:0,
            city_id:0,
            locality:"",
            thumb:["Assets/breakfast.png","Assets/dinner.png","Assets/dinner.png","Assets/drinks.png"],
            aggregate_rating:0,
            rating_text:"Very Good",
            min_price:0,
            contact_number:0,
            cuisines:[],
            image:"Assets/breakfast.png",
            mealtype_id:0,
            locations:[],
            mealtypes:[]
        }
    }

    componentDidMount() {
        
        axios.get(`${API_URL}/api/getAllLocations`)
            .then(result => {
                this.setState({
                    locations: result.data.locations
                    
                });
            })
            .catch(error => {
                console.log(error);
            });
        
        axios.get(`${API_URL}/api/getMealTypes`)
            .then(result => {
                this.setState({
                    mealtypes: result.data.mealtypes
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleCuisineChange=(e, cuisine)=> {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cuisine);
        if (index < 0 && e.target.checked) {
            cuisines.push(cuisine);
        } else {
            cuisines.splice(index, 1);
        }
        this.setState({
            cuisines: cuisines
        });
        localStorage.setItem('cuisines',cuisines);
    }
    
    handleChange = (e, field) => {
        const val = e.target.value;
        
        this.setState({
            [field]: val,
           
        });

    }
    locationChangeHandler = (event) => {
        const selectedValue = event.target.value;
        const location_id = selectedValue.split('_')[0];
        const locality = selectedValue.split('_')[1];

        localStorage.setItem('location_id', location_id);

        
                this.setState({
                  
                   location_id:location_id,
                   locality:locality
                });
    }
    saveNewRestaurant=()=>{
        
        const {name,
            city,
            location_id,
            city_id,
            locality,
            thumb,
            aggregate_rating,
            rating_text,
            min_price,
            contact_number,
            cuisine,
            image,
            mealtype_id
        }=this.state;
        
        const obj = {
               name: name,
                city: city,
                location_id:location_id,
                city_id:city_id,
                locality: locality,
                thumb:thumb,
                aggregate_rating:aggregate_rating,
                rating_text: rating_text,
                min_price:min_price,
                contact_number:contact_number,
                cuisine:cuisine,
                image: image,
                mealtype_id: mealtype_id
                      
        };
        axios({
            method: 'POST',
            url: `${API_URL}/api/addRestaurant`,
            header: { 'Content-Type': 'application/json' },
            data: obj
        }).then(result => {
            localStorage.setItem(JSON.stringify(result.data));
            
            
            this.setState({
                restaurant: result.data,  
                Error:"New Restaurant addded sucessfully!!",               
                
               // goToRestaurant(result)
            })
        }).catch(err => {
            this.setState({
                
                Error: "Please error while saving data"
            });
        })
    }
    
    cityChangeHandler = (event) => {
        const selectedValue = event.target.value;
        const city_id = selectedValue.split('_')[0];
        const city_name = selectedValue.split('_')[1];

        localStorage.setItem('city_id', city_id);

                this.setState({
                   // restaurants: result.data.restaurants
                   city_id:city_id,
                   city:city_name
                });
         
    }

    mealTypeChangeHandler = (event) => {
        const selectedValue = event.target.value;
        const mealtype_id = selectedValue.split('_')[0];
        //const mealtype_name = selectedValue.split('_')[1];

        localStorage.setItem('mealtype_id', selectedValue);

      
       
                this.setState({
                    
                    mealtype_id:mealtype_id
                });
                
           
    }
    render() {
        const { name,city,locality,min_price,contact_number,cuisines,aggregate_rating,rating_text,mealtype_id,city_id,location_id} = this.state;
        const { locations,mealtypes} =this.state;
        
            const reduced = locations.reduce(function(m, d) {
                if (!m[d.city_id]) {
                  m[d.city_id] = {
                    ...d,
                    //count: 1
                  };
                  //console.log(m);
                  return m;
              
                }
               // m[d.itemName].rating += d.rating;
                m[d.city_id].count += 1;
                return m;
              }, {});
              
              
               const reducedresult = Object.keys(reduced).map(function(k) {
                const item = reduced[k];
                
                return {
                  city: item.city,
                  city_id: item.city_id
              
                }
              
              })
           
        
        
        return (
            <React.Fragment>
                <div className="container ">
                
                    <div className="row contentsection">
                    <AdminPanel/>
                    <div className="bottom-header contentsection">Add Restaurant:</div>
                    <hr/>
                    <div className=" contentsection formSection ">
                    
                    <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Restaurant Name:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <input className="form-control" type="text" placeholder="Restaurantname" value={name} onChange={(e) => this.handleChange(e, 'name')}/>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        City:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <select className="form-control" onChange={(event) => this.cityChangeHandler(event)}>
                            <option disabled value="Delhi">Select City</option>
                            {
                                reducedresult.map((item,index) => {
                                   
                                    return <option key={index} value={item.city_id + '_' + item.city}> {item.city}</option>
                                })
                            }
                        </select>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Locality:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <select className="form-control" onChange={(event) => this.locationChangeHandler(event)}>
                            <option disabled value="">Select location</option>
                            {
                                locations.map((item,index) => {
                                    return <option key={index} value={item.location_id + '_' + item.name}>{item.name}</option>
                                })
                            }
                        </select>
                        </div>
                        </div>
                       
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Aggregate_Rating:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <input className="form-control my-2" type="text" placeholder="aggregate_rating" value={aggregate_rating} onChange={(e) => this.handleChange(e, 'aggregate_rating')}/>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Rating_Text:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <input className="form-control my-2" type="text" placeholder="rating_text" value={rating_text} onChange={(e) => this.handleChange(e, 'rating_text')}/>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Minnimum Price:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <input className="form-control my-2" type="text" placeholder="min_price" value={min_price} onChange={(e) => this.handleChange(e, 'min_price')}/>
                        </div>
                        </div>
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Contact Number:
                        </div><div className="col-xs-4 col-sm-4">
                        <input className="form-control my-2" type="text" placeholder="contact_number" value={contact_number} onChange={(e) => this.handleChange(e, 'contact_number')}/>
                        </div></div>
                        
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">
                        Meal Type:
                        </div>
                        <div className="col-xs-4 col-sm-4">
                        <select className="form-control" onChange={(event) => this.mealTypeChangeHandler(event)}>
                            <option disabled value="">Select MealType</option>
                            {
                                mealtypes.map((item, index) => {
                                   
                                    return <option key={index} value={item.id + '_' + item.name}>{item.name}</option>
                                })
                            }
                        </select>
                        </div></div>
                        <div className="row">
                        <div className="col-xs-4 col-sm-4">Cuisine :</div>
                        <div className="col-xs-10">    
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "North Indian")} /><span className="filter-cuisine">North Indian</span>
                                   
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "South Indian")} /><span className="filter-cuisine">South Indian</span>
                                    
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "Chinese")} /><span className="filter-cuisine">Chinese</span>
                                   
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "Fast Food")} /><span className="filter-cuisine">Fast Food</span>
                                    
                                        <input type="checkbox" className="filter-cuisine" name="cuisine" onChange={(e) => this.handleCuisineChange(e, "Street Food")} /><span className="filter-cuisine">Street Food</span>
                           </div>         
                           </div>
                           <div>
                           <button className="submitBtn" onClick={this.saveNewRestaurant}>submit</button>
                           </div>
                    
                   
                    </div>
                   </div>
                </div>
                    
            </React.Fragment>
        )  
  }
}