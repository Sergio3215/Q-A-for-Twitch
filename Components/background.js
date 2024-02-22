export default function Background({ color, image, children }) {
    return (
        <>
            {
                (image != '' && image != undefined) ?

                    <div style={{
                        backgroundImage: image,
                        backgroundColor: color,
                        width: "100%",
                        height: "100%",
                    }}>
                        {children}
                    </div>
                    :
                    <div style={{
                        backgroundColor: color,
                        width: "100%",
                        height: "100%",
                    }}>
                        {children}
                    </div>
            }
        </>
    )
}