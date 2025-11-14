import Header from "../../components/Header/Header";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import MenuAdmin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount_Management.css";
import { getStudents, getTeachers } from "../../services/manageAccount_Service";
import { deleteAccount } from "../../services/AcccountService/DeleteAccountService";
function UserAccount_Management() {
  const [activeTab, setActiveTab] = useState("student");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  const navigate = useNavigate();
  // Lấy danh sách sinh viên
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lấy danh sách giảng viên
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi API mỗi khi đổi tab
  useEffect(() => {
    if (activeTab === "student" && students.length === 0) {
      fetchStudents();
    } else if (activeTab === "teacher" && teachers.length === 0) {
      fetchTeachers();
    }
  }, [
    activeTab,
    fetchStudents,
    fetchTeachers,
    students.length,
    teachers.length,
  ]);
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Vui lòng chọn ít nhất một tài khoản để xóa!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa các tài khoản đã chọn?")) {
      return;
    }

    setLoading(true);
    let successCount = 0;

    for (const id of selectedIds) {
      const result = await deleteAccount(id);
      if (result.success) successCount++;
    }

    setLoading(false);
    setSelectedIds([]);

    // Reload lại dữ liệu
    if (activeTab === "student") await fetchStudents();
    else await fetchTeachers();
    if (successCount === selectedIds.length) {
      alert("Xóa thành công tất cả tài khoản đã chọn.");
    }
    if (successCount === 0) {
      alert("Không thể xóa tài khoản đã chọn.");
    }
    if (successCount > 0 && successCount < selectedIds.length) {
      alert(
        `Đã xóa ${successCount}/${selectedIds.length} tài khoản thành công.`
      );
    }
  };

  return (
    <div className="user-account-management">
      <Header />
      <MenuAdmin />

      {/* Tabs */}
      <div className="management-tabs">
        <button
          className={activeTab === "student" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("student")}
        >
          Tài khoản sinh viên
        </button>
        <button
          className={activeTab === "teacher" ? "tab_active" : "tab"}
          onClick={() => setActiveTab("teacher")}
        >
          Tài khoản cán bộ, giảng viên
        </button>
      </div>

      <Filter_Admin activeTab={activeTab} />

      {/* Nội dung từng tab */}
      <div className="tabs-content">
        <div className="delete-section">
          <div className="action-buttons">
            <button
              className="select-all-btn"
              onClick={() => {
                const currentList =
                  activeTab === "student" ? students : teachers;
                if (isAllSelected) {
                  // Bỏ chọn tất cả
                  setSelectedIds([]);
                  setIsAllSelected(false);
                } else {
                  // Chọn tất cả
                  const allIds = currentList
                    .map((item) => item.user_id?._id)
                    .filter(Boolean);
                  setSelectedIds(allIds);
                  setIsAllSelected(true);
                }
              }}
            >
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </button>

            <button
              className="delete-selected-btn"
              onClick={handleDeleteSelected}
              disabled={selectedIds.length === 0}
            >
              🗑 Xóa
            </button>
          </div>
        </div>

        {/* Nếu đang loading thì hiển thị loading */}
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            {activeTab === "student" && (
              <>
                <div className="tab-title">Danh sách sinh viên</div>
                <div className="table_1">
                  <CustomTable
                    columns={[
                      "Mã sinh viên",
                      "Họ tên",
                      "Lớp",
                      "Khoa",
                      "Chọn",
                      "Thao tác",
                    ]}
                    data={students.map((item) => ({
                      mã_sinh_viên: item.student_number,
                      họ_tên: item.full_name,
                      lớp: item.class_id?.name || "-",
                      khoa: item.falcuty_name || "-",
                      chọn: (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.user_id?._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [
                                ...prev,
                                item.user_id?._id,
                              ]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((id) => id !== item.user_id?._id)
                              );
                            }
                          }}
                        />
                      ),

                      thao_tác: (
                        <button
                          className="xct"
                          onClick={() =>
                            navigate(`/student-infor/${item.user_id?._id}`)
                          }
                        >
                          Xem chi tiết
                        </button>
                      ),
                    }))}
                  />
                </div>
              </>
            )}

            {activeTab === "teacher" && (
              <>
                <div className="tab-title">Danh sách cán bộ, giảng viên</div>
                <div className="table_1">
                  <CustomTable
                    columns={[
                      "Mã giảng viên",
                      "Họ tên",
                      "Đơn vị",
                      "Chức vụ",
                      "Chọn",
                      "Thao tác",
                    ]}
                    data={teachers.map((item) => ({
                      mã_giảng_viên: item.staff_number,
                      họ_tên: item.full_name,
                      đơn_vị: item.org_unit_id?.name,
                      chức_vụ: item.position,
                      chọn: (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(item.user_id?._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedIds((prev) => [
                                ...prev,
                                item.user_id?._id,
                              ]);
                            } else {
                              setSelectedIds((prev) =>
                                prev.filter((id) => id !== item.user_id?._id)
                              );
                            }
                          }}
                        />
                      ),

                      thao_tác: (
                        <button
                          className="xct"
                          onClick={() =>
                            navigate(`/staff-infor/${item.user_id._id}`)
                          }
                        >
                          Xem chi tiết
                        </button>
                      ),
                    }))}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserAccount_Management;
