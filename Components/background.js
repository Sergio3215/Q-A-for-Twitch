import { useEffect, useState } from 'react';
import {
    imgBackgroundContainer, colorBackgroundContainer, btnCustom,
    btnCustomContainers
} from './styleComponent.module.css';

export default function Background({ start, children, setLogg, setUsers, users }) {

    const [logg, setLogger] = useState(false);
    const [user, setUser] = useState(false);
    const [heigth, setHeigth] = useState(false);
    const [width, seWidth] = useState(false);

    useEffect(() => {
        let usrs = localStorage.getItem('user') != null;
        setUser(usrs);
        let loggs = localStorage.getItem('logg') != null;
        setLogger(loggs);
        
        setHeigth(innerHeight);
        seWidth(innerWidth);
        window.addEventListener('resize', () => {
            setHeigth(innerHeight);
            seWidth(innerWidth);
        });
    },[]);

    return (
        <>
            <div className={btnCustomContainers}>
                {
                    logg ?
                        <button onClick={() => {
                            localStorage.removeItem('logg');
                            setLogger(false);
                            setLogg([])
                        }} className={btnCustom}>
                            Clear Log
                        </button>
                        :
                        <></>
                }

                {
                    users.length > 0 ?
                        <button onClick={() => {
                            localStorage.removeItem('user');
                            setUser(false);
                            setUsers([]);
                        }} className={btnCustom}>
                            Clear all users
                        </button>
                        :
                        <></>
                }
            </div>
            {
                (!start) ?

                    <div className={imgBackgroundContainer} style={{
                        height: heigth,
                        width: width
                    }}>
                        {children}
                    </div>
                    :
                    <div className={colorBackgroundContainer} style={{
                        height: heigth,
                        width: width
                    }}>
                        {children}
                    </div>
            }
        </>
    )
}