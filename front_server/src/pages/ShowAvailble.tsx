import React from "react";

import TrafficLight from "./TrafficLight";

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
    img: string
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

const ShowAvailable = ({ objects }: Props) => {
    const available: number  = (
        countObjects(objects.data, "sitting") / 
        (countObjects(objects.data, "chair") + countObjects(objects.data, "sitting"))) * 100
    return (
        <>
            <div className="trafficLight">
                <h2>1층 오픈 스튜디오의 상황:</h2>
                <TrafficLight objects={objects}/>
            </div>
            <div className="showAvailable">
                <h2>1층 오픈 스튜디오의 사용률:</h2>
                <h2 className="showAvailable_percent">
                {isNaN(available) ? 0 : Math.round(available)}%
                </h2>
            </div>
            <div className="photo_container">
                <h2>분석한 사진:</h2>
                <img className="studio_photo" src={objects.img} width={430} height={200}></img>
            </div>
        </>
    )
}

export default ShowAvailable