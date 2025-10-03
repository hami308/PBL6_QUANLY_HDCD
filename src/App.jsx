import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home_student" element={<HomePage />} />
      </Routes>
    </div>
  );  
}

export default App;
