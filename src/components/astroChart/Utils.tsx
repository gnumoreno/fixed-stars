import { useEffect, useState } from "react";

export type ChartPopupProps = {
    description: string | null,
    x: number,
    y: number
}

export const ChartPopup: React.FC<ChartPopupProps> = ({
    description,
    x,
    y
}) => {
    const [previousDescription, setPreviousDescription] = useState<string | null>(null);

    useEffect(() => {
        if (description !== null) {
            setPreviousDescription(description);
        }
    }, [description]);

    return (
        <div style={{
            position: 'absolute',
            left: x,
            top: y,
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid black',
            borderRadius: '5px',
            zIndex: 100,
            opacity: description === null ? 0 : 1,
            pointerEvents: description === null ? "none" : "auto",
            transition: 'opacity 0.2s ease-in-out',
            whiteSpace: 'pre-line'
        }}>
            <p
            style={{
                fontSize: '12px',
            }}
            >
                {
                    description === null
                        ?
                        previousDescription
                        :
                        description
                }
            </p>
        </div>
    )
}