import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes";
import Navbar from "./components/navbar/Navbar";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
