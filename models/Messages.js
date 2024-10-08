const mongoose=require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Messages=new mongoose.Schema
({   
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chats',
        required:true  
    },
    content:String, 
    type:{
     type:String,
     required:true,
     default:"text"
   },
   uid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    reply_to:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Messages',
        default:null
    },
    status:{
        type:String,
        default:'✔',
        enum:['✔','✔✔']  // pending, seen, read status for messages in a chat room.
     },
    
},
   {timestamps:true}
)

Messages.index({content:'text'})
Messages.plugin(AutoIncrement, { inc_field: 'mid', start_seq: 0 });

const MessageModel=mongoose.model('Messages',Messages);

module.exports=MessageModel;

