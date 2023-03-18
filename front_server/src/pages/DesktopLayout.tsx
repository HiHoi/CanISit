import React, { useEffect, useRef, useState } from "react";

import Header from "./Header";
import Footer from "./Footer";
import DrawStudio from "./DrawStudio";
import ShowAvailable from "./ShowAvailble";

import "../styles/layout.css"


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

const DesktopLayout = ({props} : any) => {
    const [data, setData] = useState<Info>()

    const getData = async () => {
        try {
            const res = await fetch("http://localhost:4000/data");
            const fetchData = await res.json();
            console.log(fetchData)
            const initData = (it: any) => {
                const info: Info = {
                time: it.time,
                data: it.data.map((object: any) => ({
                    x: object.x,
                    y: object.y,
                    type: object.type,
                })),
                now: new Date().getTime(),
                img: it.image
                };
                return info;
            };
            setData(initData(fetchData));
        } catch (e) {
            console.error(e);
            }
        };

    useEffect(() => {
        getData()
        console.log(data)
        let timer = setInterval(() => {
            getData()
            console.log(data)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    return (
        <>
            <Header />
            <div className="container_desktop">
                <div className="left_desktop">
                    {data ? <DrawStudio objects={data} /> : <p className="loading">Loading...</p>}
                    <div className="left_bottom_desktop">
                        <p>최근 업데이트 시점: {data ? data?.time : 'Loading...'}</p>
                    </div>
                </div>
                <div className="right_desktop">
                    {data ? <ShowAvailable objects={data} /> : <p className="loading">Loading...</p>}
                </div>
            </div>
            <Footer />
        </>
    )
}

export default DesktopLayout
