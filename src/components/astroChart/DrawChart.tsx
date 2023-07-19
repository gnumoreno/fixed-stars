import { SVG } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Style from './DrawChart.module.css'

type ChartSVGProps = {
    refresh: boolean;
}

export const ChartSVG: React.FC<ChartSVGProps> = ({ refresh }) => {


    const svgContainerRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        const createCircle = () => {
            if (svgContainerRef.current) {
                const draw = SVG(svgContainerRef.current);

                const radius = 100;
                const strokeWidth = 5;
                const strokeColor = '#000000';
                const fillColor = 'none';

                const circle = draw.circle(radius * 2)
                    .center(radius + strokeWidth, radius + strokeWidth)
                    .stroke({ color: strokeColor, width: strokeWidth })
                    .fill(fillColor);
            }
        };

        return createCircle();
    }, [refresh]);

    return (
        <div className={Style.svgContainer}>
            <svg id="svg-container" ref={svgContainerRef}></svg>
        </div>
    )
}