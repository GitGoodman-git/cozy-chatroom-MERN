import React, { useMemo } from "react";
import { useState,useRef,useEffect} from "react";
import { useCtx }  from "../../AppScreen";
import Message from './Message/Message';

import send from '/send.svg';
import reply from '/reply.svg';
const MessageBar=React.memo((props)=>{
  const {setMessages,db,scrollable,profiles,userID,chatID,socket}=useCtx()
        
  const [message,setMessage] = useState("");
      const ref=useRef(null);
      let [user,setUser]=useState(profiles[userID.current]);
      useEffect(()=>{
        setUser(profiles[userID.current])
      },[profiles]
      );
      console.log(user,userID.current)
      async function SendMessage(event){
              event.preventDefault();
              const id=new Date().toUTCString();
              let msg={
                _id:id,
                uid:userID.current,
                content:message,
                mid:id,
                cid:chatID.id,
                time:new Date(),
                reply:(props.reply)?props.reply[0]._id:null,
                updatedAt:new Date(),
                status:'⧖'
              };
              if(db)db.transaction("messages","readwrite").objectStore("messages").put(msg);
              setMessages((prev)=>{
                   const obj={...prev};
                   obj[chatID.id]={...(obj[chatID.id]||{}),...{[msg._id]:msg}};
                   return obj;                              
                });
              socket.current.emit((chatID.type=='user')?'createChatPrivate':'sendMessage',{cid:chatID.id,content:message,replace:id,reply:msg.reply})
              console.log(msg)
              setMessage("");
             
              if(reply)props.setReply()
              scrollable.current.scrollTo(0,scrollable.current.scrollHeight);
            }
        useEffect(()=>{
         if(ref.current)ref.current.style.height='auto'
        },[message])
        const replyTo=useMemo(()=>{
        if(props.reply){ 
          console.log(props.reply)
          const m=props.reply[0]
          const p=props.reply[1]      
        
        return <div style={{borderLeft:(p.color||'red')}} className="flex items-center  border-l-2 rounded-t-lg  p-1">
           <img src={reply} className="w-7 h-7 mr-2"></img>
          <div className="flex-1 rounded-md pl-2 bg-opacity-20" style={{}}>    
          <div style={{color:p.color}} className="text-xs font-semibold ">
          {p.name} 
          </div>
          <div className="h-auto text-sm">
          {m.content}
         </div>
         </div>
          </div>
        }
        else return null;
      },[props.reply])

      return( 
      <div className=" m-4 flex justify-center items-center bg-transparent overflow-x-hidden  shadow-md p-1 rounded-lg ">          
        {replyTo}
        {(user&&user.Chats.includes(chatID.id))?
        <div className="p-1 rounded-md shadow-md  bg-gray-100 w-full flex items-end">
         <textarea rows='1' onKeyDown={(event)=>{
          if(event.ctrlKey&&event.key=='Enter'){
            SendMessage(event);
            ref.current.style.height='auto';
               
          }
            }} ref={ref} onInput={function(){
          ref.current.style.height='auto';
          
          ref.current.style.height=ref.current.scrollHeight+'px';
         }} className="rounded-md pt-3 align-bottom bg-gray-100 text-sm max-h-36 w-full outline-none border-none min-h-11 h-auto  p-2 text-gray-500 resize-none" placeholder="Write your message..." type="text" onChange={(event)=>setMessage(()=>event.target.value)} value={message}> 
         </textarea>
         <img  src={send} className=" w-10 mb-2 h-6 " onClick={SendMessage}></img>
        </div>
        :null
        }
      </div>
      )
      
    

});
export default MessageBar;
