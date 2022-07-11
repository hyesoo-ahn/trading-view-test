import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";
import io from "socket.io-client";
import { getCandleStick, getCandleStickData } from "../common/fetch";
import { dateFormat } from "../common/utils";
import useWebSocket from "react-use-websocket";
import { createAction } from "@reduxjs/toolkit";
const socket = io("wss://stream.binance.com:9443/ws/etheeur@trade");

export default function Home() {
  const socketUrl = "wss://stream.binance.com:9443/stream";
  const { sendJsonMessage, lastJsonMessage, readyState }: any = useWebSocket(socketUrl);
  const messageHistory = useRef<MessageEvent[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chart = useRef<any>(null);
  const resizeObserver = useRef<any>(null);
  const [priceData, setPriceData] = useState<any>([]);
  const [updateCandle, setUpdateCandle] = useState<any>({});

  // 움직이는 바 만들기 chart.update 사용?
  // n시간 있다가 candle bar 추가해야 함
  // 2초마다 마지막 candle 업데이트 해야함

  useEffect(() => {
    sendJsonMessage({
      method: "SUBSCRIBE",
      params: ["ethusdt@kline_1m"],
      id: 1,
    });

    init();
  }, []);

  const init = async (): Promise<void> => {
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
      width: chartContainerRef?.current.clientWidth,
      height: chartContainerRef?.current.clientHeight,
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

    // getIntervalData();
  };

  let num = 1;

  const getIntervalData = () => {
    setInterval(() => {
      getTimeData();
    }, 1000);
  };

  const getTimeData = async () => {
    console.log(num);
    num++;
    // console.log(lastJsonMessage);
  };

  const handleClickSendMessage = () => {
    // sendJsonMessage({
    //   method: "SUBSCRIBE",
    //   params: ["ethusdt@kline_1m"],
    //   id: 1,
    // });
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

  // useEffect(() => {
  //   if (lastJsonMessage && lastJsonMessage.result !== null) {
  //     console.log(lastJsonMessage);
  //     let currentBar = priceData[priceData.length - 1];

  //     currentBar.high = lastJsonMessage?.data?.k.h;
  //     currentBar.low = lastJsonMessage?.data?.k.l;
  //     setUpdateCandle(currentBar);
  //     // chart.current.addCandlestickSeries.update(currentBar);
  //   }
  // }, [lastJsonMessage]);

  // messageHistory.current = useMemo(
  //   () => messageHistory.current.concat(lastJsonMessage ?? []),
  //   [lastJsonMessage]
  // );

  const handleClickUnSendMessage = useCallback(
    () =>
      sendJsonMessage({
        method: "UNSUBSCRIBE",
        params: ["ethusdt@kline_1m"],
        id: 1,
      }),
    [sendJsonMessage]
  );

  return (
    <div>
      <h2 style={{ marginTop: 20, color: "#fff" }}>Trading View Chart Example</h2>
      {/* <p style={{ color: "#fff" }}>{JSON.stringify(lastJsonMessage)}</p> */}
      <div
        style={{ width: "100%", height: 700, marginTop: 20 }}
        ref={chartContainerRef}
        className="chart-container"
      />
    </div>
  );
}
