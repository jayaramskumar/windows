//Morning and Night saying website

import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

const date = new Date(2022,12,12,12)
const hours = date.getHours()
var greetingsText=""
const style = {}
if(hours>11 && hours<=23){
  greetingsText="night"
  style.color="blue"
}else{
  greetingsText="morning"
  style.color="red"
}

ReactDOM.render(<>
  <h1>Hello sir Good<span style={style}>{greetingsText}</span></h1>
</>,
document.getElementById("root"))


--------------------------------------------------------------------------------------------

IMPORTING and EXPORTING

############components.jsx####

const  fname = "Jayaram"
const lname = "s kumar"


function fruits(){
    return(
        <h1>Mango</h1>
    )
}
export default fname
export {lname,fruits}//If we wrote one default then the remaining should be in {}


###########index.js####


import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import fname ,{lname,fruits}from './components'

ReactDOM.render(<>
  <h1>{fname}</h1>
  <h1>{lname}</h1>
  {fruits()} //Because  fruits is a function
    
  }
</>,
document.getElementById("root"))

----------------------------------------------------------------------------------------------------
