import React,{useState,useEffect,useRef,useMemo,useCallback} from "react"
import { useCtx } from "../AppScreen";
import up from '/up.svg';
import down from '/down.svg';

export default function (props){
    const {setChatdata,privateChats,socket}=useCtx();
    const ref=useRef('');
    const [target,setTarget]=useState(0);
    const onChange=useCallback(()=>{
        const query=ref.current.value
        if(query)
         socket.current.emit('search',{query:query,target:target})        
        else setChatdata(props.cache.current.chats)
        },[target])

    useEffect(onChange,[target])
    useEffect(()=>{
         socket.current.on('searchResults',(results)=>{
            const dict={};
            const flag=results.target===1;
            results.results.forEach((data)=>{
                if(data){   
                if(flag){
                    if(privateChats.current[data._id])
                        data=props.cache.current.chats[privateChats.current[data._id]]||data     
                    else data.type='user'  
                }

                dict[data._id]=data;
                }
            })
            setChatdata(dict)
        })
    },[])
    return <div style={{display:props.style?'none':'block'}} className=" text-sm w-100 h-12  ml-2 mb-2 mt-2">
     <input ref={ref}  placeholder='Search' className=" border active:outline-none outline-none shadow-sm   rounded-full  w-full h-8 font-roboto p-4"  onChange={onChange}/>
      <div className="flex pt-1 w-full flex-row-reverse text-xs font-semibold">
      <button onClick={()=>{if(target){setTarget(0);onChange()}}} style={{backgroundColor:target!=0?'white':'black',color:target!=0?'black':'white'}} className="mt-1 border-1  rounded-full border-gray-300  pl-2 pr-2">Chats</button>  
      <button onClick={()=>{if(!target){setTarget(1);onChange()}}} style={{backgroundColor:target!=1?'white':'black',color:target!=1?'black':'white'}} className=" mr-1 mt-1 border-1 rounded-full border-gray-300  pl-2 pr-2">Users</button>  
      <button onClick={()=>{if(target){setTarget(2);onChange()}}} style={{backgroundColor:target!=2?'white':'black',color:target!=2?'black':'white'}} className="mt-1 border-1 mr-1 rounded-full border-gray-300  pl-2 pr-2">Messages</button>  
      
     </div>
    </div>
}