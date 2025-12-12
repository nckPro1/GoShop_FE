import { useState, useEffect } from "react";
import api from "./api";

// 🟢 NHẬN PROP onLogout TỪ APP
export default function ProductPage({ role, permissions, onLogout }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 0, price: 0 });

  const canCreate = permissions.includes("PRODUCT_CREATE");
  const canUpdate = permissions.includes("PRODUCT_UPDATE");
  const canDelete = permissions.includes("PRODUCT_DELETE");

  const load = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi tải sản phẩm:", err);
      // Nếu lỗi 403/401 khi tải trang, có thể tự động logout luôn nếu muốn:
      // if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      //    onLogout();
      // }
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ... (giữ nguyên các hàm create, update, del) ...
  const create = async () => { await api.post("/products", form); load(); };
  const update = async (id) => { await api.put(`/products/${id}`, form); load(); };
  const del = async (id) => { await api.delete(`/products/${id}`); load(); };

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER: Chứa tiêu đề và nút Logout */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Products Management</h2>
        
        {/* 🟢 NÚT ĐĂNG XUẤT */}
        <button 
          onClick={onLogout} 
          style={{ backgroundColor: "#ff4d4f", color: "white", border: "none", padding: "10px 20px", cursor: "pointer" }}
        >
          Logout ({role})
        </button>
      </div>

      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
        <h3>Add New Product</h3>
        <input placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} style={{ marginRight: "10px" }} />
        <input type="number" placeholder="Quantity" onChange={e => setForm({ ...form, quantity: +e.target.value })} style={{ marginRight: "10px" }} />
        <input type="number" placeholder="Price" onChange={e => setForm({ ...form, price: +e.target.value })} style={{ marginRight: "10px" }} />

        {canCreate && <button onClick={create}>Create</button>}
      </div>

      <ul>
        {products.map(p => (
          <li key={p.id} style={{ marginBottom: "10px" }}>
            <b>{p.name}</b> - Qty: {p.quantity} - Price: ${p.price}
            <span style={{ marginLeft: "20px" }}>
                {canUpdate && <button onClick={() => update(p.id)} style={{ marginRight: "5px" }}>Update</button>}
                {canDelete && <button onClick={() => del(p.id)}>Delete</button>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}