import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import io from "socket.io-client";
import { getCandleStickData } from "../common/fetch";
import { dateFormat } from "../common/utils";
const socket = io("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");

export default function Home() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);
  const resizeObserver = useRef<any>(null);
  const [priceData, setPriceData] = useState<any>([]);

  const init = async () => {
    const dataResult: any = await getCandleStickData();

    let temp: any = [];
    for (let i in dataResult) {
      temp.push({
        time: dataResult[i][0] / 1000 + 32400,
        open: dataResult[i][1],
        high: dataResult[i][2],
        low: dataResult[i][3],
        close: dataResult[i][4],
        value: dataResult[i][8],
      });
    }

    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: "#253248",
        textColor: "rgba(255, 255, 255, 0.9)",
      },
      grid: {
        vertLines: {
          color: "#334158",
        },
        horzLines: {
          color: "#334158",
        },
      },
      // timeScale: {
      //   rightOffset: 50,
      //   barSpacing: 10,
      //   fixLeftEdge: true,
      //   lockVisibleTimeRangeOnResize: true,
      //   rightBarStaysOnScroll: true,
      //   borderVisible: true,
      //   borderColor: "#fff000",
      //   visible: true,
      //   timeVisible: true,
      //   secondsVisible: true,
      // },

      crosshair: {
        mode: CrosshairMode.Normal,
      },
      // priceScale: {
      //   borderColor: "#485c7b",
      // },
      timeScale: {
        borderColor: "#485c7b",
        rightOffset: 50,
        barSpacing: 10,
        fixLeftEdge: true,
        lockVisibleTimeRangeOnResize: true,
        rightBarStaysOnScroll: true,
        borderVisible: true,
        visible: true,
        timeVisible: true,
        secondsVisible: true,
      },
    });

    const candleSeries = chart.current.addCandlestickSeries({
      upColor: "#ff4976",
      downColor: "#4bffb5",
      borderDownColor: "#4bffb5",
      borderUpColor: "#ff4976",
      wickDownColor: "#4bffb5",
      wickUpColor: "#ff4976",
    });

    candleSeries.setData(temp);
    setPriceData(temp);

    const volumeSeries = chart.current.addHistogramSeries({
      color: "#182233",
      lineWidth: 2,
      priceFormat: {
        type: "volume",
      },
      overlay: true,
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    volumeSeries.setData(temp);
  };

  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });
    resizeObserver.current.observe(chartContainerRef.current);
    return () => resizeObserver.current.disconnect();
  }, []);

  useEffect(() => {
    init();
  }, []);

  //socket for ticker
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastPong, setLastPong] = useState(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, []);

  const sendPing = () => {
    socket.emit("ping");
  };

  return (
    <div>
      <h2 style={{ marginTop: 20, color: "#fff" }}>Trading View Chart Example</h2>
      <div
        style={{ width: "100%", height: 700, marginTop: 20 }}
        ref={chartContainerRef}
        className="chart-container"
      />

      <div style={{ color: "#fff" }}>
        <p>Connected: {"" + isConnected}</p>
        <p>Last pong: {lastPong || "-"}</p>
        <button onClick={sendPing}>Send ping</button>
      </div>
    </div>
  );
}
