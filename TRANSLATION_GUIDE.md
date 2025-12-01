# 🌐 Panduan Sistem Translation Temanikan

## 📋 Overview

Sistem translation sudah dibuat dan siap digunakan! Ketika user mengklik tombol bahasa (ID/EN), seluruh website akan berubah bahasa secara otomatis.

## ✅ Yang Sudah Diimplementasikan

1. ✅ **Language Context** - Sistem global untuk manage bahasa
2. ✅ **Translation Files** - File translations lengkap (`FrontEnd/src/translations/index.ts`)
3. ✅ **Language Switcher** - Tombol ganti bahasa di navbar (DashboardLayout & AdminSidebarLayout)
4. ✅ **Beberapa Komponen** - Sudah menggunakan translation:
   - DashboardLayout (navigation, notifications, profile)
   - AdminSidebarLayout (menu, notifications)
   - MemberDevices (halaman perangkat)

## 🚀 Cara Menggunakan Translation

### 1. Import Hook Translation

```typescript
import { useTranslation } from '../contexts/LanguageContext';

function MyComponent() {
  const t = useTranslation();
  // Gunakan t() untuk mendapatkan teks
}
```

### 2. Mengganti Teks Hardcoded

**Sebelum:**
```typescript
<h1>Beranda</h1>
<button>Tambah Perangkat</button>
```

**Sesudah:**
```typescript
const t = useTranslation();

<h1>{t('nav.dashboard')}</h1>
<button>{t('device.addDevice')}</button>
```

### 3. Translation dengan Parameter

```typescript
// Translation key: 'device.greeting': 'Halo, {name}!'
<h1>{t('device.greeting', { name: user.name })}</h1>
// Output ID: "Halo, Budi!"
// Output EN: "Hello, Budi!"
```

## 📝 Translation Keys yang Tersedia

### Navigation
- `nav.dashboard` - Beranda / Dashboard
- `nav.fishpedia` - Fishpedia
- `nav.forum` - Forum
- `nav.orders` - Pesanan / Orders
- `nav.home` - Beranda / Home
- `nav.products` - Produk / Products
- `nav.login` - Masuk / Login
- `nav.register` - Daftar / Register

### Common
- `common.notifications` - Notifikasi / Notifications
- `common.loading` - Memuat... / Loading...
- `common.error` - Terjadi kesalahan / An error occurred
- `common.save` - Simpan / Save
- `common.cancel` - Batal / Cancel
- `common.delete` - Hapus / Delete
- `common.edit` - Edit
- `common.search` - Cari / Search

### Device Pages
- `device.dashboard` - Dashboard
- `device.monitoring` - Monitoring
- `device.robot` - Kontrol Robot / Robot Control
- `device.disease` - Deteksi Penyakit / Disease Detection
- `device.addDevice` - Tambah Perangkat Baru / Add New Device
- `device.greeting` - Halo, {name}! / Hello, {name}!
- `device.manageAll` - Ayo kelola semua robot... / Manage all your robots...

### Landing Page
- `landing.hero.title` - Title hero section
- `landing.hero.subtitle` - Subtitle hero
- `landing.hero.cta` - Mulai Sekarang / Get Started
- `landing.features.detection.title` - Deteksi Penyakit Ikan / Fish Disease Detection

### Dan masih banyak lagi di `FrontEnd/src/translations/index.ts`

## 🔧 Cara Menambahkan Translation Key Baru

### 1. Buka File Translations

Edit: `FrontEnd/src/translations/index.ts`

### 2. Tambahkan Key Baru

```typescript
export const translations = {
  id: {
    // ... existing keys
    'myComponent.title': 'Judul Saya',
    'myComponent.description': 'Deskripsi saya',
  },
  en: {
    // ... existing keys
    'myComponent.title': 'My Title',
    'myComponent.description': 'My Description',
  },
};
```

### 3. Gunakan di Komponen

```typescript
import { useTranslation } from '../contexts/LanguageContext';

function MyComponent() {
  const t = useTranslation();
  
  return (
    <div>
      <h1>{t('myComponent.title')}</h1>
      <p>{t('myComponent.description')}</p>
    </div>
  );
}
```

## 📋 Checklist: Komponen yang Perlu Diupdate

### Prioritas Tinggi (Halaman Utama)
- [ ] LandingPageNew (`FrontEnd/src/components/LandingPageNew.tsx`)
- [ ] Navbar (`FrontEnd/src/components/Navbar.tsx`)
- [ ] PublicFishpedia (`FrontEnd/src/components/PublicFishpedia.tsx`)
- [ ] PublicProduk (`FrontEnd/src/components/PublicProduk.tsx`)
- [x] MemberDevices (`FrontEnd/src/pages/MemberDevices.tsx`) ✅ DONE

### Device Pages
- [ ] MemberDeviceDashboard
- [ ] MemberDeviceMonitoring
- [ ] MemberDeviceRobot
- [ ] MemberDeviceDisease
- [ ] MemberDeviceNotifications
- [ ] MemberDeviceCleaningHistory
- [ ] MemberDeviceDetectionHistory

### Member Components
- [ ] MemberFishpedia
- [ ] MemberForum
- [ ] MemberProfile
- [ ] MemberSettings
- [ ] MyOrders
- [ ] AllNotifications
- [ ] DetectionHistory
- [ ] CleaningHistory

### Admin Components
- [ ] AdminOverview
- [ ] UserManagement
- [ ] RobotStatus
- [ ] DiseaseTrends
- [ ] AdminFishpedia
- [ ] ForumModeration
- [ ] SystemSettings
- [ ] AdminOrders
- [ ] AllNotifications

### Auth & Other
- [ ] AuthModal
- [ ] AddDeviceModal
- [ ] AIChatWidget

## 🎯 Contoh Update Komponen

### Contoh 1: Landing Page

```typescript
// Sebelum
<h1>Platform Edukasi, Komunitas, dan Monitoring Ikan Hias</h1>
<button>Mulai Sekarang</button>

// Sesudah
import { useTranslation } from '../contexts/LanguageContext';

function LandingPageNew() {
  const t = useTranslation();
  
  return (
    <>
      <h1>{t('landing.hero.title')}</h1>
      <button>{t('landing.hero.cta')}</button>
    </>
  );
}
```

### Contoh 2: Dengan Parameter

```typescript
// Translation key
'device.greeting': 'Halo, {name}!', // ID
'device.greeting': 'Hello, {name}!', // EN

// Usage
const t = useTranslation();
<h1>{t('device.greeting', { name: user.name })}</h1>
```

## ⚡ Tips

1. **Gunakan Key yang Konsisten**
   - Format: `category.item` (contoh: `device.addDevice`)
   - Kategori umum: `common.*`, `nav.*`, `auth.*`

2. **Fallback ke ID**
   - Jika key tidak ada di bahasa yang dipilih, akan fallback ke bahasa Indonesia
   - Jika key tidak ada sama sekali, akan return key itu sendiri

3. **Parameter Replacement**
   - Gunakan `{paramName}` dalam translation
   - Pass parameter sebagai object kedua: `t('key', { paramName: value })`

4. **Event Listener untuk Re-render**
   - Sistem otomatis trigger re-render saat bahasa berubah
   - Tidak perlu manual refresh

## 🔍 Debugging

Jika translation tidak muncul:

1. Cek apakah key ada di `translations/index.ts`
2. Cek apakah key sudah di-import dengan benar
3. Cek console untuk error
4. Pastikan komponen sudah wrap dengan `LanguageProvider`

## 📚 File-file Penting

- **Language Context**: `FrontEnd/src/contexts/LanguageContext.tsx`
- **Translations**: `FrontEnd/src/translations/index.ts`
- **Provider**: Sudah di-wrap di `FrontEnd/src/App.tsx`

## ✅ Status Implementasi

- ✅ Sistem translation core (DONE)
- ✅ Language switcher (DONE)
- ✅ DashboardLayout & AdminSidebarLayout (DONE)
- ✅ MemberDevices page (DONE)
- ⏳ Landing Page (TODO)
- ⏳ Navbar (TODO)
- ⏳ Other pages (TODO)

---

**Silakan update komponen lainnya menggunakan pola yang sama!** 🚀

