import { useCallback, useEffect, useMemo, useRef } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export default function Page2() {
  useEffect(() => {
    handleClickSendMessage();
  }, []);

  const socketUrl = "wss://stream.binance.com:9443/stream";
  const { sendJsonMessage, lastJsonMessage, readyState }: any = useWebSocket(socketUrl);
  const messageHistory = useRef<MessageEvent[]>([]);

  messageHistory.current = useMemo(
    () => messageHistory.current.concat(lastJsonMessage ?? []),
    [lastJsonMessage]
  );

  const handleClickSendMessage = useCallback(
    () =>
      sendJsonMessage({
        method: "SUBSCRIBE",
        params: ["ethusdt@kline_1m"],
        id: 1,
      }),
    [sendJsonMessage]
  );

  const handleClickUnSendMessage = useCallback(
    () =>
      sendJsonMessage({
        method: "UNSUBSCRIBE",
        params: ["ethusdt@kline_1m"],
        id: 1,
      }),
    [sendJsonMessage]
  );

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  return (
    <div className="App" style={{ color: "#fff" }}>
      <h2>Start editing to see some magic happen!</h2>
      <button onClick={handleClickUnSendMessage} disabled={readyState !== ReadyState.OPEN}>
        Unsubscribe
      </button>
      {/* <span>The WebSocket is currently {connectionStatus}</span> */}
      {lastJsonMessage ? (
        <span>Last message: {JSON.stringify(lastJsonMessage.data, null, 4)}</span>
      ) : null}
      <ul>
        {messageHistory.current.map((message, idx) => (
          <span key={idx}>{JSON.stringify(message.data, null, 4)}</span>
        ))}
      </ul>
    </div>
  );
}
