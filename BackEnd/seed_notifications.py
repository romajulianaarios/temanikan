"""
Script untuk seeding notifikasi ke database
Menambahkan beberapa notifikasi sample untuk admin dan member
"""

from app import create_app
from models import db, User, Notification
from datetime import datetime, timedelta

def seed_notifications():
    app = create_app('development')
    
    with app.app_context():
        print("\n=== Seeding Notifications ===\n")
        
        # Cari admin user
        admin = User.query.filter_by(role='admin', email='admin@temanikan.com').first()
        if not admin:
            print("❌ Admin user not found. Please create admin user first.")
            return
        
        print(f"✅ Found admin: {admin.email} (ID: {admin.id})")
        
        # Cari member user (jika ada)
        member = User.query.filter_by(role='member').first()
        if member:
            print(f"✅ Found member: {member.email} (ID: {member.id})")
        else:
            print("⚠️ No member user found. Will only create notifications for admin.")
        
        # Hapus notifikasi lama jika ada
        existing_count = Notification.query.count()
        if existing_count > 0:
            print(f"\n⚠️ Found {existing_count} existing notifications. Deleting...")
            Notification.query.delete()
            db.session.commit()
            print("✅ Old notifications deleted")
        
        # Sample notifications untuk admin
        admin_notifications = [
            {
                'title': 'Pesanan Baru Masuk',
                'message': 'Pesanan #ORD-2025-001 telah dibuat oleh member. Silakan verifikasi pembayaran.',
                'type': 'info',
                'is_read': False,
                'created_at': datetime.utcnow() - timedelta(hours=2)
            },
            {
                'title': 'Pengguna Baru Terdaftar',
                'message': 'Seorang pengguna baru telah mendaftar di platform Temanikan.',
                'type': 'success',
                'is_read': False,
                'created_at': datetime.utcnow() - timedelta(hours=5)
            },
            {
                'title': 'Laporan Forum Baru',
                'message': 'Ada laporan baru pada topik forum yang perlu dimoderasi.',
                'type': 'warning',
                'is_read': True,
                'created_at': datetime.utcnow() - timedelta(days=1)
            },
            {
                'title': 'Bukti Pembayaran Diterima',
                'message': 'Bukti pembayaran untuk pesanan #ORD-2025-002 telah diupload. Silakan verifikasi.',
                'type': 'info',
                'is_read': False,
                'created_at': datetime.utcnow() - timedelta(minutes=30)
            },
            {
                'title': 'Deteksi Penyakit Baru',
                'message': 'Terdapat 3 deteksi penyakit baru dalam 24 jam terakhir. Perlu perhatian.',
                'type': 'alert',
                'is_read': False,
                'created_at': datetime.utcnow() - timedelta(hours=1)
            },
            {
                'title': 'Perangkat Offline',
                'message': 'Perangkat dengan kode DEV-001 telah offline selama lebih dari 1 jam.',
                'type': 'warning',
                'is_read': True,
                'created_at': datetime.utcnow() - timedelta(hours=3)
            },
            {
                'title': 'Update Sistem',
                'message': 'Sistem telah diperbarui ke versi terbaru. Semua fitur berjalan normal.',
                'type': 'success',
                'is_read': True,
                'created_at': datetime.utcnow() - timedelta(days=2)
            }
        ]
        
        # Buat notifikasi untuk admin
        admin_count = 0
        for notif_data in admin_notifications:
            notification = Notification(
                user_id=admin.id,
                type=notif_data['type'],
                title=notif_data['title'],
                message=notif_data['message'],
                is_read=notif_data['is_read'],
                created_at=notif_data['created_at']
            )
            db.session.add(notification)
            admin_count += 1
        
        # Buat notifikasi untuk member (jika ada)
        member_count = 0
        if member:
            member_notifications = [
                {
                    'title': 'Status Pesanan Diperbarui',
                    'message': 'Pesanan #ORD-2025-001 Anda telah dikonfirmasi dan sedang diproses.',
                    'type': 'success',
                    'is_read': False,
                    'created_at': datetime.utcnow() - timedelta(hours=1)
                },
                {
                    'title': 'Pembayaran Berhasil Diupload',
                    'message': 'Bukti pembayaran Anda telah berhasil diupload. Menunggu verifikasi admin.',
                    'type': 'info',
                    'is_read': True,
                    'created_at': datetime.utcnow() - timedelta(hours=4)
                },
                {
                    'title': 'Deteksi Penyakit Ditemukan',
                    'message': 'Sistem mendeteksi kemungkinan penyakit pada ikan Anda. Silakan cek detail deteksi.',
                    'type': 'warning',
                    'is_read': False,
                    'created_at': datetime.utcnow() - timedelta(minutes=45)
                }
            ]
            
            for notif_data in member_notifications:
                notification = Notification(
                    user_id=member.id,
                    type=notif_data['type'],
                    title=notif_data['title'],
                    message=notif_data['message'],
                    is_read=notif_data['is_read'],
                    created_at=notif_data['created_at']
                )
                db.session.add(notification)
                member_count += 1
        
        # Commit semua perubahan
        try:
            db.session.commit()
            print(f"\n✅ Created {admin_count} notifications for admin")
            if member_count > 0:
                print(f"✅ Created {member_count} notifications for member")
            print(f"\n✅ Total notifications created: {admin_count + member_count}")
            
            # Tampilkan summary
            unread_admin = Notification.query.filter_by(user_id=admin.id, is_read=False).count()
            print(f"\n📊 Summary:")
            print(f"   - Admin unread: {unread_admin}")
            if member:
                unread_member = Notification.query.filter_by(user_id=member.id, is_read=False).count()
                print(f"   - Member unread: {unread_member}")
            
        except Exception as e:
            db.session.rollback()
            print(f"\n❌ Error creating notifications: {e}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    seed_notifications()
    print("\n✅ Seeding completed!")
    input("Press Enter to exit...")






