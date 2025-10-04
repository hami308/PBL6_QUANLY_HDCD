// Gọi API liên quan đến account
const API_BASE = "http://localhost:5000/api";

export const createAccount = async (accountData) => {
  const res = await fetch(`${API_BASE}/accounts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(accountData),
  });
  if (!res.ok) throw new Error("Lỗi khi tạo tài khoản");
  return res.json();
};

export const uploadAccounts = async (file, role) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("role", role);

  const res = await fetch(`${API_BASE}/accounts/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Lỗi khi upload file");
  return res.json();
};
