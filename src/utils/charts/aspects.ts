import { aspectProperties } from "../external/aspects/properties";
import type { aspect } from "../external/aspects/types";
import type { Svg } from "@svgdotjs/svg.js";

type drawAspectLinesArgs = {
    aspectsData: aspect[];
    percentages: number[];
    centerX: number;
    centerY: number;
    radius: number;
    drawRef: Svg;
};

export const drawAspectLines = ({
    aspectsData,
    percentages,
    centerX,
    centerY,
    radius,
    drawRef,
}: drawAspectLinesArgs) => {
    const aspectRadius = (((percentages[0] - 0.2) / 100) * radius);

    const lineAnglesWithSymbolOnCircle = (centerX: number, centerY: number, radius: number, angle1: number, angle2: number) => {
        const startX = centerX + Math.cos(angle1 * Math.PI / 180) * radius;
        const startY = centerY + Math.sin(angle1 * Math.PI / 180) * radius;
        const endX = centerX + Math.cos(angle2 * Math.PI / 180) * radius;
        const endY = centerY + Math.sin(angle2 * Math.PI / 180) * radius;
        // console.log (`S(x${startX},y${startY}), E(x${endX},y${endY})`)
        // Calculate the midpoint of the line
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;

        // const lineLengthX = endX - startX;
        // const lineLengthY = endY - startY;
        // const lineLength = Math.sqrt(Math.pow(lineLengthX, 2) + Math.pow(lineLengthY, 2));

        const resizeFactor = 0.55;

        
        const deltaX = endX - startX;
        const deltaY = endY - startY;

        const endFirstX = endX - (deltaX * resizeFactor);
        const endFirstY = endY - (deltaY * resizeFactor);

        const startSecondX = startX + (deltaX * resizeFactor);
        const startSecondY = startY + (deltaY * resizeFactor);


        // Calculate the adjusted coordinates for the symbol
        const symbolSpace = 15; // Space for the symbol
        const adjustedSymbolX = midX - (symbolSpace / 2.5);
        const adjustedSymbolY = midY - (symbolSpace / 1.7);

        return [
            [startX, startY, endFirstX, endFirstY],
            [startSecondX, startSecondY, endX, endY],
            [adjustedSymbolX, adjustedSymbolY]
        ];
    };

    const getAspectUnicode = (typeOfAspect: string) => {
        // Map typeOfAspect to aspectProperties and get the Unicode symbol
        const aspectProperty = aspectProperties.find(property => property.type === typeOfAspect);
        return aspectProperty ? aspectProperty.unicode : '';
    };

    const aspectLines = (draw: Svg) => {
        for (let i = 0; i < aspectsData.length; i++) {
            if (aspectsData[i].typeOfAspect !== 'conjunction') {
                const [line1Coords, line2Coords, symbolCoords] = lineAnglesWithSymbolOnCircle(centerX, centerY, aspectRadius, aspectsData[i].angleA, aspectsData[i].angleB);

                // Draw the first line segment
                const line1 = draw.line(line1Coords[0], line1Coords[1], line1Coords[2], line1Coords[3]);
                line1.stroke({ color: '#4682B4', width: 1 });

                // Draw the second line segment
                const line2 = draw.line(line2Coords[0], line2Coords[1], line2Coords[2], line2Coords[3]);
                line2.stroke({ color: '#4682B4', width: 1 });

                // Draw the symbol
                const symbolElement = draw.text(getAspectUnicode(aspectsData[i].typeOfAspect)).move(symbolCoords[0], symbolCoords[1]);
                symbolElement
                .font({ size: 16 })
                .fill('#4682B4');
            }
        }
    };

    aspectLines(drawRef);
    return;
};
