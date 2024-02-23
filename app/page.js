'use client'
import { useEffect, useState } from 'react';
import Logg from '../Components/logg';
import Background from '../Components/background';
import StartText from '../Components/starText';
import Question from '../Components/question';
import {btnStart, containerDiv} from './page.module.css'

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
      <Background start={start}>
        {
          (!start) ?
            <div className={containerDiv}>
              <button className={btnStart} onClick={() => {
                setStart(true);
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
