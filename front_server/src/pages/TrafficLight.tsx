import React from "react";

import "../styles/content.css"

type Object = {
    x: number;
    y: number;
    type: "chair" | "table" | "sitting" | "person";
};

type Info = {
    time: number
    now?: number
    data: Object[]
}

type Props = {
    objects: Info;
};

const countObjects = (objects: Object[], targetType: Object['type']): number => {
    let count = 0;

    objects.forEach((objects) => {
        if (objects.type === targetType) {
            count++
        }
    })
    return (count)
}

const TrafficLight = ({objects}: Props) => {

    const TrafficLightCircle = ({ color }: { color: "red" | "yellow" | "green" }) => {
        if (color === "red")
        {
            return (
                <div className="TrafficLightContainer">
                    <div className={`TrafficLightCircle ${color}`}></div>
                    <div className="TrafficLightCircle"></div>
                    <div className="TrafficLightCircle"></div>
                </div>
            );
        } else if (color === "yellow") {
            return (
                <div className="TrafficLightContainer">
                    <div className="TrafficLightCircle"></div>
                    <div className={`TrafficLightCircle ${color}`}></div>
                    <div className="TrafficLightCircle"></div>
                </div>
            )
        } else if (color === "green"){
            return ( 
                <div className="TrafficLightContainer">
                    <div className="TrafficLightCircle"></div>
                    <div className="TrafficLightCircle"></div>
                    <div className={`TrafficLightCircle ${color}`}></div>
                </div>
            )
        } else {
            return (
                <div className="TrafficLightContainer">
                    <div className="TrafficLightCircle"></div>
                    <div className="TrafficLightCircle"></div>
                    <div className="TrafficLightCircle"></div>
                </div>
            )
        }
    };

    const TrafficLight = ({ objects }: Props) => {
        const available: number =
            countObjects(objects.data, "sitting") / (countObjects(objects.data, "chair") + countObjects(objects.data, "sitting"));
      
        let color: "red" | "yellow" | "green" = "green"
        if (available >= 0.33 && available < 0.66) {
            color = "yellow";
        } else if (available >= 0.66 && available < 1) {
            color = "red";
        }
      
        return (
                <TrafficLightCircle color={color} />
        );
    };
    
    
    return (
        <TrafficLight objects={objects} />
    )
}

export default TrafficLight