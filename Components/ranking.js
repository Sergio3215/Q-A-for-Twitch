import { RankingContainer, btnReset } from './styleComponent.module.css';

export default function Ranking({ profile, gameRestart }) {

    return (
        <>

            <div className={RankingContainer}>
                <div>
                Ranking de esta Partida
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Participante</th>
                                <th>Puntos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                profile.map(prf => {
                                    return (
                                        <tr>
                                            <td>{prf.name}</td>
                                            <td>{prf.point}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
                <div>
                    <button className={btnReset} onClick={() => gameRestart()}>Volver al Inicio</button>
                </div>
            </div>
        </>
    )
}