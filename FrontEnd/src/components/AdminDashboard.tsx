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
import NotificationDetail from '../pages/NotificationDetail';

export default function AdminDashboard() {
  return (
    <Routes basePath="/admin">
      <Route path="" element={
        <AdminSidebarLayout title="Dashboard Admin">
          <AdminOverview />
        </AdminSidebarLayout>
      } />
      <Route path="users" element={
        <AdminSidebarLayout title="Manajemen Pengguna">
          <UserManagement />
        </AdminSidebarLayout>
      } />
      <Route path="robots" element={
        <AdminSidebarLayout title="Status Robot Global">
          <RobotStatus />
        </AdminSidebarLayout>
      } />
      <Route path="disease-trends" element={
        <AdminSidebarLayout title="Tren Deteksi Penyakit">
          <DiseaseTrends />
        </AdminSidebarLayout>
      } />
      <Route path="fishpedia" element={
        <AdminSidebarLayout title="Kelola Fishpedia">
          <AdminFishpedia />
        </AdminSidebarLayout>
      } />
      <Route path="forum" element={
        <AdminSidebarLayout title="Moderasi Forum">
          <ForumModeration />
        </AdminSidebarLayout>
      } />
      <Route path="profile" element={
        <AdminSidebarLayout title="Profil Admin">
          <AdminProfile />
        </AdminSidebarLayout>
      } />
      <Route path="settings" element={
        <AdminSidebarLayout title="Pengaturan Sistem">
          <SystemSettings />
        </AdminSidebarLayout>
      } />
      <Route path="notifications" element={
        <AdminSidebarLayout 
          title="Semua Notifikasi"
        >
          <AllNotifications />
        </AdminSidebarLayout>
      } />
      <Route path="notifications/:id" element={<NotificationDetail />} />
      <Route path="orders" element={
        <AdminSidebarLayout 
          title="Kelola Pesanan"
        >
          <AdminOrders />
        </AdminSidebarLayout>
      } />
    </Routes>
  );
}