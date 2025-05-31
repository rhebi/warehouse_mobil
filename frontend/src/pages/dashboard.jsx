import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [top5, setTop5] = useState([]);
  const [utilization, setUtilization] = useState(0);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, top5Res, utilRes, lowStockRes] = await Promise.all([
          axios.get("/transactions/stats", { withCredentials: true }),
          axios.get("/products/top5", { withCredentials: true }),
          axios.get("/products/utilization", { withCredentials: true }),
          axios.get("/products/low-stock", { withCredentials: true }),
        ]);

        setStats(statsRes.data);
        setTop5(top5Res.data);
        setUtilization(utilRes.data.utilization);
        setLowStock(lowStockRes.data);
      } catch (error) {
        console.warn("Backend belum siap, pake data dummy");

        setStats([
          { month: "Jan", total: 10 },
          { month: "Feb", total: 25 },
          { month: "Mar", total: 15 },
          { month: "Apr", total: 30 },
          { month: "Mei", total: 20 },
        ]);
        setTop5([
          { name: "Toyota Supra", sold: 15 },
          { name: "Nissan GT-R", sold: 12 },
          { name: "BMW M4", sold: 9 },
          { name: "Lamborghini Huracan", sold: 7 },
          { name: "Honda NSX", sold: 5 },
        ]);
        setUtilization(72);
        setLowStock([
          { name: "Mazda RX-7", stock: 3 },
          { name: "Ferrari F40", stock: 2 },
        ]);
      }
    };

    fetchData();
  }, []);

  const pieData = [
    { name: "Used", value: utilization },
    { name: "Free", value: 100 - utilization },
  ];
  const COLORS = ["#8884d8", "#d0d0d0"];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}</h1>

      {/* Grafik Transaksi */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Transaksi per Bulan</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top 5 Produk Terlaris */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Top 5 Produk Terlaris</h2>
        <ul className="list-disc pl-5">
          {top5.map((product, index) => (
            <li key={index}>
              {product.name} - {product.sold} terjual
            </li>
          ))}
        </ul>
      </div>

      {/* Utilisasi Gudang */}
      <div className="mb-6 bg-white p-4 rounded shadow flex items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Utilisasi Gudang</h2>
          <p className="text-2xl font-bold">{utilization}% Terpakai</p>
        </div>
        <ResponsiveContainer width={150} height={150}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              outerRadius={60}
              innerRadius={30}
              fill="#8884d8"
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Warning Stok */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Warning: Stok Rendah</h2>
        {lowStock.length === 0 ? (
          <p>Stok aman 👍</p>
        ) : (
          <ul className="list-disc pl-5">
            {lowStock.map((product, idx) => (
              <li key={idx}>
                {product.name} - {product.stock} tersisa
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
