import { useEffect, useState } from 'react'
import { AnswerBoxLeft, AnswerBoxRight, UserBoxLeft, UserBoxRight, AnswerContaintReply, UserBoxFont } from './styleComponent.module.css'

export default function Answer({ stage, correct, incorrect, count, rta, setLoggable, userReply, cleanLogManager, resetMessage }) {


    // console.log(userReply)

    const [ans1, setAns1] = useState("");
    const [ans2, setAns2] = useState("");

    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");

    const [replyUser1, setReplyUser1] = useState([]);
    const [replyUser2, setReplyUser2] = useState([]);

    const [profile, setProfile] = useState([]);


    const reply = () => {

        if (replyUser1.length > 0) {
            if (replyUser1.filter(user => user == userReply).length > 0) {
                let arr = [];
                replyUser1.map(user => {
                    if (user != userReply) {
                        arr.push(user);
                    }
                });
                setReplyUser1(arr);
            }
        }


        if (replyUser2.length > 0) {
            if (replyUser2.filter(user => user == userReply).length > 0) {
                let arr = [];
                replyUser2.map(user => {
                    if (user != userReply) {
                        arr.push(user);
                    }
                });
                setReplyUser2(arr);
            }
        }

        if (rta.includes("1")) {
            let arrReplyUsers = replyUser1;
            arrReplyUsers.push(userReply);
            setReplyUser1(arrReplyUsers);
        }
        else if (rta.includes("2")) {
            let arrReplyUsers = replyUser2;
            arrReplyUsers.push(userReply);
            setReplyUser2(arrReplyUsers);
        }

        resetMessage();
    }

    useEffect(() => {
        reply();
    }, [rta])

    useEffect(() => {
        let randomNumber = Math.floor(Math.random() * 2);
        randomNumber++;
        // console.log(randomNumber);

        if (randomNumber == 1) {
            setAns1(correct);
            setAns2(incorrect[0]);

            setId1("correct");
            setId2("Incorrect");
        }
        else {
            setAns1(incorrect[0]);
            setAns2(correct);

            setId1("Incorrect");
            setId2("correct");
        }

        // console.log(profile);

    }, [stage, correct, incorrect]);

    useEffect(() => {
        if (count == 1) {
            if (document.getElementById("correct") != null) {
                document.getElementById("correct").style.boxShadow = "1px 1px 60px 2px rgba(44, 255, 125, 0.851)";
            }

            if (document.getElementById("Incorrect") != null) {
                document.getElementById("Incorrect").style.boxShadow = "1px 1px 60px 2px rgba(255, 44, 125, 0.851)";
            }

            if (id1 == "correct") {
                addPoint(replyUser1);
            }

            if (id2 == "correct") {
                addPoint(replyUser2);
            }

            setReplyUser1([]);
            setReplyUser2([]);

        }
        if (count == 30) {
            let arr = ["Incorrect", "correct"];

            arr.forEach(a => {

                if (document.getElementById(a) != null) {
                    document.getElementById(a).style.boxShadow = "1px 1px 60px 2px rgba(0,0,0,14%)"
                }
            });
        }

        if (stage == 4 && count == 0) {
            sendDataDB();
        }

    }, [count]);

    const checkNameProfile = (name) => {
        return profile.filter(pf => pf.name == name).length > 0;
    }

    const updateProfile = (name) => {
        let prof = profile;
        profile.map(
            (p, index) => {
                if (p.name == name) {
                    prof[index] = {
                        name: p.name,
                        point: p.point + 1,
                        date: new Date()
                    }
                }
            }
        );

        setProfile(prof);
    }

    const addPoint = (userProfile) => {
        let prof = profile;

        userProfile.map((up, ii) => {
            let key = checkNameProfile(up);

            if (key) {
                updateProfile(up);
            }
            else {
                prof.push({
                    name: up,
                    point: 1,
                    date: new Date()
                });
            }
        });

        setProfile(prof);

    }

    const sendDataDB = () => {
        //fetch('/api/addUser', {method:"POST",body: JSON.stringify({name:"jhon 1",point:1,date:new Date()})})
        profile.map(async (prf) => {
            await fetch('/api/addPoint',
                {
                    method: "POST",
                    body: JSON.stringify(prf)
                })
        })
    }

    return (
        <div className={AnswerContaintReply}>
            <div className={UserBoxLeft}>
                <div className={AnswerBoxLeft} id={id1}>
                    <label>
                        1
                    </label>
                    <label>
                        {ans1}
                    </label>
                </div>
                <div className={UserBoxFont}>
                    {replyUser1.map(u => {
                        return <>{u} &nbsp;</>
                    })}
                </div>
            </div>
            <div className={UserBoxRight}>
                <div className={AnswerBoxRight} id={id2}>
                    <label>
                        2
                    </label>
                    <label>
                        {ans2}
                    </label>
                </div>
                <div className={UserBoxFont}>
                    {replyUser2.map(u => {
                        return <>{u} &nbsp;</>
                    })}
                </div>
            </div>
        </div>
    )
}