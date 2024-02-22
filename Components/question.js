export default function Question({ question }) {

    return (
        <>
            <div style={{
                position: 'absolute',
                bottom: '34%',
                left: '44%',
                width: "451px",
                height: "344px",
                backgroundColor: '#FFE3BA',
                borderRadius: "17px",
                textAlign: "center",
                fontFamily: "Inter"
            }}>
                <div style={{
                    backgroundColor: '#461485',
                    width: "451px",
                    height: "83px",
                    borderTopRightRadius:"17px",
                    borderTopLeftRadius:"17px",
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    color:"white",
                    textShadow:"1px 1px 1px black",
                    fontSize:"36px",

                }}>
                    Stage Question
                </div>
                <div style={{
                    backgroundColor: '#FFE3BA',
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color:"#55452E",
                    textShadow:"1px 1px 1px black",
                    fontSize:"36px",
                    marginTop:"22%"
                }}>
                    {question || "No hay pregunta"}
                </div>
            </div>
        </>
    )
}