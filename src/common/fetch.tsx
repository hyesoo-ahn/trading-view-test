import axios from "axios";
const uri = "https://api.binance.com";

export const getCandleStickData = async (): Promise<boolean | object> => {
  try {
    const { data }: any = await axios.get(
      `${uri}/api/v3/klines?symbol=ETHUSDT&interval=1m&limit=500`,
      {}
    );

    return data;
  } catch (error) {
    return false;
  }
};

export const getTicker = async (): Promise<boolean | object> => {
  try {
    const { data }: any = await axios.get(`${uri}/api/v3/ticker/price`, {});
    return data;
  } catch (error) {
    return false;
  }
};
