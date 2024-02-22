export default function Logg({event, innerHeight}){

    return(
        <div style={{
            maxWidth: '248px',
            backgroundColor: 'rgba(0, 0, 0, 13%)',
            height:innerHeight
        }}>
            {
                event.map(
                    e=>{
                        return <div style={{
                            color:"#F3FBC1",
                            textShadow:"1px 1px 1px black",
                            padding: '20px 15px 20px 15px',
                        }}>{e}</div>
                    }
                )
            }
        </div>
    )
}