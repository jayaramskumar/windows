var  result
var num1
var num2
function buttonclick(val)
{
    document.getElementById("screen").value+=val

}
function clearDisplay(){
    document.getElementById("screen").value=""
}



function equalclick(){
    document.getElementById("screen").value=result
    console.log(result)
    console.log(num1)
    console.log(num2)
}

function operationclick(val){
    var num1=document.getElementById("screen").value
    document.getElementById("screen").value=""
    var num2=document.getElementById("screen").value
    if(val="+"){
         result=num1+num2
    }if(val="-"){
        result=num1-num2
    }if(val="*"){
        result=num1*num2
    }if(val="/"){
        result=num1/num1
    }

}