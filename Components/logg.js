import { useEffect, useState } from 'react'
import {leterLogger, containerLogger} from './styleComponent.module.css'

export default function Logg({ event, innerHeight }) {

    const [heigth, setHeigth] = useState(false);
    const [width, seWidth] = useState(false);

    useEffect(()=>{
        setHeigth(innerHeight);
        seWidth(innerWidth);
        window.addEventListener('resize', () => {
            setHeigth(innerHeight);
            seWidth(innerWidth);
        });
    },[])

    return (
        <div className={containerLogger} style={{
            // height:heigth,
            // width:width
        }} >
            {
                event.map(
                    (e, index) => {
                        return <div className={leterLogger} key={index}>
                            <label>
                                {e}
                            </label>
                        </div>
                    }
                )
            }
        </div>
    )
}