import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import { LoginProvider } from "./components/Login/LoginContext";

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/home_student" element={<HomePage />} />
      </Routes>
    </LoginProvider>
  );  
}

export default App;
