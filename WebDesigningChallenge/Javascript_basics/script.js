 const promise1 = new Promise((resolve,reject)=>{
    //  resolve(["apple","orange"])
     reject("failed")

 })

//  const promise2 = new Promise((resolve,reject)=>{
//     //resolve(["banana","grape"])
//     reject("failed")
// })
 
  const data =  async ()=>{
    try{
        const response = await promise1
        console.log(response)
    }catch(err){
        console.log(err)
    }
}

data()