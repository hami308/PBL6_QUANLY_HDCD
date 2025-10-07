import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import { LoginProvider } from "./components/Login/LoginContext";
import PVCD_Record from "./Pages/PVCD_Record/PVCD_Record";
import StudentInfor_Page from "./Pages/StudentInfor_Page/StudentInfor_Page";
import ChangePassword_Page from "./Pages/ChangePassword_Page/ChangePassword_Page";
import SubmitEvidence_Page from "./Pages/SubmitEvidence_Page/SubmitEvidence_Page"; 
import EvidenceDetail_Page from "./Pages/EvidenceDetail_Page/EvidenceDetail_Page.jsx";
import ManageActivity_Student_Page from "./Pages/ManageActivity_Student_Page/ManageActivity_Student_Page.jsx";
function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home_student" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home-student" element={<HomePage />} />
        <Route path="/pvcd-record" element={<PVCD_Record />} />
        <Route path="/student-infor" element={<StudentInfor_Page />} />
        <Route path="/change-password" element={<ChangePassword_Page />} />
        <Route path="/submit-evidence" element={<SubmitEvidence_Page />} />
        <Route path="/evidence-details" element={<EvidenceDetail_Page />} />
        <Route path="/manage-activities-student" element={<ManageActivity_Student_Page/>}/>
      </Routes>
    </LoginProvider>
  );
}

export default App;
