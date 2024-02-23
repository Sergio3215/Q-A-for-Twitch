import {leterLogger, containerLogger} from './styleComponent.module.css'

export default function Logg({ event, innerHeight }) {

    return (
        <div style={{
            height: innerHeight
        }} className={containerLogger}>
            {
                event.map(
                    e => {
                        return <div className={leterLogger}>
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