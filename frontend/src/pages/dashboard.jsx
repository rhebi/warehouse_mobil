import { useEffect, useState } from "react";
import axios from "../api/axios"; // Mengimpor instance Axios untuk komunikasi API
import { useAuth } from "../context/AuthContext"; // Mengimpor AuthContext untuk mendapatkan data user
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts"; // Mengimpor komponen grafik dari Recharts
import "../css/dashboard.css"; // Mengimpor CSS khusus untuk halaman dashboard

const Dashboard = () => {
    const { user } = useAuth(); // Mendapatkan data user yang sedang login
    // State untuk menyimpan berbagai data statistik dashboard
    const [monthlyTransactionsData, setMonthlyTransactionsData] = useState([]);
    const [top5Products, setTop5Products] = useState([]);
    const [warehouseUtilization, setWarehouseUtilization] = useState(0);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [totalProductsCount, setTotalProductsCount] = useState(0);
    const [totalTransactionsCount, setTotalTransactionsCount] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [monthlyInventoryMovements, setMonthlyInventoryMovements] = useState([]);
    const [totalMovementVolume, setTotalMovementVolume] = useState(0);

    // State untuk persentase stok masuk/keluar
    const [inboundOutboundPercentage, setInboundOutboundPercentage] = useState({
        inboundPercent: 0,
        outboundPercent: 0,
        totalCumulativeQuantity: 0,
    });

    const [loading, setLoading] = useState(true); // State untuk indikator loading
    const [error, setError] = useState(null); // State untuk menyimpan pesan error

    // useEffect akan berjalan saat komponen dimuat
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true); // Set loading jadi true
            setError(null); // Reset error
            try {
                // Melakukan beberapa request API secara paralel menggunakan Promise.all
                const [
                    dashboardStatsRes,
                    top5Res,
                    utilRes,
                    lowStockRes,
                    transactionStatsRes,
                    monthlyMovementsRes
                ] = await Promise.all([
                    axios.get("/dashboard", { withCredentials: true }), // Statistik umum dashboard
                    axios.get("/dashboard/top5-products", { withCredentials: true }), // Top 5 produk terlaris
                    axios.get("/dashboard/utilization", { withCredentials: true }), // Utilisasi gudang
                    axios.get("/dashboard/low-stock", { withCredentials: true }), // Produk stok rendah
                    axios.get("/transactions/stats", { withCredentials: true }), // Statistik transaksi (termasuk total revenue)
                    axios.get("/inventory-movements/monthly-stats", { withCredentials: true }), // Statistik pergerakan stok bulanan
                ]);

                // Mengupdate state dengan data yang diterima dari API
                setMonthlyTransactionsData(dashboardStatsRes.data.monthlyTransactions);
                setTotalUsersCount(dashboardStatsRes.data.totalUsers);
                setTotalProductsCount(dashboardStatsRes.data.totalProducts);
                setTotalTransactionsCount(dashboardStatsRes.data.totalTransactions);
                setTotalRevenue(transactionStatsRes.data.totalRevenue); 
                setTop5Products(top5Res.data);
                setWarehouseUtilization(utilRes.data.utilization);
                setLowStockProducts(lowStockRes.data);
                setMonthlyInventoryMovements(monthlyMovementsRes.data);
                setTotalMovementVolume(dashboardStatsRes.data.totalMovementVolume);

                // Hitung persentase stok masuk/keluar secara kumulatif
                const totalInboundCumulative = monthlyMovementsRes.data.reduce((sum, item) => sum + item.totalInbound, 0);
                const totalOutboundCumulative = monthlyMovementsRes.data.reduce((sum, item) => sum + item.totalOutbound, 0);
                const grandTotalMovement = totalInboundCumulative + totalOutboundCumulative;

                setInboundOutboundPercentage({
                    inboundPercent: grandTotalMovement > 0 ? parseFloat(((totalInboundCumulative / grandTotalMovement) * 100).toFixed(1)) : 0,
                    outboundPercent: grandTotalMovement > 0 ? parseFloat(((totalOutboundCumulative / grandTotalMovement) * 100).toFixed(1)) : 0,
                    totalCumulativeQuantity: grandTotalMovement
                });


            } catch (err) {
                console.error("Gagal mengambil data dashboard:", err); // Log error
                setError("Gagal mengambil data dari server. Pastikan backend berjalan dan kamu sudah login."); // Set pesan error
                // Reset semua state data jika terjadi error
                setMonthlyTransactionsData([]);
                setTop5Products([]);
                setWarehouseUtilization(0);
                setLowStockProducts([]);
                setTotalUsersCount(0);
                setTotalProductsCount(0);
                setTotalTransactionsCount(0);
                setTotalRevenue(0);
                setMonthlyInventoryMovements([]);
                setTotalMovementVolume(0);
                setInboundOutboundPercentage({ inboundPercent: 0, outboundPercent: 0, totalCumulativeQuantity: 0 });
            } finally {
                setLoading(false); // Set loading jadi false setelah selesai (sukses/gagal)
            }
        };

        fetchData();
    }, []); // Array dependensi kosong, berarti hanya berjalan sekali saat komponen mount

    // Data untuk Pie Chart Utilisasi Gudang
    const pieData = [
        { name: "Terpakai", value: warehouseUtilization },
        { name: "Tersedia", value: 100 - warehouseUtilization },
    ];
    const COLORS = ["#8884d8", "#d0d0d0"]; // Warna untuk Pie Chart

    // Asumsi kapasitas maksimal gudang, jika tidak diambil dari backend
    // Ini harus konsisten dengan nilai yang digunakan di backend (misal: 1000 unit)
    const maxCapacity = 1000; 

    // Perhitungan stok terpakai dalam unit berdasarkan persentase utilisasi
    const totalCurrentStock = maxCapacity * (warehouseUtilization / 100); 
    // Perhitungan sisa pemakaian gudang (persen)
    const remainingUtilization = parseFloat((100 - warehouseUtilization).toFixed(2));

    // Custom Tooltip untuk Pie Chart Utilisasi Gudang (menampilkan nama dan persentase)
    const CustomUtilizationTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${payload[0].name}: ${payload[0].value.toFixed(1)}%`}</p>
                </div>
            );
        }
        return null;
    };

    // Custom Tooltip untuk Pie Chart Persentase Pergerakan Stok
    const CustomMovementTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0];
            const name = data.name;
            const value = data.value; // Ini adalah persentase

            return (
                <div className="custom-tooltip bg-gray-800 text-white p-2 rounded shadow">
                    <p className="label">{`${name}: ${value.toFixed(1)}%`}</p>
                </div>
            );
        }
        return null;
    };


    // Menampilkan pesan loading jika data sedang dimuat
    if (loading) {
        return <div className="text-white text-center py-8">Lagi loading data dashboard...</div>;
    }

    // Menampilkan pesan error jika terjadi kesalahan
    if (error) {
        return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    return (
        <div className="p-6 text-black">
            <h1 className="text-3xl font-bold mb-4 text-white">Selamat Datang, {user?.name}!</h1> {/* Menyapa user */}

            {/* Bagian Kartu Ringkasan Data (Total Pengguna, Produk, Transaksi, Pemasukan) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Pengguna</h2>
                    <p className="text-3xl font-bold">{totalUsersCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Produk</h2>
                    <p className="text-3xl font-bold">{totalProductsCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Transaksi</h2>
                    <p className="text-3xl font-bold">{totalTransactionsCount}</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-1">Total Pemasukan</h2>
                    <p className="text-2xl font-bold">Rp {Number(totalRevenue || 0).toLocaleString('id-ID')} </p> {/* Format mata uang */}
                </div>
            </div>

            {/* Bagian Grafik */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Grafik Penjualan Bulanan (Bar Chart) */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Grafik Penjualan Bulanan</h2>
                    {monthlyTransactionsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyTransactionsData}>
                                <XAxis dataKey="month" /> {/* Sumbu X: Bulan */}
                                <YAxis /> {/* Sumbu Y: Jumlah */}
                                <Tooltip /> {/* Menampilkan detail saat hover */}
                                <Bar dataKey="total" fill="#8884d8" name="Jumlah Transaksi" /> {/* Bar grafik */}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>Belum ada data penjualan bulanan.</p>
                    )}
                </div>

                {/* Grafik Pergerakan Stok Bulanan (Masuk vs Keluar) */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Grafik Pergerakan Stok Bulanan</h2>
                    {monthlyInventoryMovements.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyInventoryMovements}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend /> {/* Legenda grafik */}
                                <Bar dataKey="totalInbound" fill="#4CAF50" name="Barang Masuk" /> {/* Bar untuk barang masuk */}
                                <Bar dataKey="totalOutbound" fill="#F44336" name="Barang Keluar" /> {/* Bar untuk barang keluar */}
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p>Belum ada data pergerakan stok bulanan.</p>
                    )}
                </div>
            </div>

            {/* Bagian Statistik Lanjutan (Top 5, Utilisasi, Stok Rendah, Persentase Masuk/Keluar) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Produk Paling Laris */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Top 5 Produk Paling Laris</h2>
                    {top5Products.length === 0 ? (
                        <p>Belum ada data produk paling laris.</p>
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

                {/* Jumlah Pemakaian Gudang (Utilisasi Gudang - Pie Chart) */}
                <div className="bg-white p-4 rounded shadow relative">
                    <h2 className="text-xl font-semibold mb-2">Jumlah Pemakaian Gudang</h2>
                    <div className="flex items-center w-full mt-2">
                        {/* Kontainer Grafik Pie Chart (40% Lebar) */}
                        <ResponsiveContainer width="40%" height={150}>
                            <PieChart>
                                <Pie
                                    data={pieData} // Data untuk pie chart
                                    dataKey="value" // Kunci nilai data
                                    outerRadius={60} // Radius luar
                                    innerRadius={0} // Radius dalam (untuk pie utuh)
                                    paddingAngle={1} // Jarak antar slice
                                >
                                    {/* Menampilkan setiap bagian pie dengan warna berbeda */}
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomUtilizationTooltip />} /> {/* Tooltip kustom */}
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Kontainer Info Teks (60% Lebar) */}
                        <div className="w-60% pl-4">
                            <div className="mb-2">
                                <p className="text-sm font-semibold text-gray-700">
                                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#8884d8' }}></span>
                                    Terpakai: <span className="font-bold">{warehouseUtilization.toFixed(1)}%</span> {/* Persentase terpakai */}
                                </p>
                                <p className="text-sm font-semibold text-gray-700">
                                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#d0d0d0' }}></span>
                                    Sisa: <span className="font-bold">{(100 - warehouseUtilization).toFixed(1)}%</span> {/* Persentase sisa */}
                                </p>
                            </div>
                            <div className="border-t pt-2">
                                <p className="text-xs text-gray-500">Stok Unit: {Math.round(totalCurrentStock).toLocaleString()}</p> {/* Stok terpakai dalam unit */}
                                <p className="text-xs text-gray-500">Kapasitas Maksimal: {maxCapacity.toLocaleString()}</p> {/* Kapasitas maksimal gudang */}
                            </div>
                        </div>
                    </div>
                </div>


                {/* Persentase Pergerakan Stok (Pie Chart) */}
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="text-xl font-semibold mb-2">Persentase Pergerakan Stok</h2>
                    {inboundOutboundPercentage.totalCumulativeQuantity > 0 ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <ResponsiveContainer width="90%" height={150}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Masuk', value: inboundOutboundPercentage.inboundPercent },
                                            { name: 'Keluar', value: inboundOutboundPercentage.outboundPercent },
                                        ]}
                                        dataKey="value"
                                        outerRadius={60}
                                    >
                                        {/* Render Cell hanya jika persentase > 0 untuk menghindari error Recharts jika value 0 */}
                                        {inboundOutboundPercentage.inboundPercent > 0 && (
                                            <Cell key="masuk" fill="#4CAF50" /> // Warna untuk "Masuk"
                                        )}
                                        {inboundOutboundPercentage.outboundPercent > 0 && (
                                            <Cell key="keluar" fill="#F44336" /> // Warna untuk "Keluar"
                                        )}
                                    </Pie>
                                    <Tooltip content={<CustomMovementTooltip />} /> {/* Tooltip kustom */}
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <p>Belum ada data pergerakan stok untuk dihitung persentase.</p>
                    )}
                </div>
            </div>

            {/* Bagian footer halaman */}
            <footer className="dashboard-footer">
                <p>© 2025 Ronaldo Luxury Car</p>
            </footer>

        </div>
    );
};

export default Dashboard; // Mengekspor komponen Dashboard