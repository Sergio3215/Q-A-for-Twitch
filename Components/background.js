import {imgBackgroundContainer, colorBackgroundContainer} from './styleComponent.module.css';

export default function Background({ start, children }) {
    return (
        <>
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