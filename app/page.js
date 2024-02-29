'use client'
import { useEffect, useState } from 'react';
import Logg from '../Components/logg';
import Background from '../Components/background';
import StartText from '../Components/starText';
import Question from '../Components/question';
import { btnStart, containerDiv, CommandStyle, containerDivTwitch, btnTwitch } from './page.module.css'
import { QuestionContainer } from '../Components/styleComponent.module.css'
import LogoTwitch from '../Components/logoTwitch';

const Tmi = require("tmi.js");
let client;

let clientID_ = process.env.NEXT_PUBLIC_ClientID;
let secretID_ = process.env.NEXT_PUBLIC_SecretID;


export default function Home() {

  const [preguntas, setPreguntas] = useState([]);
  const [users, setUsers] = useState([]);
  const [rta, setRta] = useState([]);
  const [load, setLoad] = useState([]);
  const [logg, setLogg] = useState([]);
  const [start, setStart] = useState(false);
  const [twitch, setTwitch] = useState(false);
  const [broadcaster, setBroadcaster] = useState("");
  const [userReply, setUserReply] = useState("");
  const [disconnect, setDisconnected] = useState(false);
  const [innerHeight, setInnerHeight] = useState('');
  const [maxStage, setMaxStage] = useState(10);


  const getQuestion = async () => {
    const ftch = await fetch('/api/preguntas');
    const response = await ftch.json();

    let qa = [];
    for (let ii = 0; ii < maxStage; ii++) {
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

  const connectChannel = async () => {
    getQuestion();

    await client.connect().catch((err) => {
      console.log(err.message) 
    });
    
    setTwitch(true);

    return () => {
      setDisconnected(true);
      client.disconnect();
    }
  }

  const setOptionsChannels = (user, password) => {
    client = new Tmi.Client({
      options: {
        debug: false,
        reconnect: true
      },
      identity: {
        username: user,
        password: password
      },
      channels: [user]
    });
    connectChannel();
    setBroadcaster(user);
  }

  const getAccount = async (token) => {
    await fetch('https://api.twitch.tv/helix/users',
      {
        headers: {
          "Client-Id": clientID_,
          "Authorization": `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(obj => {
        // console.log(obj.data)
        let myObj = obj.data[0];
        setOptionsChannels(myObj.login, "oauth:"+token)
      })
  }

  const ApiConnect = async () => {
    let code = '';
    let codeSessionStorage = '';
    if (location.search != '') {
      code = location.search.split("=")[1].split("&")[0]

      if (sessionStorage.getItem("code") != null) {
        codeSessionStorage = sessionStorage.getItem("code");
        // connectChannel();
      }
    }

    if (code != codeSessionStorage) {
      sessionStorage.setItem("code", location.search.split("=")[1].split("&")[0]);

      await fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientID_}&client_secret=${secretID_}&code=${code}&grant_type=authorization_code&redirect_uri=${location.origin}`, {
        method: "POST",
      })
        .then(res => res.json())
        .then(data => {
          // console.log(data)
          if (data != undefined) {
            getAccount(data.access_token);
          }
        })
        .catch(err => {
          //console.log(err.message)
        });
    }
    else {
      setTwitch(false);
    }
  }


  useEffect(() => {

    if (localStorage.getItem("load") == undefined) {
      localStorage.setItem("load", true);
      ApiConnect();
    }
    else {
      localStorage.removeItem("load")
    }

    if(localStorage.getItem("maxQuestion") != undefined || localStorage.getItem("maxQuestion") != null){
      setMaxStage(localStorage.getItem("maxQuestion"))
    }
    else{
      localStorage.setItem("maxQuestion", maxStage)
    }

    setDefaultLocalStorage();
    setInnerHeight(window.innerHeight + "px");
    // console.log(twitch);

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

    if (message.startsWith('!quest')) {
      try {

        if (start) {
          new Error("La partida esta empezada");
        }
        let num = parseInt(message.split('!quest')[1].trim());
        setMaxStage(num);

        sendMessageChat(channel, `${username} se ha establecido ${num} preguntas`);

        localStorage.setItem('maxQuestion',num);

      } catch (error) {
        setLoggable(error.message);
      }
    }

    systemManager();
  }

  useEffect(() => {

    try {
      client.on('message', async (channel, userState, message) => {
        const { username } = userState;

        if (!username) {
          return;
        }

        await MessageCommands(channel, message, username);

      });

      return () => {
        client.removeAllListeners('message')
      }
    } catch (error) {

    }

  }, [users, rta, logg, start, broadcaster, twitch, maxStage]);

  useEffect(() => {
    try {
      // console.log(client)
      client.disconnect();
    } catch (error) {

    }
  }, [disconnect])

  const resetMessage = () => {
    setUserReply("");
    setRta("");
  }

  return (
    <>
      <Background start={start} setLogg={setLogg} setUsers={setUsers} users={users}>
        {
          (!start) ?
            (twitch) ?
              <div className={containerDiv}>
                <button className={btnStart} onClick={() => {
                  setStart(true);
                  getQuestion();
                }}>
                  <StartText />
                </button>
              </div>
              :
              <>

                <div className={containerDivTwitch}>
                  <button className={btnTwitch} onClick={() => {
                    location.href = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${clientID_}&redirect_uri=${location.origin}&scope=chat%3Aread+chat%3Aedit`;
                  }}>
                    <LogoTwitch />
                    Login in Twitch
                  </button>
                </div>
              </>
            :
            <div className={QuestionContainer}>
              <Question question={preguntas} rta={rta} setLoggable={setLoggable} userReply={userReply}
                cleanLogManager={cleanLogManager} resetMessage={resetMessage} broadcaster={broadcaster}
                maxStage={maxStage} setStart={setStart} />
            </div>
        }
        <div className={CommandStyle}>
          <h1><u>Comandos </u></h1>
          <br />
          <h2>!join: Para unirse</h2>
          <br />
          <h2>!left: Para salirse</h2>
          <br />
          <h2>!rta [numero] : Para responder(Ej: !rta 1)</h2>
          <br />
          <h2>!quest [numero] : Para establecer un maximo de preguntas(Ej: !quest 1)</h2>
        </div>
        <Logg event={logg} innerHeight={innerHeight} />
      </Background>
    </>
  )
}
