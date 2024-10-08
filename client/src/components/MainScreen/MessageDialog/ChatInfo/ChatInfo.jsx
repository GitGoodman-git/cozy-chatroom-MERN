import background from '/background.jpg'
import single from "/single.svg";
import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useCtx } from "../../AppScreen.jsx";
import edit from "/edit.svg";
import ImageInput from "../../ImageInput.jsx";
import Members from "./Members.jsx";
import Media from './Media.jsx'
import close from '/close.svg'
const Tabs={
  1:Members,
  0:Media
}
export default function (props) {
  const { chatdata, privateChats,socket,setMessageDialog, chatID, profiles, userID } = useCtx();
  const about = useRef();
  const chatname = useRef();
  let chat = chatdata[chatID.id] || {};
  const [aboutSt, setAbout] = useState(chat.about || "null");
  const [chatnameSt, setName] = useState(chat.name || "");
  const [username, setUsername] = useState(chat.users || []);
  const [active,setActive]=useState(Number(!chat.type==='group'));
  useEffect(() => {
    setAbout(chat.about || "null");
    setName(chat.name || "");
    setUsername(chat.username || '');  
    setActive(0)
  }, [chat]);
  const admin =
    userID.current in (chat.admins || []) || userID.current == chat.owner;
  const fileform = useRef({});
  const ActiveTab=Tabs[active];
  
  return (
    <div  className="mt-0 rounded-xl shadow max-w-xl bg-white flex-1 h-full flex-col flex">
      <button onClick={()=>setMessageDialog(0)} className="w-fit fixed m-3 h-fit ">
        <img className="w-6 h-6" src={close}/>
      </button>
      <div style={{
          backgroundImage:`url(${background})`,
        
        }} className="bg-gray-200 rounded-t-xl shadow-sm pl-10 w-full h-44 ">

        <div   className="relative top-20 border-1 w-fit h-fit flex rounded-full">
          <ImageInput
            src={chat.img ? chat.img.src : single}
            fileform={fileform}
            uneditable={!admin}
            callback={() => {
              socket.current.emit("updateChat", {
                cid: chat._id,
                img: fileform.current,
              });
            }}
          />
        </div>
      </div>
      <div className="h-fit pb-6 mt-8 flex  p-4 flex-col">
        <div className=" flex font-bold w-full items-baseline">
          <input
            ref={chatname}
            onChange={(event) => setName(event.target.value)}
            onBlur={() => {
              socket.current.emit("updateChat", {
                cid: chatID.id,
                name: chatname.current.value,
              });
            }}
            style={{ borderColor: chat.color }}
            className=" word-wrap overflow-hidden text-ellipsis min-w-32 border-l-4  mr-1 pl-2 text-bold rounded w-fit text-start  mt-4 text-2xl outline-none"
            value={chatnameSt}
            
          />
          
        </div>
            <input
            ref={chatname}
            onChange={(event) => setUsername(event.target.value)}
            onBlur={() => {
              socket.current.emit("updateChat", {
                cid: chatID.id,
                name: chatname.current.value,
              });
            }}
            style={{ borderColor: chat.color }}
            className=" overflow-hidden text-ellipsis min-w-32   mr-1 text-gray-400 text-sm rounded w-fit text-start   outline-none"
            value={`@${username}`}
            
          />

            
        <div className="  w-full  mt-4 text-gray-400 items-baseline text-base ">
          <textarea
            ref={about}
            onChange={(event) => {
              {
                setAbout(event.target.value);
              }
            }}
            onBlur={() => {
              socket.current.emit("updateChat", {
                cid: chatID.id,
                about: about.current.value,
              });
            }}
            className="outline-none   max-w-md  max-h-16  mr-1 rounded w-fit resize-none overflow-scroll text-start   text-base "
            value={aboutSt}
            
          />

         
        </div>
       </div>
       <div>  
        {(
          <div>
            <div className=" items-center flex w-full shadow-md text-gray-500">
              {chat.type == "group"&&<button className="flex-1  p-2 max-w-32 outline-none    font-semibold pb-1 pt-1 rounded-md  " onClick={()=>setActive(1)}>Members</button>}
              <button className="flex-1 p-2 max-w-32 outline-none  active:bg-blue-100  font-semibold pt-1 pb-1 rounded-md " onClick={()=>setActive(0)}>Media</button>
              {admin&&<button className=" max-w-32 flex-1  outline-none   font-semibold rounded-md p-2 pt-1 pb-1" onClick={()=>setActive(2)}>Permissions</button>} 
            </div>
          </div>
        ) }
       {chat&&<ActiveTab chat={chat} admin={admin}/>}
  
      </div>
    </div>
  );
}
