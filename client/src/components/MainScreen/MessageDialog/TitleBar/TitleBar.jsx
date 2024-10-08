import { useState,useEffect,useRef,useMemo } from "react";
import { useCtx } from "../../AppScreen";
import single from '/single.svg'
import group from '/group.svg'
import options from '/options.svg'
import bell from '/bell.svg'
import report from '/report.svg'
import leave from '/leave.svg'


export default function (props){
    
    const {chatID,db,chatdata,socket,profiles,userID}=useCtx()
    let chat=(chatdata)&&chatdata[chatID.id]||{};
    const [status,setStatus]=useState('') 
    const [user,setUser]=useState(null);
    const option=useRef();
    
    useEffect(()=>{
      setUser(profiles[userID.current]);
      
    },[chat,profiles])
     useEffect(()=>{
      setStatus((chat.type=='group')?`${(chat.users&&chat.users.length)} member`:chat.type)
     
    },[chat])
    
    const leaveChat=()=>{ 
      console.log("emit")
      try{
        socket.current.emit('leaveChat',{id:chatID.id,del:true});
        option.current.classList.toggle('hidden');
      }
    catch(e){console.log(e)}  
    }
    
    //socket.current.emit('reportChat',chatID.id);
    const reportChat=()=>{
     socket.current.emit('reportChat',chatID.id);
    }
    const muteChat=()=>{
      socket.current.emit('muteChat',chatID.id);
    }
    useEffect(()=>{
        if(option.current){
          option.current.classList.add('hidden');
            
        }
    },[chatID])
   return( 
      <div className="w-full  rounded-t-xl ">
      <div className="  w-full shadow-sm  border-b  p-2   pl-4 justify-between items-center  h-14 bg-white flex">
          
        <div className="flex"> 
         <button onClick={()=>{
          props.setDialog(1);}} className="outline-none  border-none rounded-full h-fit w-fit"> 
           <img className=" w-10 h-10 border p-1  rounded-full"
            src={chat.img||(chat.type!='group')?single:group} style={{backgroundColor:'white'}}>
           </img>
         </button>        
        <div className="p-2 pt-1 flex flex-col ">
         <div className="text-sm w-36 text-ellipses font-semibold">{chat.name||"Unnamed"}</div>
         <div className="text-xs text-gray-400">{status}
         </div>
        </div>
        </div>
        <div className="flex items-center">
        {(user&&(chatID.type!='user'&&(!user.Chats.includes(chatID.id))))&&<button className=" shadow-lg mr-2 rounded-full bg-blue-300 w-24 font-bold text-gray-100 " onClick={()=>{socket.current.emit("join",[chatID.id])}}>Join</button>}
   
        <button onClick={
          ()=>{
            if(option.current){
              option.current.classList.toggle('hidden')
            
            }
            }
        
        }>
        <img className=" w-4 h-8   rounded-full"
            src={options} >
           </img>
        </button>
      
        </div>
    </div>
   
    <div ref={option} onClick={((event)=>{
          option.current.classList.toggle('hidden');
          option.current.removeEventListener('mouseLeave',(event)=>{
          option.current.classList.toggle('hidden');
        })})}
         onMouseLeave={(event)=>{
          option.current.classList.toggle('hidden');
         }}
         className=" p-1  w-fit mt-4 ring-red-100 opacity-80 h-fit z-10 bg-white rounded-lg  justify-start  flex-col shadow fixed right-12 pt-3 pb-3 pl-1 pr-2 hidden">
              <button onClick={muteChat} className="rounded-lg pl-2 pr-2 flex w-full">
              <img src={bell}  className="w-4 h-6  mr-1"></img><div>Mute</div></button>
              <button onClick={reportChat}  className=" rounded-lg  pl-2 pr-2 flex w-full">
              <img src={report}  className="w-4 h-6 mr-1 mt-1"></img><div>Report</div></button>
              <button onClick={leaveChat} className="rounded-lg  pl-2 pr-2 flex w-full mt-0">
              <img src={leave}  className="w-4 h-6  mr-1"></img><div>{(chat.type=='group')?'Leave':'Remove'}</div></button>
            
    </div>
   </div>  
  );
}