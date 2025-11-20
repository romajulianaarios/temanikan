# Temanikan - Default Credentials

## 🔐 Seeded Accounts

### Admin Account (Internal Use Only)
- **Email:** `admin@temanikan.com`
- **Password:** `admin123`
- **Role:** Administrator
- **Name:** Super Admin
- **Access:** Full admin dashboard access at `/admin`

### Member Account (Demo/Testing)
- **Email:** `member@temanikan.com`
- **Password:** `12345678`
- **Role:** Member
- **Name:** Ahmad Wijaya
- **Access:** Member dashboard access at `/member`

---

## 🔒 Security Notes

### Admin Registration
- **Public registration for admin accounts has been DISABLED**
- Admin accounts can only be created internally via database seeding or manual backend configuration
- The admin account above is hardcoded in `AuthContext.tsx` for development/testing purposes
- In production, admin credentials should be stored securely in environment variables and database

### Member Registration
- Public users can ONLY register as Members via the registration form
- All public registrations default to "member" role
- No role selection or admin secret code is required for registration

---

## 📋 Authentication Flow

### Login
1. User enters email and password
2. System validates credentials against seeded accounts
3. If credentials match admin account → redirect to `/admin`
4. If credentials match member account → redirect to `/member/devices`
5. For any other valid email/password → treated as new member and redirected to `/member/devices`

### Registration
1. User clicks "Daftar" (Register)
2. **DIRECTLY** shows Member Registration Form (no role selection)
3. User fills in:
   - Nama Lengkap
   - Email
   - Nomor HP
   - Usia
   - Jenis Ikan Hias Utama
   - Password (min 8 characters)
   - Konfirmasi Password
4. Upon successful registration → redirected to login form
5. After login → redirected to `/member/devices`

---

## 🚀 Quick Test Guide

### Test Admin Access
```
1. Click "Masuk" on landing page
2. Enter: admin@temanikan.com
3. Enter: admin123
4. Click "Login"
5. You will be redirected to Admin Dashboard
```

### Test Member Access
```
1. Click "Masuk" on landing page
2. Enter: member@temanikan.com
3. Enter: 12345678
4. Click "Login"
5. You will be redirected to Member Dashboard (Garasi Robot)
```

### Test Registration
```
1. Click "Daftar" on landing page
2. Fill in all member registration fields
3. Click "Daftar Sekarang"
4. Login with your new credentials
5. You will be redirected to Member Dashboard
```

---

## 🛠️ Implementation Details

### File Changes
1. **`/components/AuthContext.tsx`**
   - Added seeded ADMIN_ACCOUNT and MEMBER_ACCOUNT constants
   - Modified login() to validate against seeded accounts
   - Removed role parameter from login function (auto-detected)
   - Returns boolean to indicate success/failure

2. **`/components/AuthModal.tsx`**
   - REMOVED role-selection view
   - REMOVED admin-code verification view
   - REMOVED admin-register view
   - Simplified to only 2 views: 'login' and 'register'
   - Register view = Member registration only
   - Added pendingRedirect state for proper navigation after login
   - Login redirects based on user.role (admin → /admin, member → /member)

3. **`/components/ProtectedRoute.tsx`**
   - Guards routes based on user role
   - Redirects unauthorized access to home page

---

## 📌 Future Considerations

### Production Deployment
- Move admin credentials to environment variables
- Implement proper password hashing (bcrypt)
- Add database-backed user management
- Implement JWT or session-based authentication
- Add email verification for new member registrations
- Implement password reset functionality
- Add rate limiting for login attempts
- Add audit logging for admin actions

### Security Best Practices
- Never expose admin credentials in client-side code
- Use HTTPS in production
- Implement CSRF protection
- Add input sanitization and validation
- Regular security audits
- Principle of least privilege for admin roles
