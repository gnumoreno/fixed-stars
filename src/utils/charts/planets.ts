import type { Path, Svg } from "@svgdotjs/svg.js";
import type { planet } from "../external/planets/types";
import type { handleMouseOverPopupArgs } from "~/hooks/usePopup";

type drawPlanetsArgs = {
    planetsData: planet[];
    percentages: number[];
    radius: number;
    centerX: number;
    centerY: number;
    percentageSign:number;
    drawRef: Svg;
    lineXYCircle: (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => number[];
    createPopup: ({ element, description, paddingX, paddingY, }: handleMouseOverPopupArgs) => void;
    circlePaths: (centerX: number, centerY: number, angle: number, circleRadius: number) => number[];
    rotateSymbol: (angle: number) => number;
};


export const drawPlanets = ({
planetsData,
centerX,
centerY,
percentages,
radius,
percentageSign,
drawRef,
createPopup,
lineXYCircle,
circlePaths,
rotateSymbol
}: drawPlanetsArgs) => {


    const planetAngles = planetsData.map((planet) => planet.angle);
    const planetSymbols = planetsData.map((planet) => planet.unicode);
    const planetPos = planetsData.map((planet) => {
        return {
            deg: planet.longDegree, min: planet.longMinute, sec: planet.longSecond
        }
    });

    const adjustPlanetAngles = (angles: number[]) => {
        const adjustedAngles: number[] = angles.map((angle) => angle);
        for (let i = 0; i < angles.length; i++) {
            for (let j = i + 1; j < angles.length; j++) {
                const angle1 = adjustedAngles[i];
                const angle2 = adjustedAngles[j];
                const diff = Math.abs(angle1 - angle2);
                if (diff < 4) {
                    const shift = (3 - diff) / 2;

                    if (angle1 < angle2) {
                        adjustedAngles[i] = angle1 - (shift - 1);
                        adjustedAngles[j] = angle2 + (shift + 1);
                    } else {
                        adjustedAngles[i] = angle1 + shift;
                        adjustedAngles[j] = angle2 - shift;
                    }
                }
            }
        }
        return adjustedAngles;
    };

    const planetLines = (draw: Svg) => {
        // Draw degree marks
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const startRadius = ((percentages[1] - 4) / 100) * radius;
        for (let i = 0; i < planetAngles.length; i++) {
            const angle = planetAngles[i];
            // const angle = (angles[i] + 180) * -1 ; // Calculate the angle for each line
            const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            line.stroke({ color: '#6495ED', width: 2 });
        }
    };

    const createPlanetCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign:number) => {
        const textPaths: [Path, number][] = [];
        const circleRadius = (((percentageSign - 1) / 100) * radius);
        const planetAnglesadjusted = adjustPlanetAngles(planetAngles);
        for (let j = 0; j < planetAnglesadjusted.length; j++) {
            const startAngle = (planetAnglesadjusted[j] - 2);
            const c = circlePaths(centerX, centerY, startAngle, circleRadius);
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
                .attr({ fill: 'none', stroke: 'none' });
            textPaths.push([textPath, rotateSymbol(planetAnglesadjusted[j])]);
        }
        return textPaths;
    };

    const createPlanetTextsonPath = (draw: Svg, textPaths: [Path, number][]) => {
        for (let i = 0; i < textPaths.length; i++) {
            const text = draw.text(`${planetSymbols[i]}`)
                .font({ size: 20 })
                .fill('#4682B4');
            // Position the text along the textPath
            createPopup({
                element: text,
                description: `${planetPos[i].deg}° ${planetPos[i].min}' ${planetPos[i].sec}"`,
            })

            text.path(textPaths[i][0]);
            // @ts-ignore
            text.animate(1).rotate(textPaths[i][1], text.cx(), text.cy()); // eslint-disable-line 
        }
    };

    planetLines(drawRef);
    createPlanetTextsonPath(drawRef, createPlanetCircleTextPaths(drawRef, centerX, centerY, radius, percentageSign));

    return;
}