import { SVG, type Svg } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Style from './DrawChart.module.css'
import { planetAntiscia, getStarAspects } from "~/utils/astroCalc";
import type { house } from "~/utils/external/houses/types";
import type { planet } from "~/utils/external/planets/types";
import type { star } from "~/utils/external/stars/types";
import type { arabicPart } from "~/utils/external/arabicParts/types";
import type { aspect } from "~/utils/external/aspects/types";
import { ChartPopup } from "./Utils";
import { usePopup } from "~/hooks/usePopup";
import { drawHouses } from "~/utils/charts/houses";
import { drawPlanets } from "~/utils/charts/planets";
import { drawArabicParts } from "~/utils/charts/arabics";
import { drawAntiscia } from "~/utils/charts/antiscia";
import { drawStars } from "~/utils/charts/stars";
import { drawWheelElements } from "~/utils/charts/wheelElements";
import { drawAspectLines } from "~/utils/charts/aspects";

type ChartSVGProps = {
    housesData: house[] | null;
    planetsData: planet[] | null;
    starsData: star[] | null;
    arabicPartsData: arabicPart[] | null;
    aspectsData: aspect[] | null;
    options: ChartOptions;
}

export type ChartOptions = {
    aspectLines: boolean;
}

export const ChartSVG: React.FC<ChartSVGProps> = ({ housesData, planetsData, starsData, arabicPartsData, aspectsData, options }) => {

    const svgContainerRef = useRef<SVGSVGElement>(null);

    // Basic Wheel Variables
    const centerX = 400;
    const centerY = 400;
    const radius = 300;
    const percentages = [60, 80, 84, 88, 92, 100];
    const percentageSign = 71;
    const ascendantAng = housesData[0].angle || 0;

    // Popup
    const { createPopup, popupProps } = usePopup();

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

    const drawChartFunc = (drawRef: Svg) => {
        if (!drawRef) {
            console.log("drawRef is null", drawRef)
            return;
        }
        drawWheelElements({
            drawRef: drawRef,
            housesData: housesData,
            planetsData: planetsData,
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            percentages: percentages,
            createPopup: createPopup,
            lineXYCircle: lineXYCircle,
            circlePaths: circlePaths,
        })
        drawHouses({
            draw: drawRef,
            housesData: housesData,
            radius: radius,
            centerX: centerX,
            centerY: centerY,
            percentages: percentages,
            createPopup: createPopup,
            lineXYCircle: lineXYCircle,
        })
        drawPlanets({
            drawRef: drawRef,
            planetsData: planetsData,
            radius: radius,
            centerX: centerX,
            centerY: centerY,
            percentages: percentages,
            percentageSign: percentageSign,
            createPopup: createPopup,
            lineXYCircle: lineXYCircle,
            circlePaths: circlePaths,
            rotateSymbol: rotateSymbol,
        })
        drawArabicParts({
            drawRef: drawRef,
            arabicPartsData: arabicPartsData,
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            percentageSign: percentageSign,
            percentages: percentages,
            createPopup: createPopup,
            circlePaths: circlePaths,
            lineXYCircle: lineXYCircle,
            rotateSymbol: rotateSymbol,
        })
        drawAntiscia({
            planetsData: planetsData,
            drawRef: drawRef,
            housesData: housesData,
            ascendantAng: ascendantAng,
            centerX: centerX,
            centerY: centerY,
            percentageSign: percentageSign,
            radius: radius,
            percentages: percentages,
            lineXYCircle: lineXYCircle,
            rotateSymbol: rotateSymbol,
            circlePaths: circlePaths,
            createPopup: createPopup,
            planetAntiscia: planetAntiscia,
        })
        drawStars({
            drawRef: drawRef,
            starsData: starsData,
            aspectsData: aspectsData,
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            percentages: percentages,
            circlePaths: circlePaths,
            createPopup: createPopup,
            getStarAspects: getStarAspects,
            lineXYCircle: lineXYCircle,
        })
        if(options.aspectLines) {
            drawAspectLines({
                aspectsData: aspectsData,
                centerX: centerX,
                centerY: centerY,
                percentages: percentages,
                radius: radius,
                drawRef: drawRef,
                // createPopup: createPopup,
                // lineXYCircle: lineXYCircle,
            })
        }
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

    }, [housesData, planetsData, starsData, options]); // eslint-disable-line react-hooks/exhaustive-deps



    return (
        <div className={Style.svgContainer}>
            <svg id="svg-container" ref={svgContainerRef}></svg>
            <ChartPopup
                {...popupProps}
            />
        </div>
    )
}