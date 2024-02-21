'use client'
import { useEffect, useState } from 'react';
const Tmi = require("tmi.js")

const client = new Tmi.Client({
  options: { debug: true, reconnect: true },
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
  const [load, setLoad] = useState([]);

  const getQuestion = async () => {
    const ftch = await fetch('/api/preguntas');
    const data = await ftch.json();
    setPreguntas(data);
  }

  useEffect(() => {
    getQuestion();
    client.connect().catch((err) => { console.log(err.message) });
    console.log(client)

    return () => {
      client.disconnect()
    }
  }, [])

  useEffect(() => {
    client.on('message', async (channel, userState, message) => {
      const { username } = userState;


      if (message.startsWith('!join')) {
        let usr = users;
        if (usr.filter(user => user == username).length == 0) {
          usr.push(username);
          setUsers(usr);
          client.say(channel, `${username} se ha unido a la partida!`);
        }
        else {
          client.say(channel, `${username} ya te has unido a la partida!`);
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
          client.say(channel, `${username} se ha salido de la partida!`);
        }
        else{
          client.say(channel, `${username} no te has conectado a la partida!`);
        }
        setLoad(!load);
      }
      
      if (message.startsWith('!reply')) {

        let usr = users;
        if (usr.filter(user => user == username).length > 0) {

        }
        else{
          client.say(channel, `${username} no te has conectado a la partida! \nConectate usando el comando !join`);
        }
        setLoad(!load);
      }

    });

    return () => {
      client.removeAllListeners('message')
    }
  }, [load]);

  return (
    <>
      <div>
        <u>Usuarios conectados</u>
        <div style={{
          display: 'flex',
        }}>
          {
            users.map((u, i) => {
              return <b key={i}>{u} &nbsp;</b>
            })
          }
        </div>
      </div>
      <div>

      </div>
    </>
  )
}
