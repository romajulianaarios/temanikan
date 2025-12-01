"""
Seed script untuk memasukkan data forum sample ke database
"""
import os
import sys
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from models import ForumTopic, ForumReply, User

# Create Flask app instance
app = create_app()

# Sample forum topics data
FORUM_TOPICS = [
    {
        'title': 'Tips Merawat Ikan Koi untuk Pemula',
        'content': 'Halo semua! Saya baru mulai hobi ikan koi. Ada tips untuk pemula? Khususnya tentang:\n\n1. Ukuran kolam yang ideal\n2. Kualitas air yang baik\n3. Pakan yang tepat\n4. Cara mencegah penyakit\n\nTerima kasih!',
        'category': 'Perawatan',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Masalah Air Keruh di Akuarium',
        'content': 'Akuarium saya tiba-tiba menjadi keruh setelah 2 minggu. Parameter air masih normal (pH 7.0, suhu 26°C). Apakah ini normal atau ada masalah?\n\nSudah coba ganti air 30% tapi masih keruh. Ada saran?',
        'category': 'Masalah',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Rekomendasi Filter untuk Akuarium 100 Liter',
        'content': 'Saya punya akuarium 100 liter dengan 10 ekor ikan cupang. Filter yang sekarang sudah tidak efektif lagi. Ada rekomendasi filter yang bagus dan terjangkau?\n\nBudget sekitar 200-300 ribu.',
        'category': 'Peralatan',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Cara Mengatasi Ikan Stres Setelah Pindah Akuarium',
        'content': 'Baru saja pindahkan ikan dari akuarium lama ke yang baru. Sekarang ikan terlihat stres dan tidak mau makan. Apakah ini normal?\n\nBerapa lama biasanya ikan butuh adaptasi?',
        'category': 'Perawatan',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Sharing: Akuarium Planted Pertama Saya',
        'content': 'Halo! Baru saja setup akuarium planted pertama saya. Ukuran 60x30x30 cm dengan:\n\n- Substrate: ADA Amazonia\n- Tanaman: Java Moss, Anubias, Cryptocoryne\n- Ikan: 5 ekor Neon Tetra\n\nMau sharing pengalaman dan tips dari yang sudah berpengalaman!',
        'category': 'Sharing',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Penyakit White Spot pada Ikan - Cara Mengobati',
        'content': 'Ikan saya terkena white spot (ich). Sudah coba beberapa obat tapi belum sembuh total. Ada yang punya pengalaman mengobati white spot dengan sukses?\n\nMohon sharing dosis dan cara pengobatan yang tepat.',
        'category': 'Penyakit',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Review: Robot Pembersih Akuarium Temanikan',
        'content': 'Baru saja menggunakan robot pembersih Temanikan selama 1 bulan. Overall sangat membantu! Membersihkan kotoran di dasar akuarium dengan baik.\n\nYang suka:\n- Mudah digunakan\n- Baterai tahan lama\n- Hasil bersih\n\nYang perlu diperbaiki:\n- Suara agak berisik\n- Ukuran agak besar untuk akuarium kecil\n\nRating: 4/5 ⭐',
        'category': 'Review',
        'author_email': 'member@temanikan.com'
    },
    {
        'title': 'Diskusi: Ikan Apa yang Cocok untuk Pemula?',
        'content': 'Saya baru mulai hobi ikan hias. Ingin tahu ikan apa yang paling mudah dirawat untuk pemula?\n\nYang sudah saya pertimbangkan:\n- Ikan Cupang\n- Guppy\n- Platy\n- Molly\n\nAda saran lain?',
        'category': 'Diskusi',
        'author_email': 'member@temanikan.com'
    }
]

# Sample replies
FORUM_REPLIES = [
    {
        'topic_index': 0,  # Tips Merawat Ikan Koi
        'content': 'Untuk pemula, saya sarankan:\n\n1. Kolam minimal 1000 liter untuk 3-5 ekor koi kecil\n2. Filter yang kuat (minimal 2x volume kolam per jam)\n3. Pakan berkualitas 2-3x sehari, jangan berlebihan\n4. Test air rutin (pH, ammonia, nitrite)\n5. Ganti air 10-20% setiap minggu\n\nSelamat menikmati hobi koi! 🐟',
        'author_email': 'admin@temanikan.com'
    },
    {
        'topic_index': 1,  # Air Keruh
        'content': 'Air keruh setelah 2 minggu biasanya karena:\n\n1. Bacterial bloom (normal untuk akuarium baru)\n2. Overfeeding\n3. Filter belum mature\n\nCoba:\n- Kurangi pakan sementara\n- Tambahkan bakteri starter\n- Biarkan filter bekerja 24/7\n\nBiasanya akan jernih sendiri dalam 1-2 minggu.',
        'author_email': 'admin@temanikan.com'
    },
    {
        'topic_index': 2,  # Rekomendasi Filter
        'content': 'Untuk akuarium 100 liter dengan 10 cupang, saya rekomendasikan:\n\n1. **Internal Filter**: Boyu atau Atman (150-200rb)\n2. **HOB Filter**: AquaClear atau Seachem Tidal (250-300rb)\n\nHOB lebih efektif untuk maintenance. Pastikan flow rate minimal 200-300 L/jam.',
        'author_email': 'admin@temanikan.com'
    }
]

def seed_forum():
    """Seed data forum ke database"""
    with app.app_context():
        print("\n=== Seeding Forum Data ===\n")
        
        # Check if data already exists
        existing_count = ForumTopic.query.count()
        if existing_count > 0:
            print(f"⚠️  Found {existing_count} existing forum topics")
            print("   Skipping seed (data already exists)")
            print("   To reseed, delete existing topics first\n")
            return
        
        # Get users
        member_user = User.query.filter_by(email='member@temanikan.com').first()
        admin_user = User.query.filter_by(email='admin@temanikan.com').first()
        
        if not member_user:
            print("❌ Member user not found. Please create user first.")
            return
        
        if not admin_user:
            print("❌ Admin user not found. Please create user first.")
            return
        
        # Create topics
        created_topics = []
        success_count = 0
        
        for idx, topic_data in enumerate(FORUM_TOPICS, 1):
            try:
                # Determine author
                author = member_user if topic_data['author_email'] == 'member@temanikan.com' else admin_user
                
                # Create topic with some time variation
                created_at = datetime.utcnow() - timedelta(days=len(FORUM_TOPICS) - idx, hours=idx)
                
                topic = ForumTopic(
                    title=topic_data['title'],
                    content=topic_data['content'],
                    category=topic_data['category'],
                    author_id=author.id,
                    views=idx * 5,  # Simulate some views
                    is_pinned=(idx == 1),  # Pin first topic
                    created_at=created_at,
                    updated_at=created_at
                )
                
                db.session.add(topic)
                db.session.flush()  # Get topic ID
                created_topics.append(topic)
                
                print(f"✅ [{idx}/{len(FORUM_TOPICS)}] Added topic: {topic_data['title']}")
                success_count += 1
                
            except Exception as e:
                print(f"❌ Error adding topic {idx}: {e}")
                import traceback
                traceback.print_exc()
        
        # Commit topics first
        db.session.commit()
        print(f"\n✅ Created {success_count} forum topics\n")
        
        # Add replies
        reply_count = 0
        for reply_data in FORUM_REPLIES:
            try:
                topic_index = reply_data['topic_index']
                if topic_index < len(created_topics):
                    topic = created_topics[topic_index]
                    
                    # Determine author
                    author = admin_user if reply_data['author_email'] == 'admin@temanikan.com' else member_user
                    
                    # Create reply with some time after topic
                    reply_created_at = topic.created_at + timedelta(hours=2)
                    
                    reply = ForumReply(
                        topic_id=topic.id,
                        author_id=author.id,
                        content=reply_data['content'],
                        created_at=reply_created_at,
                        updated_at=reply_created_at
                    )
                    
                    db.session.add(reply)
                    reply_count += 1
                    
            except Exception as e:
                print(f"❌ Error adding reply: {e}")
        
        # Commit replies
        if reply_count > 0:
            db.session.commit()
            print(f"✅ Created {reply_count} forum replies\n")
        
        print("=" * 70)
        print("  FORUM SEED COMPLETE")
        print("=" * 70)
        print(f"   Topics: {success_count}")
        print(f"   Replies: {reply_count}")
        print()

if __name__ == '__main__':
    seed_forum()






