// src/services/authService.js

// Dữ liệu giả lập (sau này có thể thay bằng gọi API)
const users = [
  { username: "102220115", password: "tramy090804", name: "Trà My", role: "student" },
  { username: "102220116", password: "password123", name: "Nguyễn An", role: "student" },
  { username: "102220117", password: "abc123", name: "Lê Bình", role: "student" },
  { username: "102220114",password:"123456",name:"ABC", role:"org"},
];

export function login(username, password) {
  if (!username || !password) {
    return { success: false, message: "Vui lòng nhập đầy đủ thông tin" };
  }

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    sessionStorage.setItem("user", JSON.stringify(user));
    return { success: true, user };
  } else {
    return { success: false, message: "Tên đăng nhập hoặc mật khẩu không đúng" };
  }
}
