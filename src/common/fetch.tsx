import axios from "axios";

export const getCandleStickData = async (): Promise<boolean | object> => {
  try {
    const { data }: any = await axios.get(
      `https://api.binance.com/api/v3/klines?symbol=ETHBTC&interval=1d&limit=500`,
      {}
    );

    return data;
  } catch (error) {
    return false;
  }
};
