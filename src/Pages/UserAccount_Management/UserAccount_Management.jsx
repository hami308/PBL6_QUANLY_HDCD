import Header from "../../components/Header/Header";
import Filter_Admin from "../../components/Admin/Filter_Admin/Filter_Admin";
import MenuAdmin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import CustomTable from "../../components/Custom/CustomTable";

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./UserAccount_Management.css";
import {
  getStudents,
  getTeachers,
  filterStudents,
  filterTeachers,
} from "../../services/manageAccount_Service";
import { deleteAccount } from "../../services/AcccountService/DeleteAccountService";

function UserAccount_Management() {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState("student");

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);

  // Cờ kiểm soát đã load hay chưa
  const [hasLoadedStudents, setHasLoadedStudents] = useState(false);
  const [hasLoadedTeachers, setHasLoadedTeachers] = useState(false);

  const [selectedIds, setSelectedIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data || []);
      setHasLoadedStudents(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTeachers();
      setTeachers(res?.data || []);
      setHasLoadedTeachers(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= LOAD WHEN CHANGE TAB ================= */
  useEffect(() => {
    setSelectedIds([]);
    setIsAllSelected(false);

    if (activeTab === "student" && !hasLoadedStudents) {
      fetchStudents();
    }

    if (activeTab === "teacher" && !hasLoadedTeachers) {
      fetchTeachers();
    }
  }, [activeTab, hasLoadedStudents, hasLoadedTeachers]);

  /* ================= DELETE ================= */
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

    setSelectedIds([]);
    setIsAllSelected(false);

    if (activeTab === "student") await fetchStudents();
    else await fetchTeachers();

    setLoading(false);

    if (successCount === selectedIds.length)
      alert("Xóa thành công tất cả tài khoản đã chọn.");
    else if (successCount === 0) alert("Không thể xóa tài khoản đã chọn.");
    else alert(`Đã xóa ${successCount}/${selectedIds.length} tài khoản.`);
  };

  /* ================= FILTER ================= */
  const handleFilterStudents = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await filterStudents(filters);
      setStudents(data || []);
      setHasLoadedStudents(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterTeachers = useCallback(async (filters) => {
    setLoading(true);
    try {
      const data = await filterTeachers(filters);
      setTeachers(data || []);
      setHasLoadedTeachers(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ================= JSX ================= */
  return (
    <div className="user-account-management">
      <Header />
      <MenuAdmin />

      {/* ===== TABS ===== */}
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

      <Filter_Admin
        activeTab={activeTab}
        onFilterApply={
          activeTab === "teacher" ? handleFilterTeachers : handleFilterStudents
        }
      />

      <div className="tabs-content">
        {/* ===== ACTION ===== */}
        <div className="action-buttons">
          <button
            className="select-all-btn"
            onClick={() => {
              const list = activeTab === "student" ? students : teachers;

              if (isAllSelected) {
                setSelectedIds([]);
                setIsAllSelected(false);
              } else {
                setSelectedIds(list.map((i) => i.user_id?._id).filter(Boolean));
                setIsAllSelected(true);
              }
            }}
          >
            {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
          </button>

          <button
            className="delete-selected-btn"
            disabled={selectedIds.length === 0}
            onClick={handleDeleteSelected}
          >
            🗑 Xóa
          </button>
        </div>

        {/* ===== LOADING ===== */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
          </div>
        )}

        {/* ===== STUDENT TAB ===== */}
        {!loading && activeTab === "student" && (
          <>
            <div className="tab-title">Danh sách sinh viên</div>

            {!hasLoadedStudents ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : students.length === 0 ? (
              <div className="empty-text">Không có dữ liệu</div>
            ) : (
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
                        onChange={(e) =>
                          e.target.checked
                            ? setSelectedIds((p) => [...p, item.user_id?._id])
                            : setSelectedIds((p) =>
                                p.filter((id) => id !== item.user_id?._id)
                              )
                        }
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
            )}
          </>
        )}

        {/* ===== TEACHER TAB ===== */}
        {!loading && activeTab === "teacher" && (
          <>
            <div className="tab-title">Danh sách cán bộ, giảng viên</div>

            {!hasLoadedTeachers ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : teachers.length === 0 ? (
              <div className="empty-text">Không có dữ liệu</div>
            ) : (
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
                    đơn_vị: item.org_unit_id?.name || "-",
                    chức_vụ: item.position || "-",
                    chọn: (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.user_id?._id)}
                        onChange={(e) =>
                          e.target.checked
                            ? setSelectedIds((p) => [...p, item.user_id?._id])
                            : setSelectedIds((p) =>
                                p.filter((id) => id !== item.user_id?._id)
                              )
                        }
                      />
                    ),
                    thao_tác: (
                      <button
                        className="xct"
                        onClick={() =>
                          navigate(`/staff-infor/${item.user_id?._id}`)
                        }
                      >
                        Xem chi tiết
                      </button>
                    ),
                  }))}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default UserAccount_Management;
