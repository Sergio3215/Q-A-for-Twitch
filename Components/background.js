import { useEffect, useState } from 'react';
import { imgBackgroundContainer, colorBackgroundContainer, btnCustom,
    btnCustomContainers } from './styleComponent.module.css';

export default function Background({ start, children, setLogg, setUsers, users }) {

    const [logg, setLogger] = useState(false);
    const [user, setUser] = useState(false);

    useEffect(()=>{
        let usrs = localStorage.getItem('user') != null;
        setUser(usrs);
        let loggs = localStorage.getItem('logg') != null;
        setLogger(loggs);
    })

    return (
        <>
            <div className={btnCustomContainers}>
                {
                   logg?
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
                    users.length > 0?
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

                    <div className={imgBackgroundContainer}>
                        {children}
                    </div>
                    :
                    <div className={colorBackgroundContainer}>
                        {children}
                    </div>
            }
        </>
    )
}