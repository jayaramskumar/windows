import React,{useState} from 'react'


function Questans(props) {
const [show,setShow]=useState(false)
const Spanstyle = {
    color: "blue",
    fontSize: "xx-large",
    padding: "10px",
}

const answerStyle={
    background: "aqua",
    padding:" 1%"
}

const questStyle={
    background:"#ffe4e4"
}

const bodyStyle={
    marginLeft: "25%",
    marginRight: "25%"
}
    


  return (
    <section style={bodyStyle}>
            <div >
        <h1 style={questStyle} onClick={()=>{
            setShow(!show)
        }} ><span  style={Spanstyle}>{show ? "-" : "+"}</span>{props.question}</h1>
        {show && <h4 style={answerStyle}>{props.answer}</h4>}
    </div>
    </section>
  )
}

export default Questans