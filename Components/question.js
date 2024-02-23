import {questionHeader, questionHeaderLetter, questionBody} from './styleComponent.module.css'

export default function Question({ question }) {

    return (
        <>
            <div className={questionHeader}>
                <div className={questionHeaderLetter}>
                    Stage Question
                </div>
                <div className={questionBody}>
                    {question || "No hay pregunta"}
                </div>
            </div>
        </>
    )
}