import type { Path, Text, Rect, Ellipse, Line, Image, G, Svg } from "@svgdotjs/svg.js";
import { useState } from "react";
import type { ChartPopupProps } from "~/components/astroChart/Utils";

export const usePopup = () => {
    const [popupProps, setPopupProps] = useState<ChartPopupProps>({
        description: null,
        x: 0,
        y: 0,
    })
    type handleMouseOverPopupArgs = {
        element: Text | Path | Rect | Ellipse | Line | Image | G | Svg,
        description: string | null,
        paddingX?: number,
        paddingY?: number,
    }
    const handleMouseOverPopup = ({
        element,
        paddingX,
        paddingY,
        description,
    }: handleMouseOverPopupArgs) => {
        const x = Number(element.x()) + (paddingX || 0);
        const y = Number(element.y()) + (paddingY || 0);
        setPopupProps({
            description: description,
            x,
            y,
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