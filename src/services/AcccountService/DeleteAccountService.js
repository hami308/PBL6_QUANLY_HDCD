export const checkUsername = async (username) => {
  // try {
  //   const response = await fetch(`/api/accounts/${username}`);
  //   if (!response.ok)
  //     return {
  //       status: false,
  //       role: null,
  //     };

  //   const { status, role } = await response.json();
  //   return { status, role };
  // } catch (error) {
  //   console.error("Lỗi kiểm tra username:", error);
  //   return {
  //       status: false,
  //       role: null,
  //     };
  // }
  // Giả lập dữ liệu
  if (username === "student") return { status: true, role: "student" };
  if (username === "teacher") return { status: true, role: "teacher" };

  // Nếu username không khớp
  return { status: false, role: null };
};
