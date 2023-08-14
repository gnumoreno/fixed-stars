import type { Path, Svg } from "@svgdotjs/svg.js";
import type { handleMouseOverPopupArgs } from "~/hooks/usePopup";
import type { house } from "../external/houses/types";
import { getAllFaces, getAllTermAngles, getAllTermSymbols, getTriplicityArray, signAngles } from "../astroCalc";
import type { planet } from "../external/planets/types";
import { Signs } from "../external/dignities/properties";

type drawWheelElementsArgs = {
    housesData: house[];
    planetsData: planet[];
    percentages: number[];
    radius: number;
    centerX: number;
    centerY: number;
    drawRef: Svg;
    lineXYCircle: (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => number[];
    createPopup: ({ element, description, paddingX, paddingY, }: handleMouseOverPopupArgs) => void;
    circlePaths: (centerX: number, centerY: number, angle: number, circleRadius: number) => number[];
};


export const drawWheelElements = ({
    housesData,
    planetsData,
    centerX,
    centerY,
    percentages,
    radius,
    drawRef,
    createPopup,
    lineXYCircle,
    circlePaths,
}: drawWheelElementsArgs) => {
    const signAnglesArray: number[] = signAngles(housesData);
    const signSymbols: string[] = Signs.map((sign) => sign.unicode);
    const facesArray = getAllFaces(planetsData);
    const termAngles: number[] = getAllTermAngles(signAnglesArray);
    const termSymbols = getAllTermSymbols(planetsData);

    const createCircle = (draw: Svg, percentages: number[]) => {
        const circleColors = ['#D3D3D3', '#808080', '#D3D3D3', '#D3D3D3', '#D3D3D3', '#808080'];
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
                .fill('#000000');

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
    signLines(drawRef);
    degreeLines(drawRef);
    termLines(drawRef);
    facesLines(drawRef);
    createCircle(drawRef, percentages);
    createSignTextsonPath(drawRef, createSignCircleTextPaths(drawRef, centerX, centerY, radius, percentages));
    createTriplicityTextsonPath(drawRef, createTriplicityCircleTextPaths(drawRef, centerX, centerY, radius, percentages));
    createTermsTextsonPath(drawRef, createTermsCircleTextPaths(drawRef, centerX, centerY, radius, percentages));
    createFacesTextsonPath(drawRef, createFacesCircleTextPaths(drawRef, centerX, centerY, radius, percentages), facesArray);

    return;
}