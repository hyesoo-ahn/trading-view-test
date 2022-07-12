import React from "react";
import { AdvancedRealTimeChart } from "react-ts-tradingview-widgets";

export default function Page4() {
  return (
    <div>
      <AdvancedRealTimeChart
        symbol={"BINANCE:ETHUSDT"}
        theme="dark"
        width={"100%"}
        height={700}
      ></AdvancedRealTimeChart>
    </div>
  );
}

// https://tradingview-widgets.jorrinkievit.xyz/docs/components/AdvancedRealTimeChartWidget
// https://www.tradingview.com/widget/advanced-chart/
