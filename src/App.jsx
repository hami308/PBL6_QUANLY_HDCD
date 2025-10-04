import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import { LoginProvider } from "./components/Login/LoginContext";
import PVCD_Record from "./Pages/PVCD_Record/PVCD_Record";

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/home_student" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home-student" element={<HomePage />} />
        <Route path="/pvcd-record" element={<PVCD_Record />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
