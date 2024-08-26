import React,{useRef,useMemo,useEffect, useCallback, useState} from "react";
import { useCtx } from "../AppScreen";
import Messages from "./Messages";
import TitleBar from "./TitleBar";
import ChatInfo from "./ChatInfo/ChatInfo";
import UserInfo from "./UserInfo/UserInfo";

//import UserInfo from "../ChatsDialog/UserInfo/UserInfo";
const dialogs={
    0:Messages,
    1:ChatInfo,
    2:UserInfo,
    3:({setDialog})=>{
      return <UserInfo setDialog={setDialog} infoPanel={{current:null}}/>}
    }
  
const  MessageDialogComponent=(function MessageDialog({}){
    const infoPanel=useRef('');
    const {messageDialog,setMessageDialog}=useCtx()
    const Component=dialogs[messageDialog]  
    const element=useRef();
    return( 
    <div className="p-1 pt-2 h-screen w-full w-max-xl flex flex-col ">
     <TitleBar setDialog={setMessageDialog}/>
     <div  className="flex rounded-lg  flex-col flex-1 w-full overflow-hidden"> 
     <div className="rounded-lg flex w-full h-full p-2 ">
       {<Component setDialog={setMessageDialog} infoPanel={infoPanel}/>}
     </div>
     </div> 
   </div>
)
})


export default MessageDialogComponent;