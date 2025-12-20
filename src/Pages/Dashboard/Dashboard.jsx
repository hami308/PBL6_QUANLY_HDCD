import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Menu_Admin from "../../components/Admin/Menu_Admin/Menu_Admin";
import Footer from "../../components/Footer/Footer";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css";

import { getDashboardData } from "../../services/Dashboard";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDashboardData(selectedYear);
        setDashboardData(data);
        console.log("Dashboard data:", data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedYear]);

  const handleYearChange = (date) => {
    if (date) {
      const year = date.getFullYear();
      setSelectedYear(year);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">
            {payload[0].dataKey === "totalActivities"
              ? "Số hoạt động: "
              : "Điểm TB: "}
            <span style={{ color: payload[0].color, fontWeight: "bold" }}>
              {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!dashboardData) {
    return (
      <div className="no-data">
        <h3>Không tìm thấy dữ liệu</h3>
        <p>Không có dữ liệu để hiển thị cho năm này</p>
      </div>
    );
  }

  const { activity, communityPoint } = dashboardData;

  const totalActivities =
    activity?.monthly?.reduce((sum, m) => sum + m.totalActivities, 0) || 0;

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57",
    "#FFD700",
    "#FF6B6B",
    "#4ECDC4",
    "#FF9F43",
  ];

  // Tìm tháng có nhiều hoạt động nhất
  const busiestMonth =
    activity?.monthly && activity.monthly.length > 0
      ? activity.monthly.reduce((prev, current) =>
          prev.totalActivities > current.totalActivities ? prev : current
        )
      : null;

  // Tìm khoa có điểm cao nhất
  const topFaculty =
    communityPoint && communityPoint.length > 0
      ? communityPoint.reduce((prev, current) =>
          prev.avgCPoint > current.avgCPoint ? prev : current
        )
      : null;

  return (
    <>
      <Header />
      <Menu_Admin />

      <div className="dashboard-container">
        {/* Header với tiêu đề và bộ lọc */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="dashboard-title">
              Dashboard thống kê năm {selectedYear}
            </h1>
            <p className="dashboard-subtitle">
              Tổng quan hoạt động và điểm phục vụ cộng đồng
            </p>
          </div>
          <div className="header-right">
            <div className="year-selector">
              <label className="year-label">Chọn năm:</label>
              <div className="datepicker-wrapper">
                <DatePicker
                  selected={new Date(selectedYear, 0, 1)}
                  onChange={handleYearChange}
                  dateFormat="yyyy"
                  showYearPicker
                  yearItemNumber={9}
                  className="year-datepicker"
                  wrapperClassName="datepicker-wrapper"
                  calendarClassName="year-calendar"
                />
              </div>
              <div className="current-year">
                Năm hiện tại: <strong>{new Date().getFullYear()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card tổng hoạt động */}
        <div className="summary-card">
          <div className="summary-content">
            <h3>Tổng số hoạt động trong năm</h3>
            <div className="summary-value">
              {totalActivities.toLocaleString()}
            </div>
            <p className="summary-note">Hoạt động đã được tổ chức</p>
          </div>
          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value-small">
                {activity?.byOrganization?.length || 0}
              </div>
              <div className="stat-label-small">Đơn vị tổ chức</div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <div className="stat-value-small">
                {busiestMonth ? busiestMonth.month : "N/A"}
              </div>
              <div className="stat-label-small">
                Tháng nhiều hoạt động nhất{" "}
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Biểu đồ hoạt động theo tháng */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Hoạt động theo tháng</h3>
              <div className="chart-subtitle">
                Thống kê số lượng hoạt động theo từng tháng
              </div>
            </div>
            <div className="chart-content">
              {activity?.monthly && activity.monthly.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={activity.monthly}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#666" }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <YAxis
                      tick={{ fill: "#666" }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="totalActivities"
                      name="Số hoạt động"
                      fill="#3498db"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-chart">
                  <h3>Không có dữ liệu hoạt động theo tháng</h3>
                </div>
              )}
            </div>
          </div>

          {/* Biểu đồ hoạt động theo tổ chức */}
          <div className="chart-card">
            <div className="chart-header">
              <h3 className="chart-title">Hoạt động theo đơn vị tổ chức</h3>
              <div className="chart-subtitle">
                Phân bổ hoạt động theo các tổ chức
              </div>
            </div>
            <div className="chart-content">
              {activity?.byOrganization &&
              activity.byOrganization.length > 0 ? (
                <div className="pie-chart-container">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={activity.byOrganization}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={(entry) => `${entry.organization}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="totalActivities"
                        nameKey="organization"
                      >
                        {activity.byOrganization.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name, props) => [
                          `${value} hoạt động`,
                          props.payload.organization,
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="no-data-chart">
                  <h3>Không có dữ liệu hoạt động theo tổ chức</h3>
                </div>
              )}
            </div>
          </div>

          {/* Biểu đồ điểm phục vụ cộng đồng */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3 className="chart-title">Điểm phục vụ cộng đồng theo khoa</h3>
              <div className="chart-subtitle">Điểm trung bình của các khoa</div>
            </div>
            <div className="chart-content">
              {communityPoint && communityPoint.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={communityPoint}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="faculty"
                      tick={{ fontSize: 12, fill: "#666" }}
                      axisLine={{ stroke: "#ddd" }}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tick={{ fill: "#666" }}
                      axisLine={{ stroke: "#ddd" }}
                      label={{
                        value: "Điểm trung bình",
                        angle: -90,
                        position: "insideLeft",
                        offset: -10,
                        style: { textAnchor: "middle", fill: "#666" },
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="avgCPoint"
                      name="Điểm trung bình"
                      fill="#2ecc71"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="no-data-chart">
                  <h3>Không có dữ liệu điểm phục vụ cộng đồng</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin thống kê bổ sung */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Thống kê nổi bật</div>
            <div className="stat-details">
              <div className="stat-row">
                <span className="stat-name">Tổng đơn vị tổ chức:</span>
                <span className="stat-number">
                  {activity?.byOrganization?.length || 0}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Khoa có điểm cao nhất:</span>
                <span className="stat-number">
                  {topFaculty ? topFaculty.faculty : "N/A"}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Điểm cao nhất:</span>
                <span className="stat-number">
                  {topFaculty ? topFaculty.avgCPoint.toFixed(2) : "N/A"}
                </span>
              </div>
              <div className="stat-row">
                <span className="stat-name">Tháng bận nhất:</span>
                <span className="stat-number">
                  {busiestMonth
                    ? `${busiestMonth.month} (${busiestMonth.totalActivities} hoạt động)`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Tóm tắt năm {selectedYear}</div>
            <div className="stat-summary">
              <p>
                Năm {selectedYear} có tổng cộng{" "}
                <strong>{totalActivities}</strong> hoạt động được tổ chức bởi{" "}
                <strong>{activity?.byOrganization?.length || 0}</strong> đơn vị.
              </p>
              {topFaculty && (
                <p>
                  Khoa <strong>{topFaculty.faculty}</strong> có điểm phục vụ
                  cộng đồng cao nhất với{" "}
                  <strong>{topFaculty.avgCPoint.toFixed(2)}</strong> điểm.
                </p>
              )}
              {busiestMonth && (
                <p>
                  Tháng <strong>{busiestMonth.month}</strong> là tháng nhiều có
                  hoạt động nhất
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
