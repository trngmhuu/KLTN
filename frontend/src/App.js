import "./App.css";
import Layout from "./components/Layout/Layout";
import { NotificationProvider } from "./context/NotificationContext"

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
