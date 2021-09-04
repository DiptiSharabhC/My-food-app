import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
  
const Progress_bar = ({bgcolor,progress,height,status}) => {
     
    const Parentdiv = {
        height: '5%',
        width: '100%',
        backgroundColor: 'grey',
        borderRadius: 40,
        margin: 50
      }
      
      const Childdiv = {
        height: '5%',
        width: progress,
        backgroundColor: bgcolor,
       borderRadius:40,
        textAlign: 'right',
        
      }
      
      const progresstext = {
        padding: 10,
        color: 'white',
        fontWeight: 900
      }
        
    return (
    <div style={Parentdiv}>
      <div style={Childdiv}>
        <span style={progresstext}>{`${status}`}</span>
      </div>
    </div>
    )
}
  
export default withRouter(Progress_bar);
