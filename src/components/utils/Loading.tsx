import React from 'react'

type Error = {
    message?: string
}

export const Loading: React.FC<Error> = ({ message }) => {
    return (
        <>
            {
                !!message
                    ?

                    <p>{message}</p>

                    :
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%'
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', background: "none", display: 'block', shapeRendering: 'auto' }} width="60px" height="60px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                            <path d="M10 50A40 40 0 0 0 90 50A40 45 0 0 1 10 50" fill="#1a1a1a" stroke="none">
                                <animateTransform attributeName="transform" type="rotate" dur="1s" repeatCount="indefinite" keyTimes="0;1" values="0 50 52.5;360 50 52.5"></animateTransform>
                            </path>
                        </svg>
                    </div>

            }
        </>
    )
}