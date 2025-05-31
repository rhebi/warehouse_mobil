import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const Dashboard = () => {
    const { user } = useAuth();
    // Mengubah nama state untuk lebih spesifik
    const [monthlyTransactionsData, setMonthlyTransactionsData] = useState([]);
    const [top5Products, setTop5Products] = useState([]);
    const [warehouseUtilization, setWarehouseUtilization] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);

    // Menambahkan state untuk total angka
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0); // Tambahan untuk revenue

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Endpoint yang sudah disesuaikan di backend (di bawah /dashboard/)
                const [
                    dashboardStatsRes,
                    top5Res,
                    utilRes,
                    lowStockRes
                ] = await Promise.all([
                    axios.get("/dashboard", { withCredentials: true }), // Mengambil data total dan monthly transactions
                    axios.get("/dashboard/top5-products", { withCredentials: true }),
                    axios.get("/dashboard/utilization", { withCredentials: true }),
                    axios.get("/dashboard/low-stock", { withCredentials: true }),
                ]);

                // Mengolah data dari /dashboard
                setMonthlyTransactionsData(dashboardStatsRes.data.monthlyTransactions);
                setTotalUsersCount(dashboardStatsRes.data.totalUsers);
                setTotalProductsCount(dashboardStatsRes.data.totalProducts);
                setTotalTransactionsCount(dashboardStatsRes.data.totalTransactions);

                // Mengambil total revenue dari endpoint terpisah
                const transactionStatsRes = await axios.get("/transactions/stats", { withCredentials: true });
                setTotalRevenue(transactionStatsRes.data.totalRevenue);
                // setMonthlyTransactionsData(transactionStatsRes.data.monthlyTransactions); // Jika chart bulanan dari sini

                setTop5Products(top5Res.data);
                setWarehouseUtilization(utilRes.data.utilization);
                setLowStockProducts(lowStockRes.data);

            } catch (err) {
                console.error("Gagal mengambil data dashboard:", err);
                setError("Gagal mengambil data dari server. Pastikan backend berjalan dan Anda sudah login.");
                // Jangan pakai data dummy lagi, tampilkan pesan error
                setMonthlyTransactionsData([]);
                setTop5Products([]);
                setWarehouseUtilization(0);
                setLowStockProducts([]);
                setTotalUsersCount(0);
                setTotalProductsCount(0);
                setTotalTransactionsCount(0);
                setTotalRevenue(0);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Dependensi kosong agar hanya jalan sekali saat mount

    const pieData = [
        { name: "Terpakai", value: warehouseUtilization },
        { name: "Tersedia", value: 100 - warehouseUtilization },
    ];
    const COLORS = ["#8884d8", "#d0d0d0"];

    if (loading) {
        return <div className="text-center py-8">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    return (
        <div className="p-6 text-black"> {/* Pastikan warna teks sesuai dengan latar belakang */}
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome, {user?.name}</h1>

            {/* Kartu Ringkasan Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Users</h2>
                    <p className="text-3xl font-bold">{totalUsersCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Products</h2>
                    <p className="text-3xl font-bold">{totalProductsCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Transactions</h2>
                    <p className="text-3xl font-bold">{totalTransactionsCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Revenue</h2>
                    <p className="text-3xl font-bold">Rp {totalRevenue?.toLocaleString() || 0}</p>
                </div>
            </div>

            {/* Grafik Transaksi Per Bulan */}
            <div className="mb-6 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Transaksi per Bulan</h2>
                {monthlyTransactionsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyTransactionsData}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <p>Tidak ada data transaksi bulanan.</p>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Produk Terlaris */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Top 5 Produk Terlaris</h2>
                    {top5Products.length === 0 ? (
                        <p>Tidak ada data produk terlaris.</p>
                    ) : (
                        <ul className="list-disc pl-5">
                            {top5Products.map((product, index) => (
                                <li key={index}>
                                    {product.name} - {product.sold} terjual
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Utilisasi Gudang */}
                <div className="bg-white p-4 rounded shadow flex items-center gap-4">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Utilisasi Gudang</h2>
                        <p className="text-2xl font-bold">{warehouseUtilization}% Terpakai</p>
                    </div>
                    <ResponsiveContainer width={150} height={150}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                outerRadius={60}
                                innerRadius={30}
                                fill="#8884d8"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Menampilkan persentase
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Warning Stok Rendah */}
            <div className="mt-6 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Warning: Stok Rendah</h2>
                {lowStockProducts.length === 0 ? (
                    <p>Stok aman 👍</p>
                ) : (
                    <ul className="list-disc pl-5">
                        {lowStockProducts.map((product, idx) => (
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