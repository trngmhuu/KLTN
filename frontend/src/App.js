import "./App.css";
import Layout from "./components/Layout/Layout";
import { NotificationProvider } from "./context/NotificationContext"
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <NotificationProvider>
        <Layout />
    </NotificationProvider>
  );
}

export default App;
