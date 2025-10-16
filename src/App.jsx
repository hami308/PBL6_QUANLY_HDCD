import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import { LoginProvider } from "./components/Login/LoginContext";
import PVCD_Record from "./Pages/PVCD_Record/PVCD_Record";
import CreateAccount_Page from "./Pages/CreateAccount_Page/CreateAccount_Page";
import DeleteAccount_Page from "./Pages/DeleteAccount_Page/DeleteAccount_Page";
import StudentInfor_Page from "./Pages/StudentInfor_Page/StudentInfor_Page";
import ChangePassword_Page from "./Pages/ChangePassword_Page/ChangePassword_Page";
import TeacherInfor_Page from "./Pages/TeacherInfor_Page/TeacherInfor_Page";
import UpdatePassword_Page from "./Pages/UpdatePassword_Page/UpdatePassword_Page";
import UserAccount_Management from "./Pages/UserAccount_Management/UserAccount_Management";
import Statistical from "./Pages/Statistical_Page/Statistical_Page";
import ManageActivity_Student_Page from "../src/Pages/ManageActivity_Student_Page/ManageActivity_Student_Page";
import SubmitEvidence_Page from "../src/Pages/SubmitEvidence_Page/SubmitEvidence_Page";
import Approved_Evidence_Page from "../src/Pages/Approved_Evidence_Page/Approved_Evidence_Page";
import EvidenceDetail_Page from "../src/Pages/EvidenceDetail_Page/EvidenceDetail_Page";
import Propose_Activity_pPage from "../src/Pages/Propose_Activity_Page/Propose_Activity_Page";
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
        <Route path="/teacher-infor" element={<TeacherInfor_Page />} />
        <Route path="/change-password" element={<ChangePassword_Page />} />
        <Route path="/update-password" element={<UpdatePassword_Page />} />
        <Route
          path="/useraccount-management"
          element={<UserAccount_Management />}
        />
        <Route
          path="/statistical/Score"
          element={<Statistical activeTab="Score" />}
        />
        <Route
          path="/statistical/Activity"
          element={<Statistical activeTab="Activity" />}
        />
        <Route path="/manage-activities-student" element={<ManageActivity_Student_Page/>}/>
        <Route path="/submit-evidence" element={<SubmitEvidence_Page/>}/>
        <Route path="/approved-evidence" element={<Approved_Evidence_Page/>}/>
        <Route path="/evidence-details" element={<EvidenceDetail_Page/>}/>
        <Route path="/propose-activity" element={<Propose_Activity_pPage/>}/>
      </Routes>
      
    </LoginProvider>
  );
}

export default App;
