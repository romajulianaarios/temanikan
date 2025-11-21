import { Routes, Route } from './Router';
import AdminSidebarLayout from './AdminSidebarLayout';
import AdminOverview from './admin/AdminOverview';
import UserManagement from './admin/UserManagement';
import RobotStatus from './admin/RobotStatus';
import DiseaseTrends from './admin/DiseaseTrends';
import AdminFishpedia from './admin/AdminFishpedia';
import ForumModeration from './admin/ForumModeration';
import SystemSettings from './admin/SystemSettings';
import AdminProfile from './admin/AdminProfile';
import AllNotifications from './admin/AllNotifications';
import AdminOrders from './admin/AdminOrders';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route path="/admin" element={
        <AdminSidebarLayout title="Dashboard Admin">
          <AdminOverview />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/users" element={
        <AdminSidebarLayout title="Manajemen Pengguna">
          <UserManagement />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/robots" element={
        <AdminSidebarLayout title="Status Robot Global">
          <RobotStatus />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/disease-trends" element={
        <AdminSidebarLayout title="Tren Deteksi Penyakit">
          <DiseaseTrends />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/fishpedia" element={
        <AdminSidebarLayout title="Kelola Fishpedia">
          <AdminFishpedia />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/forum" element={
        <AdminSidebarLayout title="Moderasi Forum">
          <ForumModeration />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/profile" element={
        <AdminSidebarLayout title="Profil Admin">
          <AdminProfile />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/settings" element={
        <AdminSidebarLayout title="Pengaturan Sistem">
          <SystemSettings />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/notifications" element={
        <AdminSidebarLayout 
          title="Semua Notifikasi"
        >
          <AllNotifications />
        </AdminSidebarLayout>
      } />
      <Route path="/admin/orders" element={
        <AdminSidebarLayout 
          title="Kelola Pesanan"
        >
          <AdminOrders />
        </AdminSidebarLayout>
      } />
    </Routes>
  );
}