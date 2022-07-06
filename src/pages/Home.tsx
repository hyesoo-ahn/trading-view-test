import React, { useEffect, useRef, useState } from "react";
import { createChart, CrosshairMode } from "lightweight-charts";

// import { areaData } from './areaData';
// import { volumeData } from "../data/volumeData";
import { getCandleStickData } from "../common/fetch";
import { dateFormat } from "../common/utils";

export default function Home() {
  const chartContainerRef = useRef<any>(null);
  const chart = useRef<any>(null);
  const resizeObserver = useRef<any>(null);
  const [priceData, setPriceData] = useState<any>([]);

  const init = async () => {
    const dataResult: any = await getCandleStickData();

    let temp: any = [];
    for (let i in dataResult) {
      temp.push({
        time: dateFormat(dataResult[i][0]),
        open: dataResult[i][1],
        high: dataResult[i][2],
        low: dataResult[i][3],
        close: dataResult[i][4],
      });
    }
    // temp.push({
    //   time: dateFormat(dataResult[0][0]),
    //   open: dataResult[0][1],
    //   high: dataResult[0][2],
    //   low: dataResult[0][3],
    //   close: dataResult[0][4],
    // });

    // console.log("1", temp);
    // setPriceData(temp);

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
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      // priceScale: {
      //   borderColor: "#485c7b",
      // },
      timeScale: {
        borderColor: "#485c7b",
      },
    });

    // console.log(chart.current);
    // console.log(chartContainerRef.current);

    const candleSeries = chart.current.addCandlestickSeries({
      upColor: "#f44b5f",
      downColor: "#2850ef",
      borderDownColor: "#2850ef",
      borderUpColor: "#f44b5f",
      wickDownColor: "#2850ef",
      wickUpColor: "#f44b5f",
    });

    candleSeries.setData(temp);

    // const areaSeries = chart.current.addAreaSeries({
    //   topColor: 'rgba(38,198,218, 0.56)',
    //   bottomColor: 'rgba(38,198,218, 0.04)',
    //   lineColor: 'rgba(38,198,218, 1)',
    //   lineWidth: 2
    // });

    // areaSeries.setData(areaData);

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

    // volumeSeries.setData(volumeData);
  }, []);

  // Resize chart on container resizes.

  return (
    <div>
      <h2 style={{ marginTop: 10 }}>Trading View Chart</h2>
      <div
        style={{ width: "100%", height: 700 }}
        ref={chartContainerRef}
        className="chart-container"
      />
    </div>
  );
}
