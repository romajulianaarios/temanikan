import { Routes, Route } from './Router';
import DashboardLayout from './DashboardLayout';
import MemberFishpedia from './member/MemberFishpedia';
import MemberForum from './member/MemberForum';
import MemberSettings from './member/MemberSettings';
import MemberProfile from './member/MemberProfile';
import AllNotifications from './member/AllNotifications';
import CleaningHistory from './member/CleaningHistory';
import DetectionHistory from './member/DetectionHistory';
import NewTopic from './member/NewTopic';
import TopicDetail from './member/TopicDetail';
import MyTopics from './member/MyTopics';
import MyOrders from './member/MyOrders';
import MemberDevices from '../pages/MemberDevices';
import MemberDeviceDashboard from '../pages/MemberDeviceDashboard';
import MemberDeviceMonitoring from '../pages/MemberDeviceMonitoring';
import MemberDeviceRobot from '../pages/MemberDeviceRobot';
import MemberDeviceDisease from '../pages/MemberDeviceDisease';
import MemberDeviceNotifications from '../pages/MemberDeviceNotifications';
import MemberDeviceCleaningHistory from '../pages/MemberDeviceCleaningHistory';
import MemberDeviceDetectionHistory from '../pages/MemberDeviceDetectionHistory';
import NotificationDetail from '../pages/NotificationDetail';

export default function MemberDashboard() {
  return (
    <>
      <Routes>
        {/* Default route now redirects to devices */}
        <Route path="/member" element={<MemberDevices />} />

        {/* Devices page (Garasi Robot) */}
        <Route path="/member/devices" element={<MemberDevices />} />

        {/* Device-specific routes */}
        <Route path="/member/device/:deviceId/dashboard" element={<MemberDeviceDashboard />} />
        <Route path="/member/device/:deviceId/monitoring" element={<MemberDeviceMonitoring />} />
        <Route path="/member/device/:deviceId/robot" element={<MemberDeviceRobot />} />
        <Route path="/member/device/:deviceId/disease" element={<MemberDeviceDisease />} />
        <Route path="/member/device/:deviceId/notifications" element={<MemberDeviceNotifications />} />
        <Route path="/member/device/:deviceId/cleaning-history" element={<MemberDeviceCleaningHistory />} />
        <Route path="/member/device/:deviceId/detection-history" element={<MemberDeviceDetectionHistory />} />

        {/* Global routes (tidak spesifik perangkat) */}
        <Route path="/member/fishpedia" element={
          <DashboardLayout title="Fishpedia" userType="member">
            <MemberFishpedia />
          </DashboardLayout>
        } />
        <Route path="/member/forum" element={
          <DashboardLayout title="Forum Komunitas" userType="member">
            <MemberForum />
          </DashboardLayout>
        } />
        <Route path="/member/profile" element={
          <DashboardLayout title="Profil Pengguna" userType="member">
            <MemberProfile />
          </DashboardLayout>
        } />
        <Route path="/member/settings" element={
          <DashboardLayout title="Pengaturan" userType="member">
            <MemberSettings />
          </DashboardLayout>
        } />
        <Route path="/member/orders" element={
          <DashboardLayout title="Pesanan Saya" userType="member">
            <MyOrders />
          </DashboardLayout>
        } />

        {/* Notification Routes */}
        <Route path="/member/notifications/:id" element={<NotificationDetail />} />
        <Route path="/member/notifications" element={
          <DashboardLayout
            title="Semua Notifikasi"
            userType="member"
            breadcrumbs={[
              { label: 'Notifikasi', path: '/member' },
              { label: 'Semua Notifikasi' }
            ]}
          >
            <AllNotifications />
          </DashboardLayout>
        } />

        {/* History Routes */}
        <Route path="/member/cleaning-history" element={
          <DashboardLayout
            title="Riwayat Pembersihan Lengkap"
            userType="member"
            breadcrumbs={[
              { label: 'Kontrol Robot', path: '/member/robot' },
              { label: 'Riwayat Pembersihan' }
            ]}
          >
            <CleaningHistory />
          </DashboardLayout>
        } />
        <Route path="/member/detection-history" element={
          <DashboardLayout
            title="Riwayat Deteksi Penyakit"
            userType="member"
            breadcrumbs={[
              { label: 'Deteksi Penyakit', path: '/member/disease' },
              { label: 'Riwayat Deteksi' }
            ]}
          >
            <DetectionHistory />
          </DashboardLayout>
        } />

        {/* Forum Sub-routes */}
        <Route path="/member/forum/new" element={
          <DashboardLayout
            title="Buat Topik Baru"
            userType="member"
            breadcrumbs={[
              { label: 'Forum Komunitas', path: '/member/forum' },
              { label: 'Topik Baru' }
            ]}
          >
            <NewTopic />
          </DashboardLayout>
        } />
        <Route path="/member/forum/topic/:topicId" element={
          <DashboardLayout
            title="Detail Topik"
            userType="member"
            breadcrumbs={[
              { label: 'Forum Komunitas', path: '/member/forum' },
              { label: 'Detail Topik' }
            ]}
          >
            <TopicDetail />
          </DashboardLayout>
        } />
        <Route path="/member/forum/my-topics" element={
          <DashboardLayout
            title="Topik Saya"
            userType="member"
            breadcrumbs={[
              { label: 'Forum Komunitas', path: '/member/forum' },
              { label: 'Topik Saya' }
            ]}
          >
            <MyTopics />
          </DashboardLayout>
        } />
      </Routes>
    </>
  );
}