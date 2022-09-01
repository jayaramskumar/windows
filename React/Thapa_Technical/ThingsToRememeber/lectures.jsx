import React from 'react' //--  It is to convert this jsx code in to html .It is done by babel
import  ReactDOM  from 'react-dom' //-- ReactDom has a tree structure.It contains all the elements of a html page.
const array=[<h1>hello</h1>,<p>hi all</p>] 

ReactDOM.render(array,document.getElementById("root"))


//we can pass the jsx elements by simply storing it in an  array

------------------------------------------------------------------------------------------------------------------------------




ReactDOM.render(<div>
    <h1>hello</h1>
     <p>hi all</p>
  </div>
  , document.getElementById("root"))

  //Here there comes an extra div It consumes more space and makes website slow


ReactDOM.render(<React.Fragment>
    <h1>hello</h1>
     <p>hi all</p>
</React.Fragment>
  , document.getElementById("root"))


  
ReactDOM.render(<>
    <h1>hello</h1>
     <p>hi all</p>
  </>
  , document.getElementById("root"))


//In this two methods the extra div will not come.Makes faster
--------------------------------------------------------------------------------------------------------------------------------

<p>My lucky number is 3+4</p>

//Here it will print 7 or we can also put it inside curly braces

//WE can't write loops inside curly braces.We can only wwrite expresions and variables

--------------------------------------------------------------------------------------------------------------------------------------

ReactDOM.render(<h1>{`My first  name is ${fname} and my last name is ${lastname}`}</h1>,document.getElementById("root"))

//use html inside javascript

Math.random() gives random number

const date = new Date().toLocaleDateString();
 10/11/2022

const time = new Date().toLocaleTimeString();
1:26:40 pm


ReactDOM.render(<h1 contentEditable="true">{`My first  name is ${fname} and my last name is ${lastname}`}</h1>,document.getElementById("root"))
//contentEditable allows you to edit headings etc
//in html it is contenteditable


<img src={img4} alt="random"/>
//self closing img tag

<a href='https://css-tricks.com/use-target_blank/' target="_blank">
click
</a>

// target="_blank" is a special keyword that will open links in a new tab every time.
//  target="blank" will open the first-clicked link in a new tab,
//   but any future links that share target="blank" will open in that same newly-opened tab.09-Jun-2021


//can give anyting after underscore
//_jayaram

*{
    background-color: blue;
}

//Assign style to wwhole body

Google fonts - We can apply any fonts using google fonts cdn

(x/y).tofixed(2)
//fixed the decimal places to two digits
----------------------------------------------------------------------------------------------------------------------------------



const style={
    color:"blue",
    textTransform:"capitalize"
  }
  ReactDOM.render(
    <>
    <h1 style={style}>hello</h1>
    </>
  ,document.getElementById("root"))

  //Inline css in jsx
  //Here we have to convert all kabab case html style to camelCase jsx style
  // kabab text-transform


