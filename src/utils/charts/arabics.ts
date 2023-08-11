import type { Path, Svg } from "@svgdotjs/svg.js";
import type { arabicPart } from "../external/arabicParts/types";
import type { handleMouseOverPopupArgs } from "~/hooks/usePopup";

type drawArabicPartsArgs = {
    arabicPartsData: arabicPart[];
    percentages: number[];
    radius: number;
    centerX: number;
    centerY: number;
    percentageSign: number;
    drawRef: Svg;
    lineXYCircle: (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => number[];
    createPopup: ({ element, description, paddingX, paddingY, }: handleMouseOverPopupArgs) => void;
    circlePaths: (centerX: number, centerY: number, angle: number, circleRadius: number) => number[];
    rotateSymbol: (angle: number) => number;
}


export const drawArabicParts = ({
    arabicPartsData,
    percentages,
    radius,
    centerX,
    centerY,
    circlePaths,
    createPopup,
    drawRef,
    lineXYCircle,
    percentageSign,
    rotateSymbol

}: drawArabicPartsArgs) => {

    const arabicArray = arabicPartsData;
    const arabicPartAng = arabicArray.map(arabicPart => arabicPart.angle);
    const arabicPartSymbols = arabicArray.map(arabicPart => arabicPart.unicode);

    const arabicLines = (draw: Svg) => {
        // Draw degree marks
        const angles = arabicPartAng;
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const startRadius = ((percentages[1] - 14) / 100) * radius;
        for (let i = 0; i < angles.length; i++) {
            const angle = angles[i]; // Calculate the angle for each line
            const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            line.stroke({ color: '#D3D3D3', width: 1 });
        }
    };

    const createArabicPartCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign) => {
        const textPaths: [Path, number][] = [];
        const circleRadius = (((percentageSign - 8) / 100) * radius);
        for (let j = 0; j < arabicPartAng.length; j++) {
            const startAngle = arabicPartAng[j] - 1;
            const c = circlePaths(centerX, centerY, startAngle, circleRadius);
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
                .attr({ fill: 'none', stroke: 'none' });
            textPaths.push([textPath, rotateSymbol(arabicPartAng[j])]);
        }
        return textPaths;
    };

    const createArabicPartTextsonPath = (draw: Svg, textPaths: [Path, number][]) => {
        for (let i = 0; i < textPaths.length; i++) {
            const text = draw.text(`${arabicPartSymbols[i]}`)
                .font({ size: 9 })
                .fill('#A9A9A9');
            // Position the text along the textPath
            text.path(textPaths[i][0]);
            // @ts-ignore
            text.animate(1).rotate(textPaths[i][1], text.cx(), text.cy()); // eslint-disable-line 
        }
    };

    arabicLines(drawRef);
    createArabicPartTextsonPath(drawRef, createArabicPartCircleTextPaths(drawRef, centerX, centerY, radius, percentageSign));

    return;
}