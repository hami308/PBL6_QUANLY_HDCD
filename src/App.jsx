import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { LoginProvider } from "./components/Login/LoginContext";
import PVCD_Record from "./Pages/PVCD_Record/PVCD_Record";
import CreateAccount_Page from "./pages/CreateAccount_Page/CreateAccount_Page";
import DeleteAccount_Page from "./pages/DeleteAccount_Page/DeleteAccount_Page";
import StudentInfor_Page from "./pages/StudentInfor_Page/StudentInfor_Page";
import ChangePassword_Page from "./Pages/ChangePassword_Page/ChangePassword_Page";

function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-account" element={<CreateAccount_Page />} />
        <Route path="/delete-account" element={<DeleteAccount_Page />} />
        <Route path="/home-student" element={<HomePage />} />
        <Route path="/home-admin" element={<HomePage />} />
        <Route path="/pvcd-record" element={<PVCD_Record />} />
        <Route path="/student-infor" element={<StudentInfor_Page />} />
        <Route path="/change-password" element={<ChangePassword_Page />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
