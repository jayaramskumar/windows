const mongoClient = require('mongodb').MongoClient
let database={
    name:null
}
module.exports.connect = function(done){
    const url = "mongodb+srv://Jayaram123:121144169@cluster0.lhhlu.mongodb.net/?retryWrites=true&w=majority"
    const dbname = "shopping"
    mongoClient.connect(url,(err,client)=>{
        if(err) return done(err)
        database.name=client.db(dbname)
    })
    done()
}

module.exports.get = function(){
    return database.name
}