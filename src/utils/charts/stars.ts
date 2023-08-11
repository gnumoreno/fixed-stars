import type { Path, Svg } from "@svgdotjs/svg.js";
import type { handleMouseOverPopupArgs } from "~/hooks/usePopup";
import type { aspect, aspectDetails } from "../external/aspects/types";
import type { star } from "../external/stars/types";

type drawStarsArgs = {
    aspectsData: aspect[];
    starsData: star[];
    percentages: number[];
    radius: number;
    centerX: number;
    centerY: number;
    drawRef: Svg;
    lineXYCircle: (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => number[];
    createPopup: ({ element, description, paddingX, paddingY, }: handleMouseOverPopupArgs) => void;
    circlePaths: (centerX: number, centerY: number, angle: number, circleRadius: number) => number[];
    getStarAspects: (aspects: aspect[]) => aspectDetails[];
};


export const drawStars = ({
    starsData,
    aspectsData,
    centerX,
    centerY,
    percentages,
    radius,
    drawRef,
    createPopup,
    lineXYCircle,
    circlePaths,
    getStarAspects,
}: drawStarsArgs) => {

    const someStars = getStarAspects(aspectsData).map((star) => star.astroB.name);
    const starInfo = starsData.filter(star => {
        return someStars.includes(star.name)
    }).map((star) => {
        return{
            angle:star.angle, deg:star.longDegree, min:star.longMinute, sec:star.longSecond, name:star.name, nature:star.nature, magnitude:star.magnitude, 
        }
    });
    const uniqueStarInfo = starInfo.filter((star, index) => starInfo.indexOf(star) === index);
    
    const adjustStarAngles = (angles: number[]) => {
        const adjustedAngles: number[] = angles.map((angle) => angle);
      
        // First, remove any repeated angles (diff === 0)
        for (let i = 0; i < adjustedAngles.length; i++) {
          for (let j = i + 1; j < adjustedAngles.length; j++) {
            if (adjustedAngles[i] === adjustedAngles[j]) {
              adjustedAngles.splice(j, 1);
              j--; // Decrement j to handle the shifted index due to splice
            }
          }
        }
      
        // Next, adjust the remaining angles with diff < 3
        for (let i = 0; i < adjustedAngles.length; i++) {
          for (let j = i + 1; j < adjustedAngles.length; j++) {
            const angle1 = adjustedAngles[i];
            const angle2 = adjustedAngles[j];
            const diff = Math.abs(angle1 - angle2);
            if (diff < 3) {
              const shift = (2 - diff) / 2;
      
              if (angle1 < angle2) {
                adjustedAngles[i] = angle1 - (shift);
                adjustedAngles[j] = angle2 + (shift);
                // adjustedAngles[i] = angle1 - (shift - 1);
                // adjustedAngles[j] = angle2 + (shift + 1);
              } else {
                adjustedAngles[i] = angle1 + shift;
                adjustedAngles[j] = angle2 - shift;
              }
            }
          }
        }
      
        return adjustedAngles;
      };
      
    
    const starLines = (draw: Svg) => {
        const startRadius = (percentages[5] / 100) * radius; // Radius of the first circle
        const endRadius = ((percentages[5] + 6) / 100) * radius; // Radius of the second circle
        for (let i = 0; i < starInfo.length; i++) {
            const angle = starInfo[i].angle;
            const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            line.stroke({ color: '#000000', width: 1 });
        }
    };
    
    
    const createStarCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number) => {
        const textPaths: Path[] = [];
        const circleRadius = (((percentages[5] + 7) / 100) * radius);
        const starAngles: number[] = uniqueStarInfo.map(star => star.angle);
        const starAnglesAdjusted = adjustStarAngles(starAngles);
        for (let j = 0; j < starAnglesAdjusted.length; j++) {
            const startAngle = (starAnglesAdjusted[j] - 1);
            const c = circlePaths(centerX, centerY, startAngle, circleRadius);
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
                .attr({ fill: 'none', stroke: 'none' });
            textPaths.push(textPath);
        }
        return textPaths;
    };
    
    const createStarTextsonPath = (draw: Svg, textPaths: Path[]) => {
        for (let i = 0; i < uniqueStarInfo.length; i++) {
            const text = draw.text('\u2605')
                .font({ size: 9 })
                .fill('#4682B4')
    
            createPopup({
                element: text,
                description: `${uniqueStarInfo[i].name}: ${uniqueStarInfo[i].deg}° ${uniqueStarInfo[i].min}' ${uniqueStarInfo[i].sec} 
                Nat: ${uniqueStarInfo[i].nature} 
                Mag: ${uniqueStarInfo[i].magnitude}`,
            })
            text.path(textPaths[i]);
        }
    };

    starLines(drawRef);
    createStarTextsonPath(drawRef, createStarCircleTextPaths(drawRef, centerX, centerY, radius));
    return;
}