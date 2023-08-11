import type { Path, Svg } from "@svgdotjs/svg.js";
import type { planet } from "../external/planets/types";
import type { handleMouseOverPopupArgs } from "~/hooks/usePopup";
import type { house } from "../external/houses/types";

type drawAntisciaArgs = {
    planetsData: planet[];
    housesData: house[];
    percentages: number[];
    radius: number;
    centerX: number;
    centerY: number;
    percentageSign: number;
    ascendantAng: number;
    drawRef: Svg;
    lineXYCircle: (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => number[];
    createPopup: ({ element, description, paddingX, paddingY, }: handleMouseOverPopupArgs) => void;
    circlePaths: (centerX: number, centerY: number, angle: number, circleRadius: number) => number[];
    rotateSymbol: (angle: number) => number;
    planetAntiscia: (planets: planet[], houses: house[]) => number[];
};


export const drawAntiscia = ({
    planetsData,
    housesData,
    centerX,
    centerY,
    percentages,
    radius,
    percentageSign,
    ascendantAng,
    drawRef,
    planetAntiscia,
    createPopup,
    lineXYCircle,
    circlePaths,
    rotateSymbol
}: drawAntisciaArgs) => {

    const antisciaAngles = planetAntiscia(planetsData.slice(0, 7), housesData);
    const planetSymbols = planetsData.map((planet) => planet.unicode);


    const antisciaLines = (draw: Svg) => {
        const angles = antisciaAngles;
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const startRadius = ((percentages[1] - 10) / 100) * radius;
        for (let i = 0; i < angles.length; i++) {
            const angle = (angles[i] + 180) * -1; // Calculate the angle for each line
            const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            line.stroke({ color: '#D3D3D3', width: 1 });
        }
    };

    const createAntisciaPlanetCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign: number) => {
        const textPaths: [Path, number][] = [];
        const circleRadius = (((percentageSign - 4) / 100) * radius);
        for (let j = 0; j < antisciaAngles.length; j++) {
            const startAngle = ((antisciaAngles[j] + 181) * -1);
            const c = circlePaths(centerX, centerY, startAngle, circleRadius);
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
                .attr({ fill: 'none', stroke: 'none' });
            textPaths.push([textPath, rotateSymbol((antisciaAngles[j] + ascendantAng) * -1)]);
        }
        return textPaths;
    };

    const createAntisciaPlanetTextsonPath = (draw: Svg, textPaths: [Path, number][]) => {
        for (let i = 0; i < textPaths.length; i++) {
            const text = draw.text(`${planetSymbols[i]}`)
                .font({ size: 10 })
                .fill('#A9A9A9');
            // Position the text along the textPath
            text.path(textPaths[i][0]);
            // @ts-ignore
            text.animate(1).rotate(textPaths[i][1], text.cx(), text.cy()); // eslint-disable-line 
        }
    };

    antisciaLines(drawRef);
    createAntisciaPlanetTextsonPath(drawRef, createAntisciaPlanetCircleTextPaths(drawRef, centerX, centerY, radius, percentageSign));
    return
}