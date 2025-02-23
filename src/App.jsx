import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/alertProvider";
import AppRoutes from "./AppRoutes";
import Navbar from "./components/navbar/Navbar";
import "./App.scss";

function App() {
  return (
    <AlertProvider>
      <AuthProvider>
        <Navbar />
        <AppRoutes />
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
