import type { Svg } from "@svgdotjs/svg.js";
import type { house } from "../external/houses/types";
import type { handleMouseOverPopupArgs } from "~/hooks/usePopup";

type drawHousesArgs = {
    housesData: house[];
    percentages: number[];
    radius:number;
    lineXYCircle: (centerX: number, centerY: number, startRadius: number, endRadius: number, angle: number) => number[];
    centerX: number;
    centerY: number;
    createPopup: ({ element, description, paddingX, paddingY, }: handleMouseOverPopupArgs) => void;
    draw: Svg;

}

export const drawHouses = ({
housesData,
percentages,
radius,
lineXYCircle,
centerX,
centerY,
createPopup,
draw,

}:drawHousesArgs) => {


    const houseInfo = housesData.map(house => {
        return {
            angle:house.angle, deg:house.longDegree, min:house.longMinute, sec:house.longSecond, name:house.name,  
        }
    });
    
    const houseLines = (draw: Svg) => {
        const startRadius = (percentages[0] / 100) * radius; // Radius of the first circle
        const endRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        for (let i = 0; i < houseInfo.length; i++) {
            const angle = houseInfo[i].angle;
            const line = draw.line(lineXYCircle(centerX, centerY, startRadius, endRadius, angle));
    
            createPopup({
                element: line,
                description: `${houseInfo[i].name}: ${houseInfo[i].deg}° ${houseInfo[i].min}' ${houseInfo[i].sec}`
            })
            line.stroke({ color: '#D3D3D3', width: i % 3 === 0 ? 3 : 2 });
        }
    };

    houseLines(draw);

    return;
}