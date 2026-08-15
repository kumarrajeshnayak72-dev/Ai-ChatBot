const mongoose = require('mongoose');

const connectToDb = ()=>{
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("Connected To Db");
        
    }).catch((err)=>{
        console.log(err);
        
    })
}

module.exports = connectToDb