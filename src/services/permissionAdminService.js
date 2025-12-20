import axios from "axios";

const API_BASE = "https://pbl6-backend.vercel.app/api/admin/permissions";

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
  },
});

/* =========================
   USER
========================= */
export const lookupUserByUsername = async (username) => {
  const res = await axios.get(
    `${API_BASE}/lookup-user/${username}`,
    authHeader()
  );
  return res.data;
};

export const getUserPermissions = async (userId) => {
  const res = await axios.get(`${API_BASE}/users/${userId}`, authHeader());
  return res.data;
};

export const getAvailablePermissions = async (userId, orgUnitId = null) => {
  const params = orgUnitId ? `?orgUnitId=${orgUnitId}` : "";
  const res = await axios.get(
    `${API_BASE}/users/${userId}/available${params}`,
    authHeader()
  );
  return res.data;
};

/* =========================
   PERMISSION ACTION
========================= */
export const grantPermission = async (userId, actionId, note = null) => {
  const res = await axios.post(
    `${API_BASE}/users/${userId}/grant/${actionId}`,
    { note },
    authHeader()
  );
  return res.data;
};

export const revokePermission = async (userId, actionId, note = null) => {
  const res = await axios.post(
    `${API_BASE}/users/${userId}/revoke/${actionId}`,
    { note },
    authHeader()
  );
  return res.data;
};

export const deleteOverride = async (userId, actionId) => {
  const res = await axios.delete(
    `${API_BASE}/users/${userId}/override/${actionId}`,
    authHeader()
  );
  return res.data;
};

export const applyPermissionChanges = async (userId, changes) => {
  const res = await axios.patch(
    `${API_BASE}/users/${userId}/apply-changes`,
    { changes },
    authHeader()
  );
  return res.data;
};

/* =========================
   ORG – ROLE
========================= */
export const getOrgUnits = async () => {
  const res = await axios.get(`${API_BASE}/org-units`, authHeader());
  return res.data;
};

export const getPositions = async () => {
  const res = await axios.get(`${API_BASE}/positions`, authHeader());
  return res.data;
};

export const addRoleToUser = async (
  userId,
  roleName,
  orgUnitId = null,
  position = null
) => {
  const res = await axios.post(
    `${API_BASE}/users/${userId}/add-role`,
    { roleName, orgUnitId, position },
    authHeader()
  );
  return res.data;
};
