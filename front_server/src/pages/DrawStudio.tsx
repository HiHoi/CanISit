import React, { useRef, useEffect } from "react";
import { Canvas } from "canvas";

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

function drawBackground(canvas:HTMLCanvasElement ,ctx: CanvasRenderingContext2D) {
	ctx.beginPath()
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "white"

	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.lineWidth = 2;
	ctx.strokeStyle="black";
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.moveTo(canvas.width - 5, (canvas.height / 2) - 15)
	ctx.lineTo(canvas.width - 30, canvas.height / 2)
	ctx.lineTo(canvas.width - 5, (canvas.height / 2) + 15)
	ctx.closePath()
	ctx.lineWidth = 1
	ctx.strokeStyle = "grey"
	ctx.fillStyle = "grey"
	ctx.fill()
}

function drawTable(canvas:HTMLCanvasElement ,ctx: CanvasRenderingContext2D, x: number, y: number) {
	ctx.beginPath();
	ctx.fillStyle = "#0055FF"
	ctx.fillRect(Math.min(x, canvas.width - 50), Math.min(y, canvas.height - 50), 50, 50);
}

function drawChair(canvas:HTMLCanvasElement ,ctx: CanvasRenderingContext2D, x: number, y: number) {
	ctx.beginPath();
	ctx.fillStyle = "#009E6E"
	ctx.arc(Math.min(x, canvas.width - 25) + 25, Math.min(y, canvas.height - 25) + 25, 25, 0, 2 * Math.PI);
	ctx.fill();
}

function drawSitting(canvas:HTMLCanvasElement ,ctx: CanvasRenderingContext2D, x: number, y: number) {
	ctx.beginPath();
	ctx.fillStyle = '#A33B39'
	ctx.arc(Math.min(x, canvas.width - 25) + 25, Math.min(y, canvas.height - 25) + 25, 25, 0, 2 * Math.PI);
	ctx.fill();
}

type Props = {
	objects: Info;
};

function DrawStudio({ objects }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext("2d");
		const ctx1 = canvas.getContext("2d");
		if (!ctx1 || !ctx) {
			return;
		}

		drawBackground(canvas, ctx1)

		for (const obj of objects.data) {
			if (obj.type === "table") {
				drawTable(canvas, ctx, obj.x, obj.y);
			} else if (obj.type === "chair") {
				drawChair(canvas, ctx, obj.x, obj.y);
			} else if (obj.type === "sitting") {
				drawSitting(canvas, ctx, obj.x, obj.y)
			}
		}
	}, [objects]);

	return (
			<canvas className="studio" ref={canvasRef} width={700} height={500} />
	)
}

export default DrawStudio;
