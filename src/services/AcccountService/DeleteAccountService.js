export const checkUsername = async (username) => {
  // try {
  //   const response = await fetch(`/api/accounts/${username}`);
  //   if (!response.ok) return false;

  //   const { status } = await response.json();
  //   return status;
  // } catch (error) {
  //   console.error("Lỗi kiểm tra username:", error);
  //   return false;
  // }
  if (!username) return false;
  return true; // Giả sử username luôn tồn tại
};
