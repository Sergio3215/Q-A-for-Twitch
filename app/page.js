'use client'
import { useEffect, useState } from 'react';
import Logg from '../Components/logg';
import Background from '../Components/background';
import StartText from '../Components/starText';
import Question from '../Components/question';
const Tmi = require("tmi.js");

const client = new Tmi.Client({
  options: { 
    debug: true, 
    // reconnect: true 
  },
  identity: {
    username: process.env.NEXT_PUBLIC_user,
    password: process.env.NEXT_PUBLIC_Auth
  },
  channels: ['principiante_en_programar']
});

//Confeti

/*
const jsConfetti = new JSConfetti()

jsConfetti.addConfetti({
        emojis: ['🧦'],
        confettiNumber: 200
      })
 */


export default function Home() {

  const [preguntas, setPreguntas] = useState([]);
  const [users, setUsers] = useState([]);
  const [rta, setRta] = useState([]);
  const [load, setLoad] = useState([]);
  const [logg, setLogg] = useState([]);
  const [color, setColor] = useState('');
  const [image, setImage] = useState('');
  const [start, setStart] = useState(false);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [disconnect, setDisconnected] = useState(false);
  const [innerHeight, setInnerHeight] = useState('');


  const getQuestion = async () => {
    const ftch = await fetch('/api/preguntas');
    const data = await ftch.json();
    setPreguntas(data);
  }

  useEffect(() => {
    getQuestion();
    client.connect().catch((err) => { console.log(err.message) });
    setInnerHeight(window.innerHeight + "px");

    setImage(`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"`);
    setColor("#515760");

    if(localStorage.getItem("user") != null){
      let usrt1 = JSON.parse(localStorage.getItem("user")).data;
      setUsers(usrt1);
    }

    
    if(localStorage.getItem("logg") != null){
      let lg = JSON.parse(localStorage.getItem("logg")).data;
      setLogg(lg);
    }

    return () => {
      setDisconnected(true);
      client.disconnect();
    }
  }, []);

  const setLoggable = (msg)=>{
    let logging = logg;
    logging.push(msg);
    setLogg(logging);
  }

  const sendMessageChat = (channel, msg)=>{
    client.say(channel, msg);
  }

  const systemManager = ()=>{
    localStorage.setItem("user", JSON.stringify({data:users}));
    localStorage.setItem("logg", JSON.stringify({data:logg}));

  }

  const MessageCommands = async (channel, userState, message, username)=>{
    
    if (message.startsWith('!join')) {
      let usr = users;
      if (usr.filter(user => user == username).length == 0) {

        usr.push(username);
        setUsers(usr);

        sendMessageChat(channel, `${username} se ha unido a la partida!`);

        setLoggable(`${username} se ha unido a la partida!`);

        systemManager(users, logg);
      }
      else {
        sendMessageChat(channel, `${username} ya te has unido a la partida!`);
      }

      setLoad(!load);
    }


    if (message.startsWith('!unjoin')) {

      let usr = users;
      if (usr.filter(user => user == username).length > 0) {
        usr = [];
        users.map(u => {
          if (u != username) {
            usr.push(u)
          }
        });
        setUsers(usr);

        sendMessageChat(channel, `${username} se ha salido de la partida!`);

        setLoggable(`${username} se ha salido de la partida!`);
      }
      else {
        client.say(channel, `${username} no te has conectado a la partida!`);
      }
      setLoad(!load);
    }

    if (message.includes('!rta')) {

      let usr = users;
      if (usr.filter(user => user == username).length > 0) {
        
        let cut = message.split('!rta');
        let word = '';

        cut.map(msg => {
          word += msg;
        })

        setLoggable(`${username} ha respondido ${word}`);

        setRta(word);
      }
      else {
        sendMessageChat(channel, `${username} no te has conectado a la partida! \nConectate usando el comando !join`);
      }
      setLoad(!load);
    }
  }

  useEffect(() => {
    client.on('message', async (channel, userState, message) => {
      const { username } = userState;

      if(!username){
        return ;
      }

      await MessageCommands(channel, userState, message, username);

    });

    return () => {
      client.removeAllListeners('message')
    }
  }, [users, rta, logg]);

  useEffect(()=>{
    console.log(client)
    client.disconnect();
  }, [disconnect])

  return (
    <>
      <Background color={color} image={image}>
        {
          (!start) ?
            <div style={{
              position: 'absolute',
              bottom: '40%',
              left: '43.5%',
            }}>
              <button style={{
                borderLeft: '4px solid #3F7244',
                borderRight: '15px solid #3F7244',
                borderTop: '10px solid #3F7244',
                borderBottom: '10px solid #3F7244',
                borderRadius: '50px',
                backgroundColor: "#6BC174",
                width: '494px',
                height: '200px',
                cursor: 'pointer'
              }} onClick={() => {
                setStart(true);
                setColor('#5C77BD');
                setImage('');
              }}>
                <StartText />
              </button>
            </div>
            :
            <>
              <Question />
            </>
        }
        <Logg event={logg} innerHeight={innerHeight} />
      </Background>
    </>
  )
}
