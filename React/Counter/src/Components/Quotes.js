import React, { useState, useEffect } from 'react'
import '../App.css';

function Quotes() {
    const [Quotes, setQuotes] = useState({})
    const getQoutes = async () => {
        const data = await fetch("https://api.quotable.io/random")
        const data2 = await data.json()
        console.log(data2)
        setQuotes(data2)
    }

    useEffect(()=>{
        getQoutes()
    },[])
    return (
        <div>
            <div>
                <div >
                    <h1 className='QuotesDiv' >{Quotes.content}</h1>
                </div>
                <div className='AuthorDiv'>
                    <h2 className='author'>{Quotes.author}</h2>
                </div>
            </div>
            <button className='button' onClick={getQoutes} >Generate Quotes</button>
        </div>
    )
}

export default Quotes