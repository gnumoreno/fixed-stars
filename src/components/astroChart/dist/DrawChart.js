"use strict";
exports.__esModule = true;
exports.ChartSVG = void 0;
var svg_js_1 = require("@svgdotjs/svg.js");
var react_1 = require("react");
var DrawChart_module_css_1 = require("./DrawChart.module.css");
var astroCalc_1 = require("~/utils/astroCalc");
exports.ChartSVG = function (_a) {
    var housesData = _a.housesData, planetsData = _a.planetsData, starsData = _a.starsData;
    var svgContainerRef = react_1.useRef(null);
    var centerX = 400;
    var centerY = 400;
    var radius = 300;
    var percentages = [10, 60, 80, 84, 88, 92, 100];
    var startAngles = [355, 85, 175, 265];
    var houseAngles = astroCalc_1.housePositions(housesData);
    var signAngles = astroCalc_1.signPositions(housesData);
    // console.log("Angles (H, S)", houseAngles, signAngles)
    var createCircle = function (draw, percentages) {
        // const draw = SVG(svgContainerRef.current);        
        // Customize the radius
        var strokeWidth = 2;
        for (var i = 0; i < percentages.length; i++) {
            var circleRadius = (percentages[i] / 100) * radius;
            var strokeColor = "hsl(" + i * (360 / percentages.length) + ", 100%, 50%)"; // Different stroke color for each circle
            draw.circle(circleRadius * 2)
                .center(centerX, centerY)
                .stroke({ color: strokeColor, width: strokeWidth })
                .fill('none');
        }
    };
    var createCircleTextPaths = function (draw, centerX, centerY, radius, percentages, startAngles) {
        var textPaths = [];
        for (var i = 0; i < percentages.length; i++) {
            var circleRadius = (percentages[i] / 100) * radius;
            for (var j = 0; j < startAngles.length; j++) {
                var startAngle = (startAngles[j] + 180);
                var startAngleRad = (startAngle + 360 / startAngles.length * i) * Math.PI / 180;
                // Calculate the starting and ending coordinates of the arc
                var startX = centerX + Math.cos(startAngleRad) * circleRadius;
                var startY = centerY + Math.sin(startAngleRad) * circleRadius;
                var endX = centerX + Math.cos(startAngleRad + Math.PI) * circleRadius;
                var endY = centerY + Math.sin(startAngleRad + Math.PI) * circleRadius;
                var textPath = draw.path("M " + startX + "," + startY + " A " + circleRadius + "," + circleRadius + " 0 0,1 " + endX + "," + endY)
                    .attr({ fill: 'none', stroke: 'none' });
                textPaths.push(textPath);
            }
        }
        return textPaths;
    };
    var houseLines = function (draw) {
        // const draw = SVG(svgContainerRef.current);
        var angles = houseAngles;
        var startRadius = (percentages[1] / 100) * radius; // Radius of the second circle
        var endRadius = (percentages[2] / 100) * radius; // Radius of the third circle
        for (var i = 0; i < angles.length; i++) {
            var angle = angles[i] * -1; // Calculate the angle for each line
            // Calculate the start and end point coordinates for each line
            var startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            var startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            var endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            var endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;
            // Draw the line
            var line = draw.line(startX, startY, endX, endY);
            line.stroke({ color: '#000000', width: i % 3 === 0 ? 3 : 2 });
        }
    };
    var signLines = function (draw) {
        // const draw = SVG(svgContainerRef.current);
        var angles = signAngles;
        var startRadius = (percentages[2] / 100) * radius; // Radius of the third circle
        var endRadius = (percentages[6] / 100) * radius; // Radius of the seventh circle
        for (var i = 0; i < angles.length; i++) {
            var angle = angles[i] * -1; // Calculate the angle for each line
            // Calculate the start and end point coordinates for each line
            var startX = centerX + Math.cos(angle * Math.PI / 180) * startRadius;
            var startY = centerY + Math.sin(angle * Math.PI / 180) * startRadius;
            var endX = centerX + Math.cos(angle * Math.PI / 180) * endRadius;
            var endY = centerY + Math.sin(angle * Math.PI / 180) * endRadius;
            // Draw the line
            draw.line(startX, startY, endX, endY)
                .stroke({ color: '#808080', width: 2 });
        }
    };
    var createTextsonPath = function (draw, textPaths) {
        var _loop_1 = function (i) {
            // const text = draw.text(`h${i}`)
            var text = draw.text(function (add) {
                add.tspan('\u2648').font({ size: 12 }).fill('#000000');
                text.path(textPaths[i]);
            });
        };
        for (var i = 0; i < textPaths.length; i++) {
            _loop_1(i);
        }
    };
    var drawChartFunc = function (drawRef) {
        if (!drawRef) {
            console.log("drawRef is null", drawRef);
            return;
        }
        houseLines(drawRef);
        signLines(drawRef);
        createCircle(drawRef, percentages);
        createTextsonPath(drawRef, createCircleTextPaths(drawRef, centerX, centerY, radius, percentages, startAngles));
    };
    react_1.useEffect(function () {
        // useEffect runs once when the component is loaded and then every time the dependencies change [housesData, planetsData, starsData]
        // Calling the drawChartFunc function
        var drawRef = svg_js_1.SVG(svgContainerRef.current);
        drawChartFunc(drawRef);
        console.log('Drawing'); // Should log 2 times on Dev Environment and 1 time on Production Environment -- loging to check for infinite loop
        // The function inside the return callback will be called when the component is unmounted or needs to be re-rendered AKA when the dependencies change
        return function () {
            svg_js_1.SVG(drawRef).clear();
        };
    }, [housesData, planetsData, starsData]); // eslint-disable-line react-hooks/exhaustive-deps
    return (React.createElement("div", { className: DrawChart_module_css_1["default"].svgContainer },
        React.createElement("svg", { id: "svg-container", ref: svgContainerRef })));
};
