import React, { useEffect, useState } from "react";

import url from "../Config";
import Header from "./Header";
import Footer from "./Footer";
import DrawStudio from "./DrawStudio";
import ShowAvailable from "./ShowAvailble";

import "../styles/layout.css"

type Object = {
    x: number;
    y: number;
    type: "chair" | "table" | "sitting";
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

const MobileLayout = ({props} : any) => {
    const [data, setData] = useState<Info>()

    const getData = async () => {
        try {
            const res = await fetch(url);
            const fetchData = await res.json();
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
        <div className="body_wrap_mobile">
            <Header />
            <div className="container_mobile">
                <div className="up_mobile">
                    {data ? <DrawStudio objects={data} /> : <p className="loading">Loading...</p>}
                     <div className="left_bottom_mobile">
                        <p>최근 업데이트 시점: {data ? data?.time : 'Loading...'}</p>
                    </div>
                </div>
                <div className="down_mobile">
                    {data ? <ShowAvailable objects={data} /> : <p className="loading">loading...</p>}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default MobileLayout
