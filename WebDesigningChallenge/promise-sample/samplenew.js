const promise = require('promise')

function getname(){
    return new promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('jayaram')
        },3000)
    })
}

function getmobile(){
    return new promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve('123456789')
        },2000)
    })
}

// promise.all([getname(),getmobile()]).then((result)=>{
//     console.log(result)
// })

async function getuser(){
    let name = await getname()
    console.log(name)
    let mobile=await getmobile()
    console.log(mobile)
}

getuser()