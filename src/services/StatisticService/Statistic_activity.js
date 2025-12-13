const BASE_URL =
  "https://pbl6-backend.vercel.app/api/statistics/activity-dashboard";

// Lấy token dùng chung
const getToken = () => sessionStorage.getItem("token");
export const filter_activity_dashboard = async (filters = {}) => {
  try {
    const query = new URLSearchParams({
      year: filters.year || "",
      field_id: filters.field_id || "",
      org_unit_id: filters.org_unit_id || "",
      status: filters.status || "",
    });
    console.log("id to chuc", filters.org_unit_id);
    const url = `${BASE_URL}?${query.toString()}`;
    console.log("Filter URL:", url);
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Lỗi lọc thống kê hoạt động:", error);
    throw error;
  }
};
