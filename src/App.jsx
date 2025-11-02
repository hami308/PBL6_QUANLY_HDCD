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
import ActivityDetails_Page from "../src/Pages/ActivityDetails_Page/ActivityDetails_Page";
import Propose_Activity_Page from "../src/Pages/Propose_Activity_Page/Propose_Activity_Page";
import Create_QR_Page from "./Pages/Create_QR_Page/Create_QR_Page";
import Manage_Activity_Org_Page from "./Pages/Manage_Activity_Org_Page/Manage_Activity_Org_Page";
import PermissionPage from "./Pages/Permission_Page/Permission_Page";
import Receive_Notification from "./Pages/Receive_Notification/Receive_Notification";
import List_Student_Page from "./Pages/List_Student_Page/List_Student_Page.jsx";
import Approve_Activity_Proposed_Page from "./Pages/Approve_Activity_Proposed_Page/Approve_Activity_Proposed_Page.jsx";
import OrgInfor_Page from "./Pages/OrgInfor_Page/OrgInfor_Page.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
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
        <Route path="/student-infor/:id" element={<StudentInfor_Page />} />
        <Route path="/teacher-infor" element={<TeacherInfor_Page />} />
        <Route path="/change-password" element={
          <ProtectedRoute>
            <ChangePassword_Page />
          </ProtectedRoute>}
        />
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
        <Route
          path="/manage-activities-student"
          element={<ManageActivity_Student_Page />}
        />
        <Route
          path="/submit-evidence"
          element={
            <ProtectedRoute>
              <SubmitEvidence_Page />
            </ProtectedRoute>
          }
        />
        <Route path="/approved-evidence" element={<Approved_Evidence_Page />} />
        <Route path="/evidence-details" element={<EvidenceDetail_Page />} />
        <Route
          path="/activity-details/:id"
          element={<ActivityDetails_Page />}
        />
        <Route path="/propose-activity" element={<Propose_Activity_Page />} />
        <Route path="/create-qr-attendance" element={<Create_QR_Page />} />
        <Route
          path="/manage-activity-org"
          element={<Manage_Activity_Org_Page />}
        />
        <Route path="/permission" element={<PermissionPage />} />
        <Route
          path="/receive-notification"
          element={<Receive_Notification />}
        />
        <Route
          path="/list-student-registered"
          element={<List_Student_Page activeTab="student-registered" />}
        />
        <Route
          path="/list-student-attendance"
          element={<List_Student_Page activeTab="student-attendance" />}
        />
        <Route
          path="/activity-approved"
          element={
            <Approve_Activity_Proposed_Page activeTab="activity-approved" />
          }
        />
        <Route
          path="/activity-not-yet-approved"
          element={
            <Approve_Activity_Proposed_Page activeTab="activity-not-yet-approved" />
          }
        />
        <Route path="/org-infor" element={<OrgInfor_Page />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
