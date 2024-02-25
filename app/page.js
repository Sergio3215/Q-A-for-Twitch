'use client'
import { useEffect, useState } from 'react';
import Logg from '../Components/logg';
import Background from '../Components/background';
import StartText from '../Components/starText';
import Question from '../Components/question';
import { btnStart, containerDiv, CommandStyle } from './page.module.css'
import { QuestionContainer } from '../Components/styleComponent.module.css'

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
  const [start, setStart] = useState(false);
  const [userReply, setUserReply] = useState("");
  const [disconnect, setDisconnected] = useState(false);
  const [innerHeight, setInnerHeight] = useState('');


  const getQuestion = async () => {
    const ftch = await fetch('/api/preguntas');
    const response = await ftch.json();

    let qa = [];
    for (let ii = 0; ii < 5; ii++) {
      const numberData = response.pregunta.length - 1;
      const numberRandom = Math.floor(Math.random() * numberData);
      qa.push(response.pregunta[numberRandom]);
    }
    setPreguntas(qa);
  }

  const setDefaultLocalStorage = () => {
    if (localStorage.getItem("user") != null) {
      let usrt1 = JSON.parse(localStorage.getItem("user")).data;
      setUsers(usrt1);
    }

    if (localStorage.getItem("logg") != null) {
      let lg = JSON.parse(localStorage.getItem("logg")).data;
      setLogg(lg);
    }
  }

  useEffect(() => {
    getQuestion();
    setDefaultLocalStorage();

    client.connect().catch((err) => { console.log(err.message) });
    setInnerHeight(window.innerHeight + "px");

    return () => {
      setDisconnected(true);
      client.disconnect();
    }
  }, []);

  const setLoggable = (msg) => {
    let logging = logg;
    logging.push(msg);
    setLogg(logging);
  }

  const sendMessageChat = (channel, msg) => {
    client.say(channel, msg);
  }


  const cleanLogManager = () => {
    if (logg.length > 9) {
      let lg = [];
      logg.map((msg, ii) => {
        if (ii > 0) {
          lg.push(msg);
        }
      });
      setLogg(lg);
      localStorage.setItem("logg", JSON.stringify({ data: lg }));
    }
  }

  const systemManager = () => {
    localStorage.setItem("user", JSON.stringify({ data: users }));
    localStorage.setItem("logg", JSON.stringify({ data: logg }));

    cleanLogManager();

  }

  const MessageCommands = async (channel, message, username) => {

    let usr = users,
      usrNumber = usr.filter(user => user == username).length;

    if (message.startsWith('!join')) {
      if (usrNumber == 0) {
        usr.push(username);
        setUsers(usr);

        sendMessageChat(channel, `${username} se ha unido a la partida!`);

        setLoggable(`${username} se ha unido a la partida!`);
      }
      else {
        sendMessageChat(channel, `${username} ya te has unido a la partida!`);
      }

      setLoad(!load);
    }


    if (message.startsWith('!left')) {

      if (usrNumber > 0) {
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
        sendMessageChat(channel, `${username} no te has conectado a la partida!`);
      }
      setLoad(!load);
    }

    if (message.includes('!rta')) {

      if (usrNumber > 0) {

        let cut = message.split('!rta');
        let word = '';

        cut.map(msg => {
          word += msg;
        })


        if ((word.includes('1') || word.includes('2')) && start) {
          setLoggable(`${username} ha respondido ${word}`);
          setRta(word);
          setUserReply(username)
        }
        else {
          setLoggable((start) ? "No ha ingresado una opcion esperable." : "No se ha iniciado el juego aun.");
        }

      }
      else {
        sendMessageChat(channel, `${username} no te has conectado a la partida! \nConectate usando el comando !join`);
      }
      setLoad(!load);
    }

    systemManager();
  }

  useEffect(() => {
    client.on('message', async (channel, userState, message, self) => {
      const { username } = userState;

      if (!username) {
        return;
      }

      await MessageCommands(channel, message, username);

    });

    return () => {
      client.removeAllListeners('message')
    }
  }, [users, rta, logg, start]);

  useEffect(() => {
    console.log(client)
    client.disconnect();
  }, [disconnect])

  const resetMessage = ()=>{
    setUserReply("");
    setRta("");
  }

  return (
    <>
      <Background start={start} setLogg={setLogg} setUsers={setUsers} users={users}>
        {
          (!start) ?
            <div className={containerDiv}>
              <button className={btnStart} onClick={() => {
                setStart(true);
                getQuestion();
              }}>
                <StartText />
              </button>
            </div>
            :
            <div className={QuestionContainer}>
              <Question question={preguntas} rta={rta} setLoggable={setLoggable} userReply={userReply}
                cleanLogManager={cleanLogManager} resetMessage={resetMessage}/>
            </div>
        }
        <div className={CommandStyle}>
          <h1><u>Comando!</u></h1>
          <br/>
          <h2>!join</h2>
          <br/>
          <h2>!left</h2>
          <br/>
          <h2>!rta [numero] Ej: !rta 1</h2>
        </div>
        <Logg event={logg} innerHeight={innerHeight} />
      </Background>
    </>
  )
}
