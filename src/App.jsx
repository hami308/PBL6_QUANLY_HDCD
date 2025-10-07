import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import { LoginProvider } from "./components/Login/LoginContext";
import PVCD_Record from "./Pages/PVCD_Record/PVCD_Record";
<<<<<<< HEAD
import StudentInfor_Page from "./Pages/StudentInfor_Page/StudentInfor_Page";
import ChangePassword_Page from "./Pages/ChangePassword_Page/ChangePassword_Page";
import SubmitEvidence_Page from "./Pages/SubmitEvidence_Page/SubmitEvidence_Page"; 
import EvidenceDetail_Page from "./Pages/EvidenceDetail_Page/EvidenceDetail_Page.jsx";
import ManageActivity_Student_Page from "./Pages/ManageActivity_Student_Page/ManageActivity_Student_Page.jsx";
import Approved_Evidence_Page from "./Pages/Approved_Evidence_Page/Approved_Evidence_Page.jsx";

function App() {
  return (
    <LoginProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home_student" element={<HomePage />} />
          <Route path="/home-student" element={<HomePage />} />
          <Route path="/pvcd-record" element={<PVCD_Record />} />
          <Route path="/student-infor" element={<StudentInfor_Page />} />
          <Route path="/change-password" element={<ChangePassword_Page />} />
          <Route path="/submit-evidence" element={<SubmitEvidence_Page />} />
          <Route path="/evidence-details" element={<EvidenceDetail_Page />} />
          <Route path="/manage-activities-student" element={<ManageActivity_Student_Page />}/>
          <Route path="/approved-evidence" element={<Approved_Evidence_Page/>}/>
        </Routes>
=======
import CreateAccount_Page from "./pages/CreateAccount_Page/CreateAccount_Page";
import DeleteAccount_Page from "./pages/DeleteAccount_Page/DeleteAccount_Page";
function App() {
  return (
    <LoginProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home-student" element={<HomePage />} />
        <Route path="/home-admin" element={<HomePage />} />
        <Route path="/pvcd-record" element={<PVCD_Record />} />
        <Route path="/create-account" element={<CreateAccount_Page />} />
        <Route path="/delete-account" element={<DeleteAccount_Page />} />
      </Routes>
>>>>>>> HomePage
    </LoginProvider>
  );
}

export default App;
