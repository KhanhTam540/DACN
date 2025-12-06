import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api", // 🔥 Kích hoạt proxy trong vite.config.js
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Suppress 404 errors cho endpoint giỏ hàng (giỏ hàng có thể không tồn tại sau khi đã tạo hóa đơn)
    if (error.response?.status === 404 && error.config?.url?.includes('/hoadon/giohang/')) {
      // Trả về một response giả với data rỗng thay vì throw error
      return Promise.resolve({
        data: {
          message: "Không tìm thấy giỏ hàng",
          data: { gioHang: null, chiTiet: [] }
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: error.config
      });
    }
    // Các lỗi khác vẫn được xử lý bình thường
    return Promise.reject(error);
  }
);

export default axiosClient;
