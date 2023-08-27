import React, { useContext, useEffect, useRef, useState } from 'react'
import Logo from '../assets/Login'
import { UserContext } from '../context/UserContext';
import { uniqBy } from 'lodash';
import axios from 'axios';
function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const { username, id } = useContext(UserContext);
  //for sending message
  const [newMessageText, setNewMessageText] = useState('');

  const [messages, setMessages] = useState([]);
  //to auto scroll when new message comes
  const divUnderMessages = useRef();


  useEffect(() => {
    connectToWs();
  }, []);
  function connectToWs() {
    //web socket server
    const ws = new WebSocket('ws://localhost:4040')
    setWs(ws);
    //message,close is keyword here don't change
    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', () => {
      //Need to re-connect in case server gets restarted
      setTimeout(() => {
        console.log('ws: Disconnected.Trying to reconnect ')
        connectToWs();
      }, 1000);
    })
  }
  function showOnLinePeople(peopleArray) {
    //console.log(peopleArray);
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    // console.log(people);
    setOnlinePeople(people);
  }
  //handling online users
  function handleMessage(e) {
    const messageData = JSON.parse(e.data);
    //console.log(messageData);
    //for dealing with online people function
    if ('online' in messageData) {

      showOnLinePeople(messageData.online);
    }
    //for dealing with incoming message from sender
    else if ('text' in messageData) {

      //console.log(messageData);
      setMessages(prev => ([...prev, { ...messageData }]));

    }

  };
  function sendMessage(e) {
    e.preventDefault();
    console.log("Sending msg");
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
    }));
    setNewMessageText('');
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: id,
      recipient: selectedUserId,
      //Added because messageWithoutDups need _id
      _id: Date.now(),
    }]));
  }
  useEffect(() => {

    //for auto scroll to botton when new message
    const div = divUnderMessages.current;
    if (div)
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    if (selectedUserId) {
      axios.get('/messages/' + selectedUserId).then(res => {
        setMessages(res.data);
      })
    }
  }, [selectedUserId]);

  //Removing owner from Online list
  const onlinePeopleExclOurUser = { ...onlinePeople }
  delete onlinePeopleExclOurUser[id]
  //console.log(messages);
  const messageWithoutDups = uniqBy(messages, '_id');



  return (
    <div className='flex h-screen'>
      <div className='bg-violet-100 w-1/3 ' >
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map(userId => (

          <div key={userId} onClick={() => setSelectedUserId(userId)}
            className={'border-b border-violet-150  flex items-center cursor-pointer gap-2 py-2 pl-4 ' + (userId === selectedUserId ? 'bg-blue-50 rounded' : '')}>
            {userId === selectedUserId && (
              <div className='w-1 bg-blue-500 h-12'></div>
            )}
            <div className="flex items-center gap-2 cursor-pointer" >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="Black" className="w-6 h-6 m-1">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
              </svg>
              {onlinePeople[userId]}
            </div>
            {/* {console.log(onlinePeople[userId])} */}
          </div>
        ))}
      </div>
      <div className='flex flex-col bg-blue-50 w-2/3 p-2'>
        <div className='flex-grow'>
          {!selectedUserId && (
            <div className='flex h-full flex-grow items-center justify-center'>
              <div className='text-gray-300'>Select Person to start</div>
            </div>
          )}
          {!!selectedUserId && (
            <div className='relative h-full'>
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2' >
                {messageWithoutDups.map(message => (
                  <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                    {/* <div className={'text-left inline-block p-2 my-2 rounded-md text-sm' + (message.sender === id ? 'bg-blue-200 text-green-500' : 'bg-white text-gray-500')}> */}
                    <div className={'text-left inline-block p-2 my-2 rounded-md text-sm ' + (message.sender === id ? 'bg-blue-600 text-white' : 'bg-green-300 text-gray-700')}>
                      {/* sender:{message.sender}<br />
                      my id:{id} <br /> */}
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>

          )}
        </div>
        {!!selectedUserId && (
          <form className='flex gap-2' onSubmit={sendMessage}>
            <input type="text"
              value={newMessageText}
              onChange={e => setNewMessageText(e.target.value)}
              placeholder="Type Your Message Here" className='bg-white w-screen border p-2 rounded-sm' />
            <button className='bg-blue-500 rounded-sm p-2 text-white' type='submit'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>

            </button>
          </form>
        )}

      </div>
    </div>
  )
}

export default Chat
