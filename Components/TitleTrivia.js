import { TriviaLetter, TriviaContainer } from '../app/page.module.css'
export default function TriviaText() {
    return (
        <>
            <div className={TriviaContainer}>
                <div className={TriviaLetter}>
                    Trivia para Twitch 
                </div><u>_</u>
            </div>
        </>
    )
}