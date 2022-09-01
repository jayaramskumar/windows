
import './App.css';
import Questans from './Questans';
import data  from './api';
import { useState } from 'react';

function App() {
  const [ans,setans]=useState(data)
  const fullStyle={
    background: "#aacdabf2",
    padding: "3%",
    marginLeft: "17%",
    marginRight: "17%"
  }
  return(
    <div style={fullStyle}>
      {
            ans.map((dt)=>{
              return(
                   <Questans id={dt.id} {...dt}/>       
              )
            })
      }
    </div>
  )


}

export default App;
