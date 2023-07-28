import {type Path, SVG,type Svg } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Style from './DrawChart.module.css'
import { housePositions, signPositions, planetPositions, planetAntiscia, getTriplicityArray, getAllFaces } from "~/utils/astroCalc";
import { getArabicPartArray } from "~/utils/arabic";
import { Signs } from "~/utils/astroCalc";
import type { house } from "~/utils/external/houses/types";
import type { planet } from "~/utils/external/planets/types";
import type { star } from "~/utils/external/stars/types";


type ChartSVGProps = {
    housesData: house[] | null;
    planetsData: planet[] | null;
    starsData: star[] | null;
}

export const ChartSVG: React.FC<ChartSVGProps> = ({ housesData, planetsData, starsData }) => {

    const svgContainerRef = useRef<SVGSVGElement>(null);

    const centerX = 400;
    const centerY = 400;
    const radius = 300;
    const percentages = [55, 80, 84, 88, 92, 100];
    const circleColors = ['#D3D3D3','#808080', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#808080'];
    const percentageSign = 71;
    // StartHouse, Planets, EndHouse, Term, Face, Triplicity, Sign
    const signSymbols: string[] = Signs.map((sign) => sign.unicode);
    const houseAngles = housePositions(housesData);
    const signAngles = signPositions(housesData);
    const planetSymbols = planetsData.map((planet) => planet.unicode);
    const planetAngles = planetPositions(planetsData, housesData);
    const antisciaAngles = planetAntiscia(planetsData.slice(0,7), housesData);
    const facesArray = getAllFaces(planetsData);
    const arabicArray = getArabicPartArray(housesData, planetsData);
    const arabicPartPositions = arabicArray.map(arabicPart => arabicPart.angle);
    const arabicPartSymbols = arabicArray.map(arabicPart => arabicPart.unicode);

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
    const degreeLines = (draw: Svg) => {
        // Draw degree marks
        
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle

        for (let i = 0; i < 360; i++) {
            let startRadius;
            if (i % 10 === 0) {
                startRadius = ((percentages[1] - 3) / 100) * radius; // Radius of the first circle
            } else if (i % 5 === 0) {
                startRadius = ((percentages[1] - 2) / 100) * radius; // Radius of the first circle
            } else {
                startRadius = ((percentages[1] - 1) / 100) * radius; // Radius of the first circle
            }
            const angle = (i + signAngles[0] + 180) * -1 ; // Calculate the angle for each line
            // const angle = (angles[i] - signAngles[0]) * -1; // Calculate the angle for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            const line = draw.line(startX, startY, endX, endY)
            line.stroke({ color: '#D3D3D3', width: 1 });
        }
    };

    const houseLines = (draw: Svg) => {
        // const draw = SVG(svgContainerRef.current);
        const angles = houseAngles;
        const startRadius = (percentages[0] / 100) * radius; // Radius of the first circle
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle

        for (let i = 0; i < angles.length; i++) {
            const angle = (angles[i] + 180) * -1; // Calculate the angle for each line

            // Calculate the start and end point coordinates for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            const line = draw.line(startX, startY, endX, endY)
            line.stroke({ color: '#D3D3D3', width: i % 3 === 0 ? 3 : 2 });
        }
    };
    const signLines = (draw: Svg) => {
        // const draw = SVG(svgContainerRef.current);
        const angles = signAngles;
        const startRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const endRadius = (percentages[5] / 100) * radius; // Radius of the sixth circle

        for (let i = 0; i < angles.length; i++) {
            const angle = (angles[i] + 180) * -1; // Calculate the angle for each line

            // Calculate the start and end point coordinates for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            draw.line(startX, startY, endX, endY)
                .stroke({ color: '#808080', width: 2 });
        }
    };

    const facesLines = (draw: Svg) => {
        // const draw = SVG(svgContainerRef.current);
        const startRadius = (percentages[2] / 100) * radius; // Radius of the second circle
        const endRadius = (percentages[3] / 100) * radius; // Radius of the sixth circle
        const stepSize = 10;
        const faceAngles: number[] = [];

        for (let i = 0; i < signAngles.length; i++) {
            faceAngles.push(signAngles[i]); // Add the sign angle to the faceAngles array
            let nextAngle = signAngles[i] + stepSize;
            for (let j = 0; j < 2; j++) {
                // Add +10 steps to the next three angles
                faceAngles.push(nextAngle);
                nextAngle += stepSize;
            }
        }

        for (let i = 0; i < faceAngles.length; i++) {
            const angle = (faceAngles[i] + 180) * -1; // Calculate the angle for each line

            // Calculate the start and end point coordinates for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            draw.line(startX, startY, endX, endY)
                .stroke({ color: '#D3D3D3', width: 2 });
        }
    };

    const planetLines = (draw: Svg) => {
        // Draw degree marks
        const angles = planetAngles;
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const startRadius = ((percentages[1] - 4) / 100) * radius;

        for (let i = 0; i < angles.length; i++) {
            const angle = (angles[i] + 180) * -1 ; // Calculate the angle for each line
            // const angle = (angles[i] - signAngles[0]) * -1; // Calculate the angle for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            const line = draw.line(startX, startY, endX, endY)
            line.stroke({ color: '#6495ED', width: 2 });
        }
    };

    const antisciaLines = (draw: Svg) => {
        // Draw degree marks
        const angles = antisciaAngles;
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const startRadius = ((percentages[1] - 10) / 100) * radius;

        for (let i = 0; i < angles.length; i++) {
            const angle = (angles[i] + 180) * -1 ; // Calculate the angle for each line
            // const angle = (angles[i] - signAngles[0]) * -1; // Calculate the angle for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            const line = draw.line(startX, startY, endX, endY)
            line.stroke({ color: '#D3D3D3', width: 1 });
        }
    };

    const arabicLines = (draw: Svg) => {
        // Draw degree marks
        const angles = arabicPartPositions;
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        const startRadius = ((percentages[1] - 14) / 100) * radius;

        for (let i = 0; i < angles.length; i++) {
            const angle = angles[i]; // Calculate the angle for each line
            // const angle = (angles[i] - signAngles[0]) * -1; // Calculate the angle for each line
            const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;

            // Draw the line
            const line = draw.line(startX, startY, endX, endY)
            line.stroke({ color: '#D3D3D3', width: 1 });
        }
    };
    const createSignCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
        const textPaths: Path[] = [];
    
        const circleRadius = (((percentages[4] + 2) / 100) * radius);
        const angleStep = 360 / signAngles.length;
    
        for (let j = 0; j < signAngles.length; j++) {
            const startAngle = (((signAngles[j] + angleStep / 2) + 180) * -1);
            const startAngleRad = (startAngle) * (Math.PI / 180);
    
            // Calculate the starting and ending coordinates of the arc
            const startX = centerX + Math.cos(startAngleRad) * circleRadius;
            const startY = centerY + Math.sin(startAngleRad) * circleRadius;
            const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
            const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
    
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${startX},${startY} A ${circleRadius},${circleRadius} 0 0,1 ${endX},${endY}`)
                .attr({ fill: 'none', stroke: 'none' });
    
            textPaths.push(textPath);
        }
    
        return textPaths;
    };
    
    const createSignTextsonPath = (draw: Svg, textPaths: Path[]) => {
        for (let i = 0; i < textPaths.length; i++) {
            const text = draw.text(`${signSymbols[i]}`)
                .font({ size: 12 })
                .fill('#000000');

            // Position the text along the textPath
            text.path(textPaths[i]);
        }
    };

    const createTriplicityCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
        const textPaths: Path[] = [];
    
        const circleRadius = (((percentages[4] - 3) / 100) * radius);
        const angleStep = 360 / signAngles.length;
    
        for (let j = 0; j < signAngles.length; j++) {
            const startAngle = (((signAngles[j] + angleStep / 2) + 180) * -1);
            const startAngleRad = (startAngle) * (Math.PI / 180);
    
            // Calculate the starting and ending coordinates of the arc
            const startX = centerX + Math.cos(startAngleRad) * circleRadius;
            const startY = centerY + Math.sin(startAngleRad) * circleRadius;
            const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
            const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
    
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${startX},${startY} A ${circleRadius},${circleRadius} 0 0,1 ${endX},${endY}`)
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

    const createFacesCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentages: number[]) => {
        const textPaths: Path[] = [];
    
        const circleRadius = (((percentages[3] - 3) / 100) * radius);
        const angleStep = 360 / (facesArray.length);
        const stepSize = 10;
        const faceAngles: number[] = [];

        for (let i = 0; i < signAngles.length; i++) {
            faceAngles.push(signAngles[i]); // Add the sign angle to the faceAngles array
            let nextAngle = signAngles[i] + stepSize;
            for (let j = 0; j < 2; j++) {
                // Add +10 steps to the next three angles
                faceAngles.push(nextAngle);
                nextAngle += stepSize;
            }
        }

        for (let j = 0; j < (faceAngles.length); j++) {
            const angle = (((faceAngles[j] + angleStep / 2) + 180) * -1);
            const startAngleRad = (angle) * (Math.PI / 180);
    
            // Calculate the starting and ending coordinates of the arc
            const startX = centerX + Math.cos(startAngleRad) * circleRadius;
            const startY = centerY + Math.sin(startAngleRad) * circleRadius;
            const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
            const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
    
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${startX},${startY} A ${circleRadius},${circleRadius} 0 0,1 ${endX},${endY}`)
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

    const createAntisciaPlanetCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign: number) => {
        const textPaths: [Path, number][] = [];
    
        const circleRadius = (((percentageSign - 4) / 100) * radius);
    
        for (let j = 0; j < antisciaAngles.length; j++) {
            const startAngle = ((antisciaAngles[j] + 181) * -1);
            const startAngleRad = (startAngle) * (Math.PI / 180);
            const rotate = (antisciaAngles[j] + 90);
    
            // Calculate the starting and ending coordinates of the arc
            const startX = centerX + Math.cos(startAngleRad) * circleRadius;
            const startY = centerY + Math.sin(startAngleRad) * circleRadius;
            const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
            const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
    
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${startX},${startY} A ${circleRadius},${circleRadius} 0 0,1 ${endX},${endY}`)
                .attr({ fill: 'none', stroke: 'none' });
    
            textPaths.push([textPath, rotate]);

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

    const createArabicPartCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign) => {
        const textPaths: [Path, number][] = [];
    
        const circleRadius = (((percentageSign - 8) / 100) * radius);
        const ascendantPosition = houseAngles[0];
        for (let j = 0; j < arabicPartPositions.length; j++) {
            const startAngle = arabicPartPositions[j] - 1;
            const startAngleRad = (startAngle) * (Math.PI / 180);
            const rotate = (arabicPartPositions[j] + ascendantPosition + 90) * -1;
    
            // Calculate the starting and ending coordinates of the arc
            const startX = centerX + Math.cos(startAngleRad) * circleRadius;
            const startY = centerY + Math.sin(startAngleRad) * circleRadius;
            const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
            const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
    
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${startX},${startY} A ${circleRadius},${circleRadius} 0 0,1 ${endX},${endY}`)
                .attr({ fill: 'none', stroke: 'none' });
    
            textPaths.push([textPath, rotate]);
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

    const createPlanetCircleTextPaths = (draw: Svg, centerX: number, centerY: number, radius: number, percentageSign) => {
        const textPaths: [Path, number][] = [];
    
        const circleRadius = (((percentageSign -1 ) / 100) * radius);
    
        for (let j = 0; j < planetAngles.length; j++) {
            const startAngle = ((planetAngles[j] + 181) * -1);
            const rotate = (planetAngles[j] + 90);
            const startAngleRad = (startAngle) * (Math.PI / 180);
    
            // Calculate the starting and ending coordinates of the arc
            const startX = centerX + Math.cos(startAngleRad) * circleRadius;
            const startY = centerY + Math.sin(startAngleRad) * circleRadius;
            const endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
            const endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
    
            // Use sweep-flag 0 to reverse the arc direction
            const textPath = draw.path(`M ${startX},${startY} A ${circleRadius},${circleRadius} 0 0,1 ${endX},${endY}`)
                .attr({ fill: 'none', stroke: 'none' });
    
            textPaths.push([textPath, rotate]);
        }
    
        return textPaths;
    };

    const createPlanetTextsonPath = (draw: Svg, textPaths: [Path, number][]) => {
        for (let i = 0; i < textPaths.length; i++) {
            const text = draw.text(`${planetSymbols[i]}`)
                .font({ size: 20 })
                .fill('#4682B4');

            // Position the text along the textPath
            text.path(textPaths[i][0]);
            // @ts-ignore
            text.animate(1).rotate(textPaths[i][1], text.cx(), text.cy()); // eslint-disable-line 
        }
    };

    const drawChartFunc = (drawRef: Svg) => {
        if (!drawRef) {
            console.log("drawRef is null", drawRef)
            return;
        }
        antisciaLines(drawRef);
        degreeLines(drawRef);
        houseLines(drawRef);
        createCircle(drawRef, percentages);
        facesLines(drawRef);
        signLines(drawRef);
        arabicLines(drawRef);
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
        </div>
    )
}