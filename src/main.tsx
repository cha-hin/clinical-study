import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App.tsx";

(async () => {
  if (!import.meta.env.DEV) return;

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  await worker.start({
    onUnhandledRequest: "bypass",
  });

  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
})();
