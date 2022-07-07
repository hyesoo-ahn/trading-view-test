import React, { useEffect, useCallback, useState } from "react";
import ReactDOM from "react-dom";
import { createChart, CrosshairMode } from "lightweight-charts";
import { data } from "../data/constants";
import { getCandleStickData } from "../common/fetch";

function Page1() {
  const [dataformat, setDataformat] = useState<any>(data);

  useEffect(() => {
    getData();
    init();
  }, []);

  const getData = async () => {
    const data: any = await getCandleStickData();

    let temp = [];
    for (let i in data.length) {
      temp.push({
        time: data[i][0],
        open: data[i][1],
        high: data[i][2],
        low: data[i][3],
        close: data[i][4],
      });
    }

    setDataformat(temp);
  };

  const init = useCallback(() => {
    var chart: any = createChart(document.getElementById("chart1") as any, {
      width: 800,
      height: 500,
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      // priceScale: {
      //   scaleMargins: {
      //     top: 0.3,
      //     bottom: 0.25,
      //   },
      //   borderVisible: false,
      // },
      layout: {
        backgroundColor: "#131722",
        textColor: "#d1d4dc",
      },
      grid: {
        vertLines: {
          color: "rgba(42, 46, 57, 0)",
        },
        horzLines: {
          color: "rgba(42, 46, 57, 0.6)",
        },
      },
    });
    // var areaSeries = chart.addAreaSeries({
    //   topColor: "rgba(38,198,218, 0.56)",
    //   bottomColor: "rgba(38,198,218, 0.04)",
    //   lineColor: "rgba(38,198,218, 1)",
    //   lineWidth: 2
    // });

    // var volumeSeries = chart.addHistogramSeries({
    //   color: "#26a69a",
    //   lineWidth: 2,
    //   priceFormat: {
    //     type: "volume",
    //   },
    //   overlay: true,
    //   scaleMargins: {
    //     top: 0.8,
    //     bottom: 0,
    //   },
    // });
    var candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(dataformat);
    // volumeSeries.setData([
    //   { time: "2021-10-19", value: 19103293.0, color: "rgba(0, 150, 136, 0.8)" },
    // ]);
    var lastClose = dataformat[dataformat?.length - 1]?.close;
    var lastIndex = dataformat?.length - 1;

    var targetIndex = lastIndex + 105 + Math.round(Math.random() + 30);
    var targetPrice = getRandomPrice();

    var currentIndex = lastIndex + 1;
    var currentBusinessDay = { day: 29, month: 5, year: 2022 };
    var ticksInCurrentBar = 0;
    var currentBar: any = {
      open: null,
      high: null,
      low: null,
      close: null,
      time: currentBusinessDay,
    };
    var currentVolume: any = {
      value: null,
      time: currentBusinessDay,
    };

    function mergeTickToBar(price: any, volumn: any) {
      let color = "rgba(0, 150, 136, 0.8)";
      if (currentBar.open === null) {
        currentBar.open = price;
        currentBar.high = price;
        currentBar.low = price;
        currentBar.close = price;
      } else {
        currentBar.close = price;
        currentBar.high = Math.max(currentBar.high, price);
        currentBar.low = Math.min(currentBar.low, price);
      }
      if (currentBar.open > price) {
        color = "rgba(255,82,82, 0.8)";
      }
      if (currentVolume.value === null) {
        currentVolume.value = volumn;
      } else {
        currentVolume.value = currentVolume.value;
      }
      currentVolume.color = color;
      candleSeries.update(currentBar);
      // volumeSeries.update(currentVolume);
    }

    function reset() {
      candleSeries.setData(dataformat);
      lastClose = dataformat[dataformat?.length - 1]?.close;
      lastIndex = dataformat?.length - 1;

      targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
      targetPrice = getRandomPrice();

      currentIndex = lastIndex + 1;
      currentBusinessDay = { day: 29, month: 5, year: 2019 };
      ticksInCurrentBar = 0;
    }

    function getRandomPrice() {
      return 10 + Math.round(Math.random() * 10000) / 100;
    }

    function nextBusinessDay(time: any) {
      var d = new Date();
      d.setUTCFullYear(time.year);
      d.setUTCMonth(time.month - 1);
      d.setUTCDate(time.day + 1);
      d.setUTCHours(0, 0, 0, 0);
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
      };
    }

    setInterval(function () {
      var deltaY = targetPrice - lastClose;
      var deltaX = targetIndex - lastIndex;
      var angle = deltaY / deltaX;
      var basePrice = lastClose + (currentIndex - lastIndex) * angle;
      var noise = 0.1 - Math.random() * 0.2 + 1.0;
      var noisedPrice = basePrice * noise;
      var volumn = Math.round(Math.random() * 100000000);
      mergeTickToBar(noisedPrice, volumn);
      if (++ticksInCurrentBar === 5) {
        // move to next bar
        currentIndex++;
        currentBusinessDay = nextBusinessDay(currentBusinessDay);
        currentBar = {
          open: null,
          high: null,
          low: null,
          close: null,
          time: currentBusinessDay,
        };
        currentVolume = {
          value: null,
          time: currentBusinessDay,
          color: "rgba(0, 150, 136, 0.8)",
        };
        ticksInCurrentBar = 0;
        if (currentIndex === 5000) {
          reset();
          return;
        }
        if (currentIndex === targetIndex) {
          // change trend
          lastClose = noisedPrice;
          lastIndex = currentIndex;
          targetIndex = lastIndex + 5 + Math.round(Math.random() + 30);
          targetPrice = getRandomPrice();
        }
      }
    }, 2000);
  }, []);
  return (
    <>
      <div id="chart1" />
      {/* <div id="chart2" /> */}
      {/* <h2>Start editing to see some magic happen!</h2> */}
    </>
  );
}

export default Page1;
