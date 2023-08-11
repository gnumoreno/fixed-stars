import type { Path, Text, Rect, Ellipse, Line, Image, G, Svg } from "@svgdotjs/svg.js";
import { useState } from "react";
import type { ChartPopupProps } from "~/components/astroChart/Utils";

export type handleMouseOverPopupArgs = {
    element: Text | Path | Rect | Ellipse | Line | Image | G | Svg,
    description: string | null,
    paddingX?: number,
    paddingY?: number,
}

export const usePopup = () => {
    const [popupProps, setPopupProps] = useState<ChartPopupProps>({
        description: null,
        x: 0,
        y: 0,
    })

    const handleMouseOverPopup = ({
        element,
        paddingX,
        paddingY,
        description,
    }: handleMouseOverPopupArgs) => {
        // x: 350 y:450
        // console.log(`x: ${Number(element.x())}, y: ${Number(element.y())}`)
        const x = Number(element.x())
        const y = Number(element.y())
        let finalX = 0;
        let finalY = 0;
        if (x >= 400) {
            finalX = x - ((paddingX || 0) * 10);
        } else {
            finalX = x + (paddingX || 0);
        }
        if (y <= 400) {
            finalY = y - ((paddingY || 0)/4);
        } else {
            finalY = y + (paddingY || 0);
        }

        // const x = Number(element.x()) + (paddingX || 0);
        // const y = Number(element.y()) + (paddingY || 0);
        setPopupProps({
            description: description,
            x: finalX,
            y: finalY,
        })
    }

    const handleMouseOutPopup = () => {
        setPopupProps((prev) => {
            return {
                ...prev,
                description: null,
            }
        })
    }

    const createPopup = ({
        element,
        description,
        paddingX,
        paddingY,
    }: handleMouseOverPopupArgs) => {



        // Padding optional. Default is x = 12, y = -85
        const dx = paddingX || 12;
        const dy = paddingY || -85;

        element.mouseenter(() => {

            handleMouseOverPopup({
                element: element,
                description: description,
                paddingX: dx,
                paddingY: dy,
            })
        });
        element.touchstart(() => {
            handleMouseOverPopup({
                element: element,
                description: description,
                paddingX: dx,
                paddingY: dy,
            })
        });
        element.touchend(() => {

            setTimeout(() => {
                handleMouseOutPopup();
            }, 1000)
        });
        element.mouseleave(() => {
            handleMouseOutPopup();
        });

        // Adding styles for the element that has popup, like cursor: pointer

        element.css({
            cursor: "pointer",
        })
    }

    return {
        popupProps,
        createPopup,
    }
}