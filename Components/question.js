import { useEffect, useState } from 'react'
import { questionHeader, questionHeaderLetter, questionBody, timer } from './styleComponent.module.css'
import Answer from './answer';

export default function Question({ maxStage, question, rta, setLoggable, userReply, cleanLogManager, resetMessage, broadcaster, setStart }) {


    const [count, setCount] = useState(30);
    const [stage, setStage] = useState(1);

    useEffect(() => {

        const interval = setInterval(() => {
            let c = count;
            c--;
            if (c == 0 && stage != maxStage) {
                c = 30;

                setTimeout(() => {
                    let s = stage;
                    s++;
                    setStage(s);
                }, 500);
            }

            if (stage != maxStage+1 && !(c < 0)) {
                setCount(c);
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);

    }, [count])

    return (
        <>
            <label className={timer}>{count}</label>
            <div className={questionHeader}>
                <div className={questionHeaderLetter}>
                    Stage {stage}
                </div>
                <div className={questionBody}>
                    {/* {"No hay pregunta"} */}
                    {
                        question[stage - 1].pregunta
                    }
                </div>
            </div>
            <Answer stage={stage} count={count}
                correct={question[stage - 1].respuesta_correcta}
                incorrect={question[stage - 1].respuestas_falsas}
                rta={rta}
                setLoggable={setLoggable}
                userReply={userReply}
                cleanLogManager={cleanLogManager}
                resetMessage={resetMessage}
                broadcaster={broadcaster}
                maxStage={maxStage}
                setStart={setStart}
            />
        </>
    )
}