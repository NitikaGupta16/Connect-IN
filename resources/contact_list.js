// MongoDB database for storing the contact list of all the registered app users 

let mongoose=require('mongoose')

let schema3=mongoose.Schema({
    friends:{
        type:Array
    },
    unique_link:{
        type:String
    }
})

let contacts=mongoose.model('contact',schema3)

module.exports=contacts;

