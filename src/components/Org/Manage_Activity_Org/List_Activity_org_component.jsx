import React, { useState, useEffect, useMemo } from "react";
import Activity_org_component from "./Activity_org_component";
import Pagination from "../../Pagination/Pagination";
import Activity_pic from "../../../assets/images/activity.jpg";
import { filter_activities } from "../../../services/Activity_Services";

function List_Activity_org_component({ filters = {} }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orgUnitId, setOrgUnitId] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchStaffOrg = async () => {
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (!user) throw new Error("Vui lòng đăng nhập.");
        const storedOrgUnitId = sessionStorage.getItem("orgUnitId");

        setOrgUnitId(storedOrgUnitId);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStaffOrg();
  }, []);

  const memoizedFilters = useMemo(() => {
    if (!orgUnitId) return null;

    return {
      ...filters,
      org_unit_id: orgUnitId,
    };
  }, [JSON.stringify(filters), orgUnitId]);

  useEffect(() => {
    if (!memoizedFilters) return;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await filter_activities(memoizedFilters);
        if (!res.success) throw new Error(res.message);

        const data = res.data.data || res.data;

        const mapped = data.map((item) => ({
          ...item,
          image: item.image || Activity_pic,
        }));

        setActivities(mapped);
      } catch (err) {
        setError(err.message || "Lỗi tải dữ liệu.");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [memoizedFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [memoizedFilters]);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );


  if (loading) return <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="list-activity-org-component-container">
      {currentActivities.length > 0 ? (
        currentActivities.map((activity) => (
          <Activity_org_component
            key={activity._id || activity.id}
            activity={activity}
          />
        ))
      ) : (
        <p style={{ textAlign: "center" }}>Không có hoạt động nào.</p>
      )}

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}

export default List_Activity_org_component;
