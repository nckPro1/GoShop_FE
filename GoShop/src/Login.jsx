import { useState } from "react";
import api from "./api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Thêm state để hiện lỗi

  const submit = async () => {
    try {
      setError(""); // Reset lỗi cũ
      const res = await api.post("/auth/login", { username, password });

      // Kiểm tra xem token có thực sự tồn tại trong response không
      if (res.data && res.data.token) {
          localStorage.setItem("token", res.data.token);
          onLogin(); // 🟢 Chỉ gọi hàm này khi login thành công
      } else {
          setError("Phản hồi từ server không chứa Token!");
      }

    } catch (err) {
      console.error("Login Error:", err);
      // Hiển thị lỗi ra màn hình cho dễ debug
      setError("Đăng nhập thất bại! Kiểm tra console.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Hiển thị lỗi */}
      
      <input placeholder="username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}