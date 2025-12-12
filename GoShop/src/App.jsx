import { useState } from "react";
import Login from "./Login";
import ProductPage from "./ProductPage";
import { jwtDecode } from "jwt-decode";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token"); // 1. Xóa token khỏi bộ nhớ
    setToken(null);                   // 2. Reset state để App render lại về màn hình Login
  };

  // Logic kiểm tra token
  if (!token || token === "undefined" || token === "null") {
    return <Login onLogin={() => setToken(localStorage.getItem("token"))} />;
  }

  // Decode token an toàn
  let role = [];
  let permissions = [];
  
  try {
    const decoded = jwtDecode(token);
    role = decoded.roles || [];
    permissions = decoded.permissions || [];
  } catch (e) {
    // Nếu token lỗi thì logout luôn
    handleLogout();
    return null; 
  }

  // 🟢 TRUYỀN HÀM handleLogout XUỐNG PRODUCTPAGE
  return (
    <ProductPage 
      role={role} 
      permissions={permissions} 
      onLogout={handleLogout} 
    />
  );
}

export default App;