import { type Path, SVG, type Svg, Text, Rect, Ellipse, Line, Image, G } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Style from './DrawChart.module.css'
import { signAngles, planetAntiscia, getTriplicityArray, getAllFaces, getAllTermSymbols, getAllTermAngles, getStarAspects } from "~/utils/astroCalc";
import { Signs } from "~/utils/astroCalc";
import type { house } from "~/utils/external/houses/types";
import type { planet } from "~/utils/external/planets/types";
import type { star } from "~/utils/external/stars/types";
import type { arabicPart } from "~/utils/external/arabicParts/types";
import type { aspect } from "~/utils/external/aspects/types";
import { ChartPopup } from "./Utils";
import { usePopup } from "~/hooks/usePopup";

type ChartSVGProps = {
    housesData: house[] | null;
    planetsData: planet[] | null;
    starsData: star[] | null;
    arabicPartsData: arabicPart[] | null;
    aspectsData: aspect[] | null;
}

export const ChartSVG: React.FC<ChartSVGProps> = ({ housesData, planetsData, starsData, arabicPartsData, aspectsData }) => {


    const svgContainerRef = useRef<SVGSVGElement>(null);

    // Basic Wheel Variables
    const centerX = 350;
    const centerY = 450;
    const radius = 300;
    const percentages = [55, 80, 84, 88, 92, 100];
    const circleColors = ['#D3D3D3', '#808080', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#808080'];
    const percentageSign = 71;
    const ascendantAng = housesData[0].angle || 0;

    // Popup
    const { createPopup, popupProps } = usePopup();


    const createCircle = (draw: Svg, percentages: number[]) => {
        // const draw = SVG(svgContainerRef.current);        
        // Customize the radius
        const strokeWidth = 2;
        for (let i = 0; i < percentages.length; i++) {
            const circleRadius = (percentages[i] / 100) * radius;
            const strokeColor = circleColors[i];

            draw.circle(circleRadius * 2)
                .center(centerX, centerY)
                .stroke({ color: strokeColor, width: strokeWidth })
                .fill('none');
        }
    };

    // This is important. Do not touch it if don't know what you are doing. It is going to mess all the lines
    const lineXYCircle = (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => {
        const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
        const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
        const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
        const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;
        return [startX, startY, endX, endY]
    };

    // This is important. Do not touch it if don't know what you are doing. It is going to mess all the map symbols.
    const circlePaths = (centerX: number, centerY: number, angle: number, circleRadius: number) => {
        const startAngle = angle
        const startAngleRad = (startAngle) * (Math.PI / 180);
        const startX = centerX + Math.cos(startAngleRad) * circleRadius;
        const startY = centerY + Math.sin(startAngleRad) * circleRadius;
        const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
        const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
        return [startX, startY, endX, endY]
    };

    const rotateSymbol = (angle: number) => {
        const rot = (angle + ascendantAng - 90) * -1;
        return rot;
    };

// Start Sign, Triplicity, Term, Face
const signAnglesArray: number[] = signAngles(housesData);
const signSymbols: string[] = Signs.map((sign) => sign.unicode);
const facesArray = getAllFaces(planetsData);
const termAngles: number[] = getAllTermAngles(signAnglesArray);
const termSymbols = getAllTermSymbols(planetsData);

const degreeLines = (draw: Svg) => {
    // Draw marks every 1, 5 and 10 degrees
    const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
    for (let i = 0; i < 360; i++) {
        let startRadius: number;
        if (i % 10 === 0) {
            startRadius = ((percentages[1] - 3) / 100) * radius; // Radius of the first circle
        } else if (i % 5 === 0) {
            startRadius = ((percentages[1] - 2) / 100) * radius; // Radius of the first circle
        } else {
            startRadius = ((percentages[1] - 1) / 100) * radius; // Radius of the first circle
        }
        const angle = (i + signAnglesArray[0] + 180) * -1; // Calculate the angle for each line
        const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
        line.stroke({ color: '#D3D3D3', width: 1 });
    }
};

const signLines = (draw: Svg) => {
    // const draw = SVG(svgContainerRef.current);
    const angles = signAnglesArray;
    const startRadius = (percentages[1] / 100) * radius; // Radius of the second circle
    const endRadius = (percentages[5] / 100) * radius; // Radius of the sixth circle
    for (let i = 0; i < angles.length; i++) {
        const angle = (angles[i] + 180) * -1; // Calculate the angle for each line
        draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            .stroke({ color: '#808080', width: 2 });
    }
};

const termLines = (draw: Svg) => {
    // const draw = SVG(svgContainerRef.current);
    const startRadius = (percentages[1] / 100) * radius; // Radius of the second circle
    const endRadius = (percentages[2] / 100) * radius; // Radius of the sixth circle

    for (let i = 0; i < termAngles.length; i++) {
        const angle = (termAngles[i] + 180) * -1; // Calculate the angle for each line
        draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            .stroke({ color: '#D3D3D3', width: 2 });
    }
};

const facesLines = (draw: Svg) => {
    // const draw = SVG(svgContainerRef.current);
    const startRadius = (percentages[2] / 100) * radius; // Radius of the second circle
    const endRadius = (percentages[3] / 100) * radius; // Radius of the sixth circle
    const stepSize = 10;
    const faceAngles: number[] = [];
    for (let i = 0; i < signAnglesArray.length; i++) {
        faceAngles.push(signAnglesArray[i]); // Add the sign angle to the faceAngles array
        let nextAngle = signAnglesArray[i] + stepSize;
        for (let j = 0; j < 2; j++) {
            // Add +10 steps to the next three angles
            faceAngles.push(nextAngle);
            nextAngle += stepSize;
        }
    }
    for (let i = 0; i < faceAngles.length; i++) {
        const angle = (faceAngles[i] + 180) * -1; // Calculate the angle for each line
        draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
            .stroke({ color: '#D3D3D3', width: 2 });
    }
};

const createSignCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
    const textPaths: Path[] = [];
    const circleRadius = (((percentages[4] + 2) / 100) * radius);
    const angleStep = 360 / signAnglesArray.length;
    for (let j = 0; j < signAnglesArray.length; j++) {
        const startAngle = (((signAnglesArray[j] + angleStep / 2) + 180) * -1);
        const c = circlePaths(centerX, centerY, startAngle, circleRadius);
        // Use sweep-flag 0 to reverse the arc direction
        const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
            .attr({ fill: 'none', stroke: 'none' });

        textPaths.push(textPath);
    }

    return textPaths;
};

const createSignTextsonPath = (draw: Svg, textPaths: Path[]) => {
    for (let i = 0; i < textPaths.length; i++) {
        const text = draw.text(`${signSymbols[i]}`)
            .font({ size: 12 })
            .fill('#000000')
            .addClass(Style.signSymbol);

        createPopup({
            element: text,
            description: `Signo: ${signSymbols[i]}
            Long: something`,
        })

        // Position the text along the textPath
        text.path(textPaths[i]);
    }
};

const createTriplicityCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
    const textPaths: Path[] = [];
    const circleRadius = (((percentages[4] - 3) / 100) * radius);
    const angleStep = 360 / signAnglesArray.length;
    for (let j = 0; j < signAnglesArray.length; j++) {
        const startAngle = (((signAnglesArray[j] + angleStep / 2) + 180) * -1);
        const c = circlePaths(centerX, centerY, startAngle, circleRadius);
        // Use sweep-flag 0 to reverse the arc direction
        const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
            .attr({ fill: 'none', stroke: 'none' });
        textPaths.push(textPath);
    }
    return textPaths;
};

const createTriplicityTextsonPath = (draw: Svg, textPaths: Path[]) => {
    const triplicityArray = getTriplicityArray(planetsData, housesData);
    for (let i = 0; i < textPaths.length; i++) {
        const text = draw.text(`${triplicityArray[i]}`)
            .font({ size: 9 })
            .fill('#800080');
        // Position the text along the textPath
        text.path(textPaths[i]);
    }
};

const createTermsCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
    const textPaths: Path[] = [];
    const circleRadius = (((percentages[2] - 3) / 100) * radius);

    for (let j = 0; j < termAngles.length; j++) {
        const startAngle = ((termAngles[j] + 179) * -1);
        // const startAngle = (termAngles[j] - ((termAngles[j] - termAngles[j-1]) / 2) * -1);
        const c = circlePaths(centerX, centerY, startAngle, circleRadius);
        // Use sweep-flag 0 to reverse the arc direction
        const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
            .attr({ fill: 'none', stroke: 'none' });
        textPaths.push(textPath);
    }
    return textPaths;
};

const createTermsTextsonPath = (draw: Svg, textPaths: Path[]) => {

    for (let i = 0; i < textPaths.length; i++) {
        const text = draw.text(`${termSymbols[i]}`)
            .font({ size: 8 })
            .fill('#800080');
        // Position the text along the textPath
        text.path(textPaths[i]);
    }
};

const createFacesCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
    const textPaths: Path[] = [];
    const circleRadius = (((percentages[3] - 3) / 100) * radius);
    const angleStep = 360 / (facesArray.length);
    const stepSize = 10;
    const faceAngles: number[] = [];
    for (let i = 0; i < signAnglesArray.length; i++) {
        faceAngles.push(signAnglesArray[i]); // Add the sign angle to the faceAngles array
        let nextAngle = signAnglesArray[i] + stepSize;
        for (let j = 0; j < 2; j++) {
            // Add +10 steps to the next three angles
            faceAngles.push(nextAngle);
            nextAngle += stepSize;
        }
    }
    for (let j = 0; j < (faceAngles.length); j++) {
        const angle = (((faceAngles[j] + angleStep / 2) + 180) * -1);
        const c = circlePaths(centerX, centerY, angle, circleRadius);
        // Use sweep-flag 0 to reverse the arc direction
        const textPath = draw.path(`M ${c[0]},${c[1]} A ${circleRadius},${circleRadius} 0 0,1 ${c[2]},${c[3]}`)
            .attr({ fill: 'none', stroke: 'none' });
        textPaths.push(textPath);
    }
    return textPaths;
};

const createFacesTextsonPath = (draw: Svg, textPaths: Path[], planets: string[]) => {
    for (let i = 0; i < planets.length; i++) {
        const text = draw.text(`${planets[i]}`)
            .font({ size: 9 })
            .fill('#800080');
        // Position the text along the textPath
        text.path(textPaths[i]);
    }
};
// End Sign, Triplicity, Term, Face

// Start Houses Drawings
const houseProps = housesData.map(house => {
    return {
        angle:house.angle, deg:house.longDegree, min:house.longMinute, sec:house.longSecond, name:house.name,  
    }
});

const houseLines = (draw: Svg) => {
    const startRadius = (percentages[0] / 100) * radius; // Radius of the first circle
    const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
    for (let i = 0; i < houseProps.length; i++) {
        const angle = houseProps[i].angle;
        const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
        .addClass(Style.houseLineSymbol);

        createPopup({
            element: line,
            description: `${houseProps[i].name}: ${houseProps[i].deg}° ${houseProps[i].min}' ${houseProps[i].sec}`
        })
        line.stroke({ color: '#D3D3D3', width: i % 3 === 0 ? 3 : 2 });
    }
};
// End Houses Drawings

// Start Planets Drawings
const planetAngles = planetsData.map((planet) => planet.angle);
const planetSymbols = planetsData.map((planet) => planet.unicode);
const planetPos = planetsData.map((planet) => {
    return{
        deg:planet.longDegree, min:planet.longMinute, sec:planet.longSecond
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

    const createPlanetCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign) => {
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
// End Planets Drawings

// Start Antiscia Drawings
const antisciaAngles = planetAntiscia(planetsData.slice(0, 7), housesData);

const antisciaLines = (draw: Svg) => {
    // Draw degree marks
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
// End Antiscia Drawings

// Start Arabic Part Drawings
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
// End  Arabic Part Drawings

// Start Stars Drawings
const someStars = getStarAspects(aspectsData).map((star) => star.astroB.name);
const starProps = starsData.filter(star => {
    return someStars.includes(star.name)
}).map((star) => {
    return{
        angle:star.angle, deg:star.longDegree, min:star.longMinute, sec:star.longSecond, name:star.name, nature:star.nature, magnitude:star.magnitude, 
    }
});
const uniqueStarProps = starProps.filter((star, index) => starProps.indexOf(star) === index);

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
    for (let i = 0; i < starProps.length; i++) {
        const angle = starProps[i].angle;
        const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle))
        line.stroke({ color: '#000000', width: 1 });
    }
};


const createStarCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number) => {
    const textPaths: Path[] = [];
    const circleRadius = (((percentages[5] + 7) / 100) * radius);
    const starAngles: number[] = uniqueStarProps.map(star => star.angle);
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
    for (let i = 0; i < uniqueStarProps.length; i++) {
        const text = draw.text('\u2605')
            .font({ size: 9 })
            .fill('#4682B4')
            .addClass(Style.starSymbol);

        createPopup({
            element: text,
            description: `${uniqueStarProps[i].name}: ${uniqueStarProps[i].deg}° ${uniqueStarProps[i].min}' ${uniqueStarProps[i].sec} 
            Nat: ${uniqueStarProps[i].nature} 
            Mag: ${uniqueStarProps[i].magnitude}`,
        })
        text.path(textPaths[i]);
    }
};
// End Stars Drawings

    const drawChartFunc = (drawRef: Svg) => {
        if (!drawRef) {
            console.log("drawRef is null", drawRef)
            return;
        }
        starLines(drawRef);
        antisciaLines(drawRef);
        degreeLines(drawRef);
        termLines(drawRef);
        houseLines(drawRef);
        createCircle(drawRef, percentages);
        facesLines(drawRef);
        signLines(drawRef);
        arabicLines(drawRef);
        createStarTextsonPath(drawRef, createStarCircleTextPaths(drawRef, centerX, centerY, radius));
        createTermsTextsonPath(drawRef, createTermsCircleTextPaths(drawRef, centerX, centerY, radius, percentages));
        createArabicPartTextsonPath(drawRef, createArabicPartCircleTextPaths(drawRef, centerX, centerY, radius, percentageSign));
        createFacesTextsonPath(drawRef, createFacesCircleTextPaths(drawRef, centerX, centerY, radius, percentages), facesArray);
        createTriplicityTextsonPath(drawRef, createTriplicityCircleTextPaths(drawRef, centerX, centerY, radius, percentages));
        createSignTextsonPath(drawRef, createSignCircleTextPaths(drawRef, centerX, centerY, radius, percentages));
        planetLines(drawRef);
        createAntisciaPlanetTextsonPath(drawRef, createAntisciaPlanetCircleTextPaths(drawRef, centerX, centerY, radius, percentageSign));
        createPlanetTextsonPath(drawRef, createPlanetCircleTextPaths(drawRef, centerX, centerY, radius, percentageSign));
    }

    useEffect(() => {

        // useEffect runs once when the component is loaded and then every time the dependencies change [housesData, planetsData, starsData]
        // Calling the drawChartFunc function
        const drawRef = SVG(svgContainerRef.current);
        drawChartFunc(drawRef);
        console.log('Drawing') // Should log 2 times on Dev Environment and 1 time on Production Environment -- loging to check for infinite loop


        // The function inside the return callback will be called when the component is unmounted or needs to be re-rendered AKA when the dependencies change
        return () => {
            SVG(drawRef).clear();
        }

    }, [housesData, planetsData, starsData]); // eslint-disable-line react-hooks/exhaustive-deps



    return (
        <div className={Style.svgContainer}>
            <svg id="svg-container" ref={svgContainerRef}></svg>
            <ChartPopup
                {...popupProps}
            />
        </div>
    )
}