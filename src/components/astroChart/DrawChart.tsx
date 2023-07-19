import { SVG } from "@svgdotjs/svg.js";
import { useEffect, useRef } from "react";
import Style from './DrawChart.module.css'

type ChartSVGProps = {
    refresh: boolean;
}

export const ChartSVG: React.FC<ChartSVGProps> = ({ refresh }) => {


    const svgContainerRef = useRef<SVGSVGElement>(null);
    useEffect(() => {
        const centerX = 300;  
        const centerY = 300;
        const radius = 300;
        const createCircle = () => {
            const draw = SVG(svgContainerRef.current);        
             // Customize the radius
        
            const percentages = [10, 60, 80, 84, 88, 92, 100];
            const strokeWidth = 2;
        
            for (let i = 0; i < percentages.length; i++) {
              const circleRadius = (percentages[i] / 100) * radius;
              const strokeColor = `hsl(${i * (360 / percentages.length)}, 100%, 50%)`; // Different stroke color for each circle
        
              const circle = draw.circle(circleRadius * 2)
                .center(centerX, centerY)
                .stroke({ color: strokeColor, width: strokeWidth })
                .fill('none');
            }
        };
        const houseLines = () => {
            const draw = SVG(svgContainerRef.current);
            const lineCount = 8; // Number of lines to generate
            const lineLength = 300; // Length of each line

            const startRadius = (60 / 100) * radius; // Radius of the second circle
            const endRadius = (80 / 100) * radius; // Radius of the third circle
          
            for (let i = 0; i < lineCount; i++) {
              const angle = (360 / lineCount) * i; // Calculate the angle for each line
          
              // Calculate the start and end point coordinates for each line
              const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
              const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
              const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
              const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;
          
              // Draw the line
              const line = draw.line(startX, startY, endX, endY)
                .stroke({ color: '#000000', width: 2 });
            }
        };
        const signLines = () => {
            const draw = SVG(svgContainerRef.current);
            const lineCount = 8; // Number of lines to generate
            const lineLength = 300; // Length of each line

            const startRadius = (80 / 100) * radius; // Radius of the third circle
            const endRadius = (100 / 100) * radius; // Radius of the seventh circle
          
            for (let i = 0; i < lineCount; i++) {
              const angle = (360 / lineCount +10) * i; // Calculate the angle for each line
          
              // Calculate the start and end point coordinates for each line
              const startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
              const startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
              const endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
              const endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;
          
              // Draw the line
              const line = draw.line(startX, startY, endX, endY)
                .stroke({ color: '#000000', width: 2 });
            }
        };
        return createCircle(), houseLines(), signLines();
    }, [refresh]);

    return (
        <div className={Style.svgContainer}>
            <svg id="svg-container" ref={svgContainerRef}></svg>
        </div>
    )
}