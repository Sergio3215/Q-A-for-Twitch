import TwLogo from "../public/Twitch Icon.svg"
import {twLogo} from "../app/page.module.css"
export default function LogoTwitch() {
    return (
        <>
            <img src={"/Twitch Icon.svg"} alt="twlogo" height={"80px"} width={"80px"} className={twLogo}/>
        </>
    )
}