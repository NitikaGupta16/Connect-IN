// MongoDB database for storing the chats of all the registered app users 

let mongoose=require('mongoose')

let schema2=mongoose.Schema({
    room_database:{
        type:String
    },
    message_database:{
        type:String
    }, 
    sender_database:{
        type:String
    },
    time_database : { type : String, default: Date }
})

let chats=mongoose.model('chat',schema2)

module.exports=chats;

