const BASE_URL = "https://pbl6-backend.vercel.app/api/statistics/grades";

// Lấy token từ sessionStorage
const getToken = () => sessionStorage.getItem("token");

export const filter_grades = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      student_number: filters.studentCode || "",
      faculty_id: filters.idfaculty || "",
      class_id: filters.selectedClass || "",
      year: filters.academicYear || "",
    });

    const url = `${BASE_URL}?${query.toString()}`;
    console.log("Filter Score URL:", url);

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi lọc điểm:", error);
    throw error;
  }
};
