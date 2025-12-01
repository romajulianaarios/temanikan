
from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Device, WaterMonitoring, CleaningHistory, DiseaseDetection
from models import FishSpecies, ForumTopic, ForumReply, Order, Notification, ChatHistory
from models import ForumTopicLike, ForumReplyLike, ForumReport
from datetime import datetime, timedelta
from functools import wraps  # ✅ TAMBAHKAN BARIS INI
from sqlalchemy import or_
import random
import string
from werkzeug.utils import secure_filename
import os
import base64
import json
import mimetypes

def admin_required(fn):
    """
    Decorator to require admin role for endpoint access.
    Automatically handles JWT verification internally.
    """
    @wraps(fn)
    @jwt_required()  # ← TAMBAHKAN BARIS INI
    def wrapper(*args, **kwargs):
        # Get current user ID from JWT
        current_user_id = get_jwt_identity()
        # Get user from database
        user = User.query.get(current_user_id)
        
        # Check if user exists and is admin
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        if user.role != 'admin':
            return jsonify({'success': False, 'message': 'Admin access required'}), 403
        
        # User is admin, proceed to endpoint
        return fn(*args, **kwargs)
    return wrapper


def generate_fallback_response(message: str, fish_species_list):
    """
    Generate fallback response from database when AI API is not available.
    Provides helpful information based on fish species in database.
    """
    message_lower = message.lower()
    
    # Check if asking about specific fish
    for fish in fish_species_list:
        if fish.name.lower() in message_lower or (fish.scientific_name and fish.scientific_name.lower() in message_lower):
            response = f"Informasi tentang {fish.name}"
            if fish.scientific_name:
                response += f" ({fish.scientific_name})"
            response += ":\n\n"
            
            if fish.description:
                response += fish.description + "\n\n"
            
            if fish.water_temp:
                response += f"Suhu air yang disarankan: {fish.water_temp}\n"
            if fish.ph_range:
                response += f"Rentang pH: {fish.ph_range}\n"
            if fish.size:
                response += f"Ukuran: {fish.size}\n"
            if fish.diet:
                response += f"Diet: {fish.diet}\n"
            
            return response
    
    # Check for common questions
    if any(word in message_lower for word in ['penyakit', 'sakit', 'symptoms', 'gejala']):
        return """Informasi tentang Penyakit Ikan:

Penyakit ikan hias umumnya disebabkan oleh kualitas air yang buruk, stres, atau infeksi bakteri dan parasit.

Gejala umum penyakit ikan meliputi perubahan warna, bintik-bintik putih, sirip yang rusak, atau perilaku tidak normal seperti menggosok-gosokkan tubuh ke dinding akuarium.

Untuk diagnosis yang lebih akurat, disarankan untuk memeriksa kualitas air terlebih dahulu. Parameter penting meliputi suhu, pH, amonia, nitrit, dan nitrat.

Pengobatan penyakit ikan biasanya melibatkan karantina ikan yang sakit, perbaikan kualitas air, dan pemberian obat yang sesuai dengan jenis penyakit.

Pencegahan adalah kunci. Pastikan kualitas air tetap baik, hindari overfeeding, dan lakukan pembersihan rutin akuarium.

Untuk informasi lebih detail, silakan konsultasi dengan ahli akuarium atau dokter hewan."""
    
    elif any(word in message_lower for word in ['perawatan', 'cara', 'tips', 'bagaimana']):
        return """Tips Perawatan Ikan Hias:

Perawatan ikan hias yang baik dimulai dengan menjaga kualitas air. Lakukan penggantian air secara rutin, sekitar 20-30 persen setiap minggu.

Penting untuk memantau parameter air seperti suhu, pH, amonia, nitrit, dan nitrat secara berkala menggunakan test kit.

Pemberian pakan harus dilakukan dengan tepat. Hindari overfeeding karena dapat menyebabkan penumpukan amonia dan masalah kualitas air.

Pembersihan filter dan substrat harus dilakukan secara berkala, namun jangan terlalu sering karena dapat mengganggu ekosistem yang sudah terbentuk.

Pastikan akuarium memiliki sistem filtrasi yang memadai dan sirkulasi air yang baik untuk menjaga oksigen terlarut.

Informasi ini adalah panduan umum. Untuk informasi spesifik tentang jenis ikan tertentu, silakan cek FishPedia di menu navigasi."""
    
    elif any(word in message_lower for word in ['air', 'kualitas', 'ph', 'suhu', 'temperature']):
        return """Informasi tentang Kualitas Air Akuarium:

Kualitas air adalah faktor terpenting dalam perawatan ikan hias. Parameter utama yang perlu dipantau adalah suhu, pH, amonia, nitrit, dan nitrat.

Suhu air harus disesuaikan dengan kebutuhan spesies ikan. Umumnya ikan tropis membutuhkan suhu antara 24-28 derajat Celsius.

Nilai pH yang ideal bervariasi tergantung jenis ikan. Sebagian besar ikan hias tropis membutuhkan pH antara 6.5 hingga 7.5.

Amonia dan nitrit harus selalu berada di level nol. Kedua senyawa ini sangat beracun bagi ikan.

Nitrat sebaiknya dijaga di bawah 40 ppm. Nitrat yang tinggi dapat menyebabkan stres dan masalah kesehatan pada ikan.

Untuk menjaga kualitas air, lakukan penggantian air rutin, hindari overfeeding, dan pastikan sistem filtrasi berfungsi dengan baik.

Untuk informasi spesifik tentang kebutuhan air jenis ikan tertentu, silakan cek FishPedia."""
    
    else:
        # Generic helpful response
        fish_names = [f.name for f in fish_species_list[:5]]
        return f"""Halo! Saya siap membantu Anda dengan pertanyaan tentang ikan hias.

Untuk pertanyaan spesifik, silakan sebutkan nama ikan atau topik yang ingin Anda ketahui.

Beberapa jenis ikan yang tersedia di database kami antara lain: {', '.join(fish_names) if fish_names else 'tidak ada data'}.

Untuk informasi lebih lengkap, silakan:
1. Cek FishPedia di menu navigasi untuk informasi detail tentang berbagai jenis ikan
2. Gunakan fitur deteksi penyakit jika Anda memiliki foto ikan yang bermasalah
3. Kunjungi Forum untuk berdiskusi dengan komunitas

Jika Anda memiliki pertanyaan spesifik tentang jenis ikan tertentu, silakan sebutkan nama ikannya dan saya akan mencari informasi dari database.

Informasi ini berasal dari database Temanikan yang terpercaya."""


def register_routes(app):
    """Register all API routes"""
    
    UPLOAD_FOLDER = 'uploads/payment_proofs'
    DISEASE_UPLOAD_FOLDER = 'uploads/disease_detections'
    FISHPEDIA_UPLOAD_FOLDER = os.path.abspath('uploads/fishpedia')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
    IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg'}
    MAX_PAYMENT_PROOF_SIZE = 5 * 1024 * 1024  # 5 MB

    # Make sure upload folders exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(DISEASE_UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(FISHPEDIA_UPLOAD_FOLDER, exist_ok=True)

    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

    def allowed_image_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in IMAGE_EXTENSIONS

    def save_fishpedia_image(file_storage):
        if not file_storage or file_storage.filename == '':
            return None
        if not allowed_image_file(file_storage.filename):
            return None

        filename = secure_filename(file_storage.filename)
        unique_filename = f"{datetime.utcnow().strftime('%Y%m%d%H%M%S%f')}_{filename}"
        abs_path = os.path.join(FISHPEDIA_UPLOAD_FOLDER, unique_filename)
        file_storage.save(abs_path)
        return unique_filename

    def build_fishpedia_image_url(filename):
        if not filename:
            return None
        return f"/api/fishpedia/images/{filename}"

    def delete_fishpedia_image(image_url):
        if not image_url:
            return
        prefix = '/api/fishpedia/images/'
        if not image_url.startswith(prefix):
            return
        filename = image_url.replace(prefix, '', 1)
        file_path = os.path.join(FISHPEDIA_UPLOAD_FOLDER, filename)
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as remove_err:
                print(f"⚠️ Unable to delete fishpedia image {file_path}: {remove_err}")

    def parse_range(min_value, max_value, suffix=''):
        if min_value and max_value:
            base = f"{min_value}-{max_value}"
        else:
            base = min_value or max_value
        if not base:
            return None
        if suffix and suffix not in base:
            return f"{base}{suffix}"
        return base

    def get_device_online_status(last_online):
        """Return 'online' if device pinged recently, otherwise 'offline'."""
        if not last_online:
            return 'offline'

        delta = datetime.utcnow() - last_online
        # Consider device online if pinged within last 5 minutes
        return 'online' if delta <= timedelta(minutes=5) else 'offline'

    def format_last_active(last_online):
        """Human friendly text describing when device was last seen."""
        if not last_online:
            return 'Belum pernah aktif'

        delta = datetime.utcnow() - last_online
        minutes = int(delta.total_seconds() // 60)
        hours = minutes // 60
        days = delta.days

        if minutes < 1:
            return 'Baru saja'
        if minutes == 1:
            return '1 menit lalu'
        if minutes < 60:
            return f"{minutes} menit lalu"
        if hours == 1:
            return '1 jam lalu'
        if hours < 24:
            return f"{hours} jam lalu"
        if days == 1:
            return 'Kemarin'
        if days < 7:
            return f"{days} hari lalu"
        return last_online.strftime('%d %b %Y, %H:%M')

    def get_request_data():
        if request.content_type and 'application/json' in request.content_type:
            return request.get_json() or {}
        return request.form.to_dict()

    def extract_fishpedia_payload(form_data):
        payload = {}
        payload['name'] = form_data.get('name')
        payload['scientific_name'] = form_data.get('scientific_name') or form_data.get('scientificName')
        payload['category'] = form_data.get('category')
        payload['description'] = form_data.get('description')
        payload['family'] = form_data.get('family')
        payload['habitat'] = form_data.get('habitat')
        payload['care_level'] = form_data.get('difficulty') or form_data.get('care_level')
        payload['temperament'] = form_data.get('temperament')
        payload['diet'] = form_data.get('diet')
        payload['max_size'] = form_data.get('max_size') or form_data.get('size')
        payload['min_tank_size'] = form_data.get('min_tank_size') or form_data.get('tank_size')

        temp_min = form_data.get('temp_min') or form_data.get('temperature_min')
        temp_max = form_data.get('temp_max') or form_data.get('temperature_max')
        payload['water_temp'] = form_data.get('water_temp') or form_data.get('temperature_range') or parse_range(temp_min, temp_max, '°C')

        ph_min = form_data.get('ph_min') or form_data.get('phMin')
        ph_max = form_data.get('ph_max') or form_data.get('phMax')
        payload['ph_range'] = form_data.get('ph_range') or parse_range(ph_min, ph_max)

        payload['status'] = form_data.get('status') or 'draft'
        payload['image_url'] = form_data.get('image_url') or form_data.get('image')
        return payload

    def apply_fishpedia_fields(instance, payload):
        for field, value in payload.items():
            if value is not None and hasattr(instance, field):
                setattr(instance, field, value)

    def queue_notification(user_id, title, message, notif_type='info', device_id=None):
        """Queue a notification without committing the session."""
        if not user_id or not title or not message:
            return None

        notification = Notification(
            user_id=user_id,
            device_id=device_id,
            type=notif_type or 'info',
            title=title[:200],
            message=message
        )
        db.session.add(notification)
        return notification

    def notify_admins(title, message, notif_type='info'):
        """Broadcast a notification to every active admin account."""
        admins = User.query.filter_by(role='admin').all()
        created = 0
        for admin in admins:
            if admin.is_active is False:
                continue
            if queue_notification(admin.id, title, message, notif_type):
                created += 1
        return created


    # Authentication Routes
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        # Validation
        required_fields = ['name', 'email', 'password']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        # Create new user
        user = User(
            name=data['name'],
            email=data['email'],
            role='member',  # Default role
            phone=data.get('phone'),
            address=data.get('address'),
            age=data.get('age'),
            primary_fish_type=data.get('primary_fish_type')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        notify_admins(
            'Pengguna Baru Terdaftar',
            f"Member baru {user.name} ({user.email}) baru saja mendaftar.",
            'info'
        )
        db.session.commit()
        
        # UBAH: Tidak return token, hanya return success message
        return jsonify({
            'message': 'Registrasi berhasil. Silahkan masuk dengan akun yang telah dibuat.',
            'user': {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
        }), 201
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        try:
            data = request.get_json()
            
            if not data.get('email') or not data.get('password'):
                return jsonify({'error': 'Email and password are required'}), 400
            
            user = User.query.filter_by(email=data['email']).first()
            
            if not user or not user.check_password(data['password']):
                return jsonify({
                    'success': False,
                    'error': 'Invalid email or password',
                    'message': 'Invalid email or password'
                }), 401
            
            # Generate token
            access_token = create_access_token(identity=str(user.id))
            
            # ✨ TEST: Decode token immediately to verify
            from flask import current_app
            import jwt as pyjwt
            
            try:
                print("=" * 70)
                print("[TOKEN GENERATION TEST]")
                print(f"   User ID: {user.id}")
                print(f"   Token (first 50 chars): {access_token[:50]}...")
                
                # Decode with same secret key
                decoded = pyjwt.decode(
                    access_token, 
                    current_app.config['JWT_SECRET_KEY'], 
                    algorithms=['HS256']
                )
                print(f"   [SUCCESS] Decode successful!")
                print(f"   Decoded user ID (sub): {decoded.get('sub')}")
                print(f"   Issued at (iat): {decoded.get('iat')}")
                print(f"   Expires at (exp): {decoded.get('exp')}")
                
                from datetime import datetime
                iat_time = datetime.fromtimestamp(decoded.get('iat'))
                exp_time = datetime.fromtimestamp(decoded.get('exp'))
                print(f"   IAT datetime: {iat_time}")
                print(f"   EXP datetime: {exp_time}")
                print("=" * 70)
            except Exception as decode_error:
                print(f"   [ERROR] Decode failed: {decode_error}")
                print("=" * 70)
            
            return jsonify({
                'success': True,
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            import traceback
            traceback.print_exc()
            error_detail = str(e)
            return jsonify({
                'success': False,
                'error': 'Internal server error',
                'message': f'Login gagal: {error_detail}'
            }), 500

    @app.route('/api/auth/me', methods=['GET'])
    @jwt_required()
    def get_current_user():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    # Device Routes
    @app.route('/api/devices', methods=['GET'])
    @jwt_required()
    def get_devices():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role == 'admin':
            devices = Device.query.all()
        else:
            devices = Device.query.filter_by(user_id=user_id).all()
        
        return jsonify({'devices': [d.to_dict() for d in devices]}), 200
    
    @app.route('/api/devices', methods=['POST'])
    @jwt_required()
    def add_device():
        """Add a new device for the current user"""
        try:
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)  # Convert string to int
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            data = request.get_json() or {}
            
            # Validate required fields
            if not data.get('name'):
                return jsonify({'error': 'Device name is required'}), 400
            
            device_code = data.get('device_code')
            if not device_code:
                return jsonify({'error': 'Device code is required'}), 400
            
            # Check if device_code already exists
            existing_device = Device.query.filter_by(device_code=device_code).first()
            if existing_device:
                return jsonify({'error': 'Device code already exists'}), 400
            
            # Create new device
            new_device = Device(
                name=data['name'],
                device_code=device_code,
                user_id=user_id,
                status='active',
                robot_status='idle',
                battery_level=100,
                last_online=datetime.utcnow()
            )
            
            db.session.add(new_device)
            db.session.commit()
            
            print(f"✅ Device added successfully!")
            print(f"   User: {user.name} ({user.email})")
            print(f"   Device Name: {data['name']}")
            print(f"   Device Code: {device_code}")
            print(f"   Device ID: {new_device.id}")
            
            return jsonify({
                'message': 'Device added successfully',
                'device': new_device.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error adding device: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': 'Failed to add device'}), 500
    
    @app.route('/api/devices/<int:device_id>', methods=['GET'])
    @jwt_required()
    def get_device(device_id):
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)  # Convert string to int
        device = Device.query.get(device_id)
        
        print(f"🔍 GET Device Request:")
        print(f"   Device ID: {device_id}")
        print(f"   User ID from JWT (string): {user_id_str}")
        print(f"   User ID (converted to int): {user_id}")
        
        if not device:
            print(f"   ❌ Device not found")
            return jsonify({'error': 'Device not found'}), 404
        
        print(f"   Device owner user_id: {device.user_id}")
        
        user = User.query.get(user_id)
        print(f"   User role: {user.role if user else 'None'}")
        
        if device.user_id != user_id and user.role != 'admin':
            print(f"   ❌ Access denied: device.user_id({device.user_id}) != user_id({user_id})")
            return jsonify({'error': 'Unauthorized access'}), 403
        
        print(f"   ✅ Access granted")
        return jsonify({'device': device.to_dict()}), 200
    
    @app.route('/api/member/devices', methods=['GET'])
    @jwt_required()
    def get_member_devices():
        """Get user's devices with formatted data for frontend"""
        try:
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Get all devices for this user
            devices = Device.query.filter_by(user_id=user_id).all()
            
            # Format devices for frontend
            formatted_devices = []
            for device in devices:
                formatted_devices.append({
                    'id': str(device.id),  # Convert to string for frontend
                    'namaPerangkat': device.name,
                    'uniqueID': device.device_code,
                    'status': get_device_online_status(device.last_online),
                    'lastActive': format_last_active(device.last_online)
                })
            
            # Calculate stats
            total_devices = len(formatted_devices)
            online_devices = sum(1 for d in formatted_devices if d['status'] == 'online')
            offline_devices = total_devices - online_devices
            
            return jsonify({
                'success': True,
                'devices': formatted_devices,
                'stats': {
                    'total': total_devices,
                    'online': online_devices,
                    'offline': offline_devices
                }
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching member devices: {e}")
            return jsonify({
                'success': False,
                'error': 'Failed to fetch devices'
            }), 500
    
    # Device Dashboard Data Endpoints - Dummy Data with Realistic Variations
    @app.route('/api/devices/<int:device_id>/dashboard/water-latest', methods=['GET'])
    @jwt_required()
    def get_device_water_latest(device_id):
        """Get latest water quality readings for device dashboard (dummy data)"""
        try:
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)  # Convert string to int
            device = Device.query.get(device_id)
            
            if not device:
                return jsonify({'error': 'Device not found'}), 404
            
            user = User.query.get(user_id)
            if device.user_id != user_id and user.role != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
            
            # Generate realistic dummy data with slight variations
            import random
            
            # Base values ± small random variation
            ph_value = round(7.0 + random.uniform(-0.3, 0.3), 1)
            temp_value = round(26.0 + random.uniform(-2, 2), 1)
            turbidity_value = round(2.0 + random.uniform(-0.5, 0.5), 1)
            oxygen_value = round(7.0 + random.uniform(-0.5, 0.5), 1)
            ammonia_value = round(0.02 + random.uniform(-0.01, 0.01), 2)
            
            # Determine status based on values
            def get_status(value, min_val, max_val):
                return 'optimal' if min_val <= value <= max_val else 'warning'
            
            return jsonify({
                'success': True,
                'data': {
                    'ph': {
                        'value': ph_value,
                        'unit': '',
                        'status': get_status(ph_value, 6.5, 7.5),
                        'trend': round(random.uniform(-0.3, 0.3), 1)
                    },
                    'temperature': {
                        'value': temp_value,
                        'unit': '°C',
                        'status': get_status(temp_value, 24, 28),
                        'trend': round(random.uniform(-0.5, 0.5), 1)
                    },
                    'turbidity': {
                        'value': turbidity_value,
                        'unit': 'NTU',
                        'status': 'good' if turbidity_value < 5 else 'warning',
                        'trend': round(random.uniform(-0.2, 0.2), 1)
                    },
                    'oxygen': {
                        'value': oxygen_value,
                        'unit': 'mg/L',
                        'status': get_status(oxygen_value, 6.0, 8.0)
                    },
                    'ammonia': {
                        'value': ammonia_value,
                        'unit': 'ppm',
                        'status': 'good' if ammonia_value < 0.05 else 'warning'
                    },
                    'timestamp': datetime.utcnow().isoformat()
                }
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching water data: {e}")
            return jsonify({'success': False, 'error': 'Failed to fetch water data'}), 500
    
    @app.route('/api/devices/<int:device_id>/dashboard/robot-status', methods=['GET'])
    @jwt_required()
    def get_device_robot_status(device_id):
        """Get robot status for device dashboard (dummy data)"""
        try:
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)  # Convert string to int
            device = Device.query.get(device_id)
            
            if not device:
                return jsonify({'error': 'Device not found'}), 404
            
            user = User.query.get(user_id)
            if device.user_id != user_id and user.role != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
            
            import random
            
            # Random robot status
            statuses = ['idle', 'idle', 'idle', 'cleaning', 'charging']  # Mostly idle
            robot_status = random.choice(statuses)
            
            # Battery level (higher when charging, lower when cleaning)
            if robot_status == 'charging':
                battery = random.randint(85, 100)
            elif robot_status == 'cleaning':
                battery = random.randint(60, 85)
            else:  # idle
                battery = random.randint(75, 95)
            
            # Generate times
            from datetime import datetime, timedelta
            last_cleaning_time = datetime.utcnow() - timedelta(hours=random.randint(1, 6))
            next_cleaning_time = datetime.utcnow() + timedelta(hours=random.randint(1, 12))
            
            return jsonify({
                'success': True,
                'data': {
                    'status': robot_status,
                    'status_text': {
                        'idle': 'Siap',
                        'cleaning': 'Sedang Membersihkan',
                        'charging': 'Mengisi Daya'
                    }.get(robot_status, 'Siap'),
                    'battery': battery,
                    'last_cleaning': last_cleaning_time.isoformat(),
                    'last_cleaning_text': format_last_active(last_cleaning_time),
                    'next_cleaning': next_cleaning_time.isoformat(),
                    'next_cleaning_text': f"Hari ini, {next_cleaning_time.strftime('%H:%M')}"
                }
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching robot status: {e}")
            return jsonify({'success': False, 'error': 'Failed to fetch robot status'}), 500
    
    @app.route('/api/devices/<int:device_id>/dashboard/disease-latest', methods=['GET'])
    @jwt_required()
    def get_device_disease_latest(device_id):
        """Get latest disease detection for device dashboard (dummy data)"""
        try:
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)  # Convert string to int
            device = Device.query.get(device_id)
            
            if not device:
                return jsonify({'error': 'Device not found'}), 404
            
            user = User.query.get(user_id)
            if device.user_id != user_id and user.role != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
            
            import random
            
            # 70% chance no disease, 30% chance disease detected
            has_disease = random.random() < 0.3
            
            if has_disease:
                diseases = [
                    {'name': 'White Spot', 'severity': 'medium', 'fish': 'Ikan Koi'},
                    {'name': 'Fin Rot', 'severity': 'low', 'fish': 'Ikan Mas'},
                    {'name': 'Ich', 'severity': 'medium', 'fish': 'Ikan Koi'},
                    {'name': 'Fungal Infection', 'severity': 'high', 'fish': 'Ikan Nila'}
                ]
                disease = random.choice(diseases)
                
                detection_time = datetime.utcnow() - timedelta(hours=random.randint(1, 5))
                
                return jsonify({
                    'success': True,
                    'has_detection': True,
                    'data': {
                        'fish_type': disease['fish'],
                        'disease_name': disease['name'],
                        'severity': disease['severity'],
                        'severity_text': {
                            'low': 'Ringan',
                            'medium': 'Sedang',
                            'high': 'Tinggi'
                        }.get(disease['severity'], 'Sedang'),
                        'confidence': round(random.uniform(0.75, 0.95), 2),
                        'detected_at': detection_time.isoformat(),
                        'detected_at_text': format_last_active(detection_time),
                        'image_url': 'https://images.unsplash.com/photo-1718632496269-6c0fd71dc29c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80'
                    }
                }), 200
            else:
                return jsonify({
                    'success': True,
                    'has_detection': False,
                    'data': {
                        'message': 'Tidak ada penyakit terdeteksi',
                        'last_check': datetime.utcnow().isoformat()
                    }
                }), 200
                
        except Exception as e:
            print(f"❌ Error fetching disease detection: {e}")
            return jsonify({'success': False, 'error': 'Failed to fetch disease detection'}), 500
    
    @app.route('/api/devices/<int:device_id>/dashboard/notifications-recent', methods=['GET'])
    @jwt_required()
    def get_device_notifications_recent(device_id):
        """Get recent notifications for device dashboard (dummy data)"""
        try:
            user_id_str = get_jwt_identity()
            user_id = int(user_id_str)  # Convert string to int
            device = Device.query.get(device_id)
            
            if not device:
                return jsonify({'error': 'Device not found'}), 404
            
            user = User.query.get(user_id)
            if device.user_id != user_id and user.role != 'admin':
                return jsonify({'error': 'Unauthorized access'}), 403
            
            import random
            
            # Generate 3-5 recent notifications
            notification_templates = [
                {'type': 'info', 'icon': 'clock', 'message': 'Pembersihan otomatis dijadwalkan pada {time}', 'color': '#8280FF'},
                {'type': 'success', 'icon': 'check', 'message': 'Kualitas air dalam kondisi optimal', 'color': '#4AD991'},
                {'type': 'warning', 'icon': 'alert', 'message': 'Terdeteksi gejala awal penyakit pada Ikan Koi', 'color': '#CE3939'},
                {'type': 'info', 'icon': 'droplet', 'message': 'pH air stabil di level optimal', 'color': '#4880FF'},
                {'type': 'success', 'icon': 'check', 'message': 'Pembersihan selesai dilakukan', 'color': '#4AD991'},
                {'type': 'info', 'icon': 'battery', 'message': 'Baterai robot terisi penuh', 'color': '#8280FF'},
            ]
            
            num_notifications = random.randint(3, 5)
            selected = random.sample(notification_templates, num_notifications)
            
            notifications = []
            for i, template in enumerate(selected):
                hours_ago = i + 1
                notif_time = datetime.utcnow() - timedelta(hours=hours_ago)
                
                message = template['message']
                if '{time}' in message:
                    scheduled = datetime.utcnow() + timedelta(hours=random.randint(2, 8))
                    message = message.format(time=scheduled.strftime('%H:%M'))
                
                notifications.append({
                    'id': i + 1,
                    'type': template['type'],
                    'icon': template['icon'],
                    'message': message,
                    'time': notif_time.isoformat(),
                    'time_text': f"{hours_ago} jam yang lalu",
                    'color': template['color']
                })
            
            return jsonify({
                'success': True,
                'data': notifications
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching notifications: {e}")
            return jsonify({'success': False, 'error': 'Failed to fetch notifications'}), 500
    
    # Water Monitoring Routes
    @app.route('/api/devices/<int:device_id>/water-data', methods=['GET'])
    @jwt_required()
    def get_water_data(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        # Get query parameters for filtering
        hours = request.args.get('hours', default=24, type=int)
        limit = request.args.get('limit', default=100, type=int)
        
        time_threshold = datetime.utcnow() - timedelta(hours=hours)
        water_data = WaterMonitoring.query.filter(
            WaterMonitoring.device_id == device_id,
            WaterMonitoring.timestamp >= time_threshold
        ).order_by(WaterMonitoring.timestamp.desc()).limit(limit).all()
        
        return jsonify({
            'data': [w.to_dict() for w in water_data],
            'count': len(water_data)
        }), 200
    
    @app.route('/api/devices/<int:device_id>/cleaning-history', methods=['GET'])
    @jwt_required()
    def get_cleaning_history(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        limit = request.args.get('limit', default=50, type=int)
        history = CleaningHistory.query.filter_by(device_id=device_id)\
            .order_by(CleaningHistory.started_at.desc()).limit(limit).all()
        
        return jsonify({
            'history': [h.to_dict() for h in history],
            'count': len(history)
        }), 200
    
    @app.route('/api/devices/<int:device_id>/start-cleaning', methods=['POST'])
    @jwt_required()
    def start_cleaning(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json() or {}
        
        # Check if there's already an active cleaning session
        active_cleaning = CleaningHistory.query.filter_by(
            device_id=device_id,
            status='in_progress'
        ).first()
        
        if active_cleaning:
            return jsonify({'error': 'Cleaning already in progress'}), 400
        
        cleaning = CleaningHistory(
            device_id=device_id,
            started_at=datetime.utcnow(),
            status='in_progress',
            cleaning_type=data.get('cleaning_type', 'manual')
        )
        
        device.robot_status = 'cleaning'
        device.last_online = datetime.utcnow()
        
        db.session.add(cleaning)
        db.session.commit()
        
        return jsonify({
            'message': 'Cleaning started successfully',
            'cleaning': cleaning.to_dict()
        }), 201
    
    @app.route('/api/devices/<int:device_id>/stop-cleaning', methods=['POST'])
    @jwt_required()
    def stop_cleaning(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        active_cleaning = CleaningHistory.query.filter_by(
            device_id=device_id,
            status='in_progress'
        ).first()
        
        if not active_cleaning:
            return jsonify({'error': 'No active cleaning session'}), 400
        
        data = request.get_json() or {}
        
        active_cleaning.completed_at = datetime.utcnow()
        active_cleaning.duration = int((active_cleaning.completed_at - active_cleaning.started_at).total_seconds())
        active_cleaning.status = data.get('status', 'completed')
        active_cleaning.area_cleaned = data.get('area_cleaned')
        active_cleaning.notes = data.get('notes')
        
        device.robot_status = 'idle'
        device.last_online = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Cleaning stopped successfully',
            'cleaning': active_cleaning.to_dict()
        }), 200
    
    # Disease Detection Routes
    @app.route('/api/devices/<int:device_id>/disease-detections', methods=['GET'])
    @jwt_required()
    def get_disease_detections(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        limit = request.args.get('limit', default=50, type=int)
        detections = DiseaseDetection.query.filter_by(device_id=device_id)\
            .order_by(DiseaseDetection.detected_at.desc()).limit(limit).all()
        
        return jsonify({
            'detections': [d.to_dict() for d in detections],
            'count': len(detections)
        }), 200
    
    @app.route('/api/disease-detections/<int:detection_id>', methods=['PUT'])
    @jwt_required()
    def update_disease_detection(detection_id):
        user_id = get_jwt_identity()
        detection = DiseaseDetection.query.get(detection_id)
        
        if not detection:
            return jsonify({'error': 'Detection not found'}), 404
        
        device = Device.query.get(detection.device_id)
        user = User.query.get(user_id)
        
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        if 'status' in data:
            detection.status = data['status']
        if 'notes' in data:
            detection.notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Detection updated successfully',
            'detection': detection.to_dict()
        }), 200
    
    # Fishpedia Routes
    @app.route('/api/fishpedia', methods=['GET'])
    def get_fish_species():
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        
        query = FishSpecies.query
        
        if search:
            query = query.filter(
                db.or_(
                    FishSpecies.name.ilike(f'%{search}%'),
                    FishSpecies.scientific_name.ilike(f'%{search}%')
                )
            )
        
        if category:
            query = query.filter_by(category=category)
        
        species = query.all()
        
        return jsonify({
            'success': True,
            'species': [s.to_dict() for s in species],
            'count': len(species)
        }), 200
    
    @app.route('/api/fishpedia/<int:species_id>', methods=['GET'])
    def get_fish_species_detail(species_id):
        species = FishSpecies.query.get(species_id)
        
        if not species:
            return jsonify({'success': False, 'message': 'Species not found'}), 404
        
        return jsonify({'success': True, 'fish': species.to_dict()}), 200

    @app.route('/api/fishpedia/images/<path:filename>', methods=['GET'])
    def get_fishpedia_image(filename):
        safe_path = os.path.normpath(os.path.join(FISHPEDIA_UPLOAD_FOLDER, filename))
        if not safe_path.startswith(FISHPEDIA_UPLOAD_FOLDER):
            return jsonify({'error': 'Invalid file path'}), 400

        if not os.path.exists(safe_path):
            return jsonify({'error': 'Image not found'}), 404

        mime_type, _ = mimetypes.guess_type(safe_path)
        try:
            return send_file(safe_path, mimetype=mime_type or 'application/octet-stream')
        except Exception as e:
            print(f"❌ Error serving fishpedia image: {e}")
            return jsonify({'error': 'Failed to load image'}), 500
    
    # ============================================================================
    # ADMIN FISHPEDIA MANAGEMENT ROUTES (CRUD)
    # ============================================================================

    @app.route('/api/admin/fishpedia', methods=['GET'])
    @admin_required
    def admin_get_all_fishpedia():
        """Admin: Get all fish articles for management"""
        try:
            # Get query parameters
            search = request.args.get('search', '').strip()
            category = request.args.get('category', '').strip()
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            
            # Build query
            query = FishSpecies.query
            
            # Apply search filter
            if search:
                search_filter = or_(
                    FishSpecies.name.ilike(f'%{search}%'),
                    FishSpecies.category.ilike(f'%{search}%')
                )
                query = query.filter(search_filter)
            
            # Apply category filter
            if category:
                query = query.filter(FishSpecies.category == category)
            
            # Get total count
            total = query.count()
            
            # Apply pagination
            articles = query.order_by(FishSpecies.created_at.desc())\
                        .paginate(page=page, per_page=per_page, error_out=False)
            
            return jsonify({
                'success': True,
                'data': [article.to_dict() for article in articles.items],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'pages': articles.pages
                }
            }), 200
            
        except Exception as e:
            print(f"Error getting admin fishpedia: {str(e)}")
            return jsonify({'success': False, 'message': str(e)}), 500


    @app.route('/api/admin/fishpedia/<int:article_id>', methods=['GET'])
    @admin_required
    def admin_get_fishpedia_detail(article_id):
        """Admin: Get fish article detail for editing"""
        try:
            article = FishSpecies.query.get(article_id)
            
            if not article:
                return jsonify({
                    'success': False,
                    'message': 'Article not found'
                }), 404
            
            return jsonify({
                'success': True,
                'data': article.to_dict()
            }), 200
            
        except Exception as e:
            print(f"Error getting fishpedia detail: {str(e)}")
            return jsonify({'success': False, 'message': str(e)}), 500

    @app.route('/api/admin/fishpedia', methods=['POST'])
    @admin_required
    def admin_create_fishpedia():
        """Admin: Create new fishpedia entry"""
        try:
            data = get_request_data()
            payload = extract_fishpedia_payload(data)

            required_fields = ['name', 'scientific_name', 'category']
            missing = [field for field in required_fields if not payload.get(field)]
            if missing:
                return jsonify({
                    'success': False,
                    'message': f"Missing required fields: {', '.join(missing)}"
                }), 400

            file_storage = request.files.get('image') if 'image' in request.files else None
            if file_storage and not allowed_image_file(file_storage.filename):
                return jsonify({'success': False, 'message': 'Unsupported image format'}), 400

            filename = save_fishpedia_image(file_storage) if file_storage else None
            if filename:
                payload['image_url'] = build_fishpedia_image_url(filename)

            new_species = FishSpecies(**payload)
            db.session.add(new_species)
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Fishpedia entry created successfully',
                'data': new_species.to_dict()
            }), 201

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating fishpedia entry: {e}")
            return jsonify({'success': False, 'message': str(e)}), 500

    @app.route('/api/admin/fishpedia/<int:article_id>', methods=['PUT'])
    @admin_required
    def admin_update_fishpedia(article_id):
        """Admin: Update existing fishpedia entry"""
        try:
            article = FishSpecies.query.get(article_id)
            if not article:
                return jsonify({'success': False, 'message': 'Article not found'}), 404

            data = get_request_data()
            payload = extract_fishpedia_payload(data)

            file_storage = request.files.get('image') if 'image' in request.files else None
            if file_storage and not allowed_image_file(file_storage.filename):
                return jsonify({'success': False, 'message': 'Unsupported image format'}), 400

            if file_storage:
                filename = save_fishpedia_image(file_storage)
                if filename:
                    delete_fishpedia_image(article.image_url)
                    payload['image_url'] = build_fishpedia_image_url(filename)

            apply_fishpedia_fields(article, payload)
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Fishpedia entry updated successfully',
                'data': article.to_dict()
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error updating fishpedia entry: {e}")
            return jsonify({'success': False, 'message': str(e)}), 500

    @app.route('/api/admin/fishpedia/<int:article_id>', methods=['DELETE'])
    @admin_required
    def admin_delete_fishpedia(article_id):
        """Admin: Delete fishpedia entry"""
        try:
            article = FishSpecies.query.get(article_id)
            if not article:
                return jsonify({'success': False, 'message': 'Article not found'}), 404

            delete_fishpedia_image(article.image_url)
            db.session.delete(article)
            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Fishpedia entry deleted successfully'
            }), 200

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error deleting fishpedia entry: {e}")
            return jsonify({'success': False, 'message': str(e)}), 500


    @app.route('/api/forum/topics', methods=['GET'])
    def get_forum_topics():
        """Get all forum topics"""
        try:
            # Get filters
            category = request.args.get('category')
            search = request.args.get('search')
            
            # Build query
            query = ForumTopic.query
            
            if category:
                query = query.filter_by(category=category)
            
            if search:
                query = query.filter(
                    db.or_(
                        ForumTopic.title.ilike(f'%{search}%'),
                        ForumTopic.content.ilike(f'%{search}%')
                    )
                )
            
            # Order by: pinned first, then by created_at desc
            topics = query.order_by(
                ForumTopic.is_pinned.desc(),
                ForumTopic.created_at.desc()
            ).all()
            
            # Get current user if authenticated
            current_user_id = None
            try:
                from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
                verify_jwt_in_request(optional=True)
                current_user_id = get_jwt_identity()
            except:
                pass
            
            return jsonify({
                'success': True,
                'topics': [topic.to_dict(current_user_id=current_user_id) for topic in topics],
                'count': len(topics)
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching topics: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/forum/my-topics', methods=['GET'])
    @jwt_required()
    def get_my_forum_topics():
        """Get topics created by current user"""
        try:
            user_id = get_jwt_identity()
            
            # Get all topics by current user
            topics = ForumTopic.query.filter_by(author_id=user_id).order_by(
                ForumTopic.created_at.desc()
            ).all()
            
            return jsonify({
                'success': True,
                'topics': [topic.to_dict(current_user_id=user_id) for topic in topics],
                'count': len(topics)
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching user topics: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    @app.route('/api/forum/topics/<int:topic_id>', methods=['GET'])
    def get_forum_topic_updated(topic_id):
        """Get forum topic detail with replies"""
        topic = ForumTopic.query.get(topic_id)
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        
        # Increment views
        # topic.views += 1
        # db.session.commit()
        # ✅ OPSI 2: Try-Except dengan Rollback
        # try:
        #     topic.views += 1
        #     db.session.commit()
        # except Exception as e:
        #     db.session.rollback()
        #     print(f"⚠️ Could not update views: {e}")
    # Tetap return topic meski views tidak ter-update

        
        # Get current user if authenticated
        current_user_id = None
        try:
            from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
            verify_jwt_in_request(optional=True)
            current_user_id = get_jwt_identity()
        except:
            pass
        
        return jsonify({
            'success': True,
            'topic': topic.to_dict(include_replies=True, current_user_id=current_user_id)
        }), 200
    
    @app.route('/api/forum/topics/<int:topic_id>/replies', methods=['POST'])
    @jwt_required()
    def create_forum_reply(topic_id):
        user_id = get_jwt_identity()
        
        try:
            topic = ForumTopic.query.get(topic_id)
            
            if not topic:
                return jsonify({'error': 'Topic not found'}), 404
            
            if topic.is_locked:
                return jsonify({'error': 'Topic is locked'}), 403
            
            data = request.get_json()
            
            if not data.get('content'):
                return jsonify({'error': 'Content is required'}), 400
            
            reply = ForumReply(
                topic_id=topic_id,
                author_id=user_id,
                content=data['content']
            )
            
            # ✅ HANYA CREATE REPLY, TANPA UPDATE TOPIC
            db.session.add(reply)
            db.session.commit()
            
            return jsonify({
                'message': 'Reply created successfully',
                'reply': reply.to_dict()
            }), 201
        
        except Exception as e:
            db.session.rollback()
            print(f"⚠️ Error creating reply: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': 'Failed to create reply', 'message': str(e)}), 500
    
    @app.route('/api/forum/replies/<int:reply_id>', methods=['PUT'])
    @jwt_required()
    def update_forum_reply(reply_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        reply = ForumReply.query.get(reply_id)
        
        if not reply:
            return jsonify({'error': 'Reply not found'}), 404
        
        if reply.author_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        if 'content' in data:
            reply.content = data['content']
            reply.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Reply updated successfully',
            'reply': reply.to_dict()
        }), 200
    
# ==================== FORUM LIKES ROUTES ====================

    @app.route('/api/forum/topics/<int:topic_id>/like', methods=['POST'])
    @jwt_required()
    def toggle_topic_like(topic_id):
        """Toggle like on a forum topic"""
        try:
            current_user_id = get_jwt_identity()
            
            # Check if topic exists
            topic = ForumTopic.query.get(topic_id)
            if not topic:
                return jsonify({'error': 'Topic not found'}), 404
            
            # Check if user already liked this topic
            from models import ForumTopicLike
            existing_like = ForumTopicLike.query.filter_by(
                topic_id=topic_id,
                user_id=current_user_id
            ).first()
            
            if existing_like:
                # Unlike
                db.session.delete(existing_like)
                db.session.commit()
                
                # Get new like count
                like_count = ForumTopicLike.query.filter_by(topic_id=topic_id).count()
                
                return jsonify({
                    'success': True,
                    'message': 'Topic unliked',
                    'liked': False,
                    'like_count': like_count
                }), 200
            else:
                # Like
                new_like = ForumTopicLike(
                    topic_id=topic_id,
                    user_id=current_user_id
                )
                db.session.add(new_like)
                db.session.commit()
                
                # Get new like count
                like_count = ForumTopicLike.query.filter_by(topic_id=topic_id).count()
                
                return jsonify({
                    'success': True,
                    'message': 'Topic liked',
                    'liked': True,
                    'like_count': like_count
                }), 200
                
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error toggling topic like: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/forum/replies/<int:reply_id>/like', methods=['POST'])
    @jwt_required()
    def toggle_reply_like(reply_id):
        """Toggle like on a forum reply"""
        try:
            current_user_id = get_jwt_identity()
            
            # Check if reply exists
            reply = ForumReply.query.get(reply_id)
            if not reply:
                return jsonify({'error': 'Reply not found'}), 404
            
            # Check if user already liked this reply
            from models import ForumReplyLike
            existing_like = ForumReplyLike.query.filter_by(
                reply_id=reply_id,
                user_id=current_user_id
            ).first()
            
            if existing_like:
                # Unlike
                db.session.delete(existing_like)
                db.session.commit()
                
                # Get new like count
                like_count = ForumReplyLike.query.filter_by(reply_id=reply_id).count()
                
                return jsonify({
                    'success': True,
                    'message': 'Reply unliked',
                    'liked': False,
                    'like_count': like_count
                }), 200
            else:
                # Like
                new_like = ForumReplyLike(
                    reply_id=reply_id,
                    user_id=current_user_id
                )
                db.session.add(new_like)
                db.session.commit()
                
                # Get new like count
                like_count = ForumReplyLike.query.filter_by(reply_id=reply_id).count()
                
                return jsonify({
                    'success': True,
                    'message': 'Reply liked',
                    'liked': True,
                    'like_count': like_count
                }), 200
                
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error toggling reply like: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

# ==================== FORUM REPORTS ROUTES ====================

    @app.route('/api/forum/topics/<int:topic_id>/report', methods=['POST'])
    @jwt_required()
    def report_topic(topic_id):
        """Report a forum topic"""
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json()
            
            # Validation
            if not data.get('reason'):
                return jsonify({'error': 'Reason is required'}), 400
            
            # Check if topic exists
            topic = ForumTopic.query.get(topic_id)
            if not topic:
                return jsonify({'error': 'Topic not found'}), 404
            
            # Check if user already reported this topic
            from models import ForumReport
            existing_report = ForumReport.query.filter_by(
                topic_id=topic_id,
                reporter_id=current_user_id,
                status='pending'
            ).first()
            
            if existing_report:
                return jsonify({'error': 'You have already reported this topic'}), 400
            
            # Create report
            report = ForumReport(
                topic_id=topic_id,
                reporter_id=current_user_id,
                reason=data['reason'],
                description=data.get('description', ''),
                status='pending'
            )
            
            db.session.add(report)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Topic reported successfully. Admin will review it.',
                'report': report.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error reporting topic: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    # Admin: Get all reports
    @app.route('/api/admin/forum/reports', methods=['GET'])
    @jwt_required()
    def admin_get_forum_reports():
        """Get all forum reports (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Get status filter
            status = request.args.get('status', 'pending')
            
            # Build query
            from models import ForumReport
            query = ForumReport.query
            
            if status and status != 'all':
                query = query.filter_by(status=status)
            
            reports = query.order_by(ForumReport.created_at.desc()).all()
            
            return jsonify({
                'success': True,
                'reports': [report.to_dict() for report in reports],
                'count': len(reports)
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching reports: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    # Admin: Approve report (delete topic)
    @app.route('/api/admin/forum/reports/<int:report_id>/approve', methods=['POST'])
    @jwt_required()
    def admin_approve_report(report_id):
        """Approve report and delete topic (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            print(f"🔍 Admin {current_user.name} approving report {report_id}")
            
            if current_user.role != 'admin':
                print(f"❌ User {current_user.name} is not admin")
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Get report
            report = ForumReport.query.get(report_id)
            if not report:
                print(f"❌ Report {report_id} not found")
                return jsonify({'error': 'Report not found'}), 404
            
            # Get data
            data = request.get_json() or {}
            admin_notes = data.get('admin_notes', '')
            
            print(f"📝 Admin notes: {admin_notes}")
            
            # Get topic
            topic = ForumTopic.query.get(report.topic_id)
            
            # Update report status
            report.status = 'approved'
            report.reviewed_by = current_user_id
            report.reviewed_at = datetime.utcnow()
            report.admin_notes = admin_notes
            
            # Delete topic if exists
            if topic:
                print(f"🗑️  Deleting topic: {topic.title}")
                db.session.delete(topic)
            
            db.session.commit()
            
            print(f"✅ Report approved and topic deleted")
            
            return jsonify({
                'success': True,
                'message': 'Report approved and topic deleted successfully'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error approving report: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/admin/forum/reports/<int:report_id>/reject', methods=['POST'])
    @jwt_required()
    def admin_reject_report(report_id):
        """Reject report and keep topic (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            print(f"🔍 Admin {current_user.name} rejecting report {report_id}")
            
            if current_user.role != 'admin':
                print(f"❌ User {current_user.name} is not admin")
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Get report
            report = ForumReport.query.get(report_id)
            if not report:
                print(f"❌ Report {report_id} not found")
                return jsonify({'error': 'Report not found'}), 404
            
            # Get data
            data = request.get_json() or {}
            admin_notes = data.get('admin_notes', '')
            
            print(f"📝 Admin notes: {admin_notes}")
            
            # Update report status (topic stays)
            report.status = 'rejected'
            report.reviewed_by = current_user_id
            report.reviewed_at = datetime.utcnow()
            report.admin_notes = admin_notes
            
            db.session.commit()
            
            print(f"✅ Report rejected, topic preserved")
            
            return jsonify({
                'success': True,
                'message': 'Report rejected. Topic remains published.'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error rejecting report: {e}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500

    # User Routes
    @app.route('/api/users/profile', methods=['GET'])
    @jwt_required()
    def get_user_profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    def generate_order_number():
        today = datetime.utcnow().strftime('%Y%m%d')
        suffix = ''.join(random.choices(string.digits, k=5))
        return f"ORD-{today}-{suffix}"

    @app.route('/api/orders', methods=['POST'])
    @jwt_required()
    def create_order():
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)

            data = request.get_json() or {}

            product_name = data.get('product_name')
            total_price = data.get('total_price')
            quantity = int(data.get('quantity', 1) or 1)

            if not product_name or total_price is None:
                return jsonify({'error': 'product_name and total_price are required'}), 400

            if quantity <= 0:
                quantity = 1

            order = Order(
                order_number=generate_order_number(),
                user_id=current_user_id,
                product_name=product_name,
                quantity=quantity,
                total_price=float(total_price),
                shipping_address=data.get('shipping_address'),
                payment_method=data.get('payment_method'),
                notes=data.get('notes')
            )

            db.session.add(order)
            db.session.flush()

            queue_notification(
                current_user_id,
                'Pesanan Berhasil Dibuat',
                f"Pesanan #{order.order_number} berhasil dibuat dan sedang menunggu diproses.",
                'success'
            )

            notify_admins(
                'Pesanan Baru Masuk',
                f"Member {current_user.name} membuat pesanan #{order.order_number} dengan total Rp {order.total_price:,.0f}",
                'info'
            )

            db.session.commit()

            return jsonify({
                'success': True,
                'message': 'Order created successfully',
                'data': order.to_dict()
            }), 201

        except Exception as e:
            db.session.rollback()
            print(f"❌ Error creating order: {e}")
            return jsonify({'error': str(e)}), 500

    @app.route('/api/orders', methods=['GET'])
    @jwt_required()
    def get_orders():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role == 'admin':
            orders = Order.query.order_by(Order.created_at.desc()).all()
        else:
            orders = Order.query.filter_by(user_id=user_id)\
                .order_by(Order.created_at.desc()).all()
        
        return jsonify({
            'orders': [o.to_dict() for o in orders],
            'count': len(orders)
        }), 200
    
    @app.route('/api/orders/<int:order_id>', methods=['PUT'])
    @jwt_required()
    def update_order(order_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        order = Order.query.get(order_id)
        
        if not order:
            return jsonify({'error': 'Order not found'}), 404
        
        if order.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        # Users can only update certain fields
        if user.role != 'admin':
            if 'notes' in data:
                order.notes = data['notes']
        else:
            # Admin can update all fields
            if 'status' in data:
                order.status = data['status']
            if 'payment_status' in data:
                order.payment_status = data['payment_status']
            if 'notes' in data:
                order.notes = data['notes']
        
        order.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Order updated successfully',
            'order': order.to_dict()
        }), 200
    
    # Member: Get my orders with filters
    @app.route('/api/orders/my-orders', methods=['GET'])
    @jwt_required()
    def get_my_orders():
        """Get all orders for logged-in member with optional status filter"""
        try:
            current_user_id = get_jwt_identity()
            status_filter = request.args.get('status', None)
            
            query = Order.query.filter_by(user_id=current_user_id)
            
            if status_filter:
                query = query.filter_by(status=status_filter)
            
            orders = query.order_by(Order.created_at.desc()).all()
            
            return jsonify({
                'success': True,
                'data': [order.to_dict() for order in orders],
                'total': len(orders)
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500


    # Member: Get order detail
    @app.route('/api/orders/<int:order_id>/detail', methods=['GET'])
    @jwt_required()
    def get_order_detail(order_id):
        """Get order detail"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            order = Order.query.get(order_id)
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            # Member can only see their own orders
            if current_user.role != 'admin' and order.user_id != int(current_user_id):
                return jsonify({'error': 'Unauthorized'}), 403
            
            return jsonify({
                'success': True,
                'data': order.to_dict()
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
    
    # Upload Payment Proof (Member)
    # Upload Payment Proof (Member)
    @app.route('/api/orders/<int:order_id>/upload-payment-proof', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def upload_payment_proof(order_id):
        """Upload payment proof for an order"""
        # Handle preflight CORS request
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            # Get order and verify ownership
            order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
            
            if not order:
                print(f"❌ Order {order_id} not found for user {current_user_id}")
                return jsonify({'error': 'Order not found'}), 404
            
            print(f"✅ Found order: {order.order_number}")
            
            # Check if file is in request
            if 'payment_proof' not in request.files:
                print("❌ No file in request.files")
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['payment_proof']
            print(f"✅ File received: {file.filename}")
            
            # Check if file is selected
            if file.filename == '':
                print("❌ Empty filename")
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            if not allowed_file(file.filename):
                print(f"❌ Invalid file type: {file.filename}")
                return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed'}), 400
            
            print(f"✅ File type valid")

            # Validate file size (max 5MB)
            file.seek(0, os.SEEK_END)
            file_size = file.tell()
            file.seek(0)
            if file_size > MAX_PAYMENT_PROOF_SIZE:
                print(f"❌ File too large: {file_size} bytes")
                return jsonify({'error': 'File terlalu besar. Maksimum 5MB'}), 400
            
            # Generate unique filename
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_filename = f"{order.order_number}_{timestamp}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            print(f"✅ Saving to: {filepath}")
            
            # Save file
            file.save(filepath)
            print(f"✅ File saved successfully!")
            
            # Update order with payment proof path
            order.payment_proof = filepath
            order.payment_status = 'pending_verification'
            order.updated_at = datetime.utcnow()

            queue_notification(
                current_user_id,
                'Pembayaran Berhasil Diupload',
                f"Bukti pembayaran untuk pesanan #{order.order_number} berhasil diunggah dan menunggu verifikasi.",
                'success'
            )

            notify_admins(
                'Bukti Pembayaran Diterima',
                f"Member {current_user.name if current_user else current_user_id} mengunggah bukti pembayaran untuk pesanan #{order.order_number}.",
                'info'
            )
            
            db.session.commit()
            print(f"✅ Order {order_id} updated in database")
            
            return jsonify({
                'success': True,
                'message': 'Payment proof uploaded successfully',
                'data': {
                    'order_id': order.id,
                    'order_number': order.order_number,
                    'payment_proof': filepath,
                    'payment_status': order.payment_status
                }
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ ERROR uploading payment proof: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    
    # Get Payment Proof (Member & Admin)
    @app.route('/api/orders/<int:order_id>/payment-proof', methods=['GET'])
    @jwt_required()
    def get_payment_proof(order_id):
        """Get payment proof image for an order"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            # Admin can view any order, member can only view their own
            if current_user.role == 'admin':
                order = Order.query.get(order_id)
            else:
                order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
            
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            if not order.payment_proof:
                return jsonify({'error': 'No payment proof uploaded'}), 404
            
            # Check if file exists
            if not os.path.exists(order.payment_proof):
                return jsonify({'error': 'Payment proof file not found'}), 404
            
            # Read file and convert to base64
            with open(order.payment_proof, 'rb') as f:
                file_data = f.read()
            
            base64_data = base64.b64encode(file_data).decode('utf-8')
            
            # Determine file type
            file_ext = order.payment_proof.split('.')[-1].lower()
            mime_type = 'image/jpeg' if file_ext in ['jpg', 'jpeg'] else f'image/{file_ext}'
            if file_ext == 'pdf':
                mime_type = 'application/pdf'
            
            return jsonify({
                'success': True,
                'data': {
                    'filename': os.path.basename(order.payment_proof),
                    'mimetype': mime_type,
                    'base64': base64_data,
                    'url': f'/api/orders/{order_id}/payment-proof/file'
                }
            }), 200
            
        except Exception as e:
            print(f"❌ Error getting payment proof: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    
    @app.route('/api/orders/<int:order_id>/payment-proof/file', methods=['GET'])
    @jwt_required()
    def serve_payment_proof(order_id):
        """Serve payment proof file directly"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            # Admin can view any order, member can only view their own
            if current_user.role == 'admin':
                order = Order.query.get(order_id)
            else:
                order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
            
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            if not order.payment_proof:
                return jsonify({'error': 'No payment proof uploaded'}), 404
            
            if not os.path.exists(order.payment_proof):
                return jsonify({'error': 'Payment proof file not found'}), 404
            
            return send_file(order.payment_proof, mimetype='image/jpeg')
            
        except Exception as e:
            print(f"Error serving payment proof: {str(e)}")
            return jsonify({'error': str(e)}), 500


    # Member: Cancel order (only pending orders)
    @app.route('/api/orders/<int:order_id>/cancel', methods=['PUT'])
    @jwt_required()
    def cancel_order(order_id):
        """Cancel order (Member can cancel their own pending orders)"""
        try:
            current_user_id = get_jwt_identity()
            
            order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            # Only pending orders can be cancelled
            if order.status != 'pending':
                return jsonify({'error': 'Only pending orders can be cancelled'}), 400
            
            order.status = 'cancelled'
            order.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'Order cancelled successfully'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


    # ==================== ADMIN ORDERS ROUTES ====================

    # Admin: Get all orders with filters and pagination
    @app.route('/api/admin/orders', methods=['GET'])
    @jwt_required()
    def admin_get_all_orders():
        """Get all orders (Admin only) with filters and pagination"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Get query parameters
            status = request.args.get('status', None)
            payment_status = request.args.get('payment_status', None)
            search = request.args.get('search', None)
            page = int(request.args.get('page', 1))
            per_page = int(request.args.get('per_page', 10))
            
            # Build query
            query = Order.query
            
            if status:
                query = query.filter_by(status=status)
            
            if payment_status:
                query = query.filter_by(payment_status=payment_status)
            
            if search:
                query = query.join(User).filter(
                    db.or_(
                        Order.order_number.like(f'%{search}%'),
                        Order.product_name.like(f'%{search}%'),
                        User.name.like(f'%{search}%')
                    )
                )
            
            # Get total count
            total = query.count()
            
            # Paginate
            orders = query.order_by(Order.created_at.desc()).paginate(
                page=page, per_page=per_page, error_out=False
            )
            
            return jsonify({
                'success': True,
                'data': [order.to_dict() for order in orders.items],
                'pagination': {
                    'page': page,
                    'per_page': per_page,
                    'total': total,
                    'pages': orders.pages
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500


    # Admin: Update order status
    @app.route('/api/admin/orders/<int:order_id>/status', methods=['PUT'])
    @jwt_required()
    def admin_update_order_status(order_id):
        """Update order status (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403
            
            data = request.get_json()
            new_status = data.get('status')
            
            if not new_status:
                return jsonify({'error': 'Status is required'}), 400
            
            # Validate status
            valid_statuses = ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled']
            if new_status not in valid_statuses:
                return jsonify({'error': f'Invalid status. Valid: {valid_statuses}'}), 400
            
            order = Order.query.get(order_id)
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            order.status = new_status
            order.updated_at = datetime.utcnow()

            status_labels = {
                'pending': 'Menunggu Konfirmasi',
                'confirmed': 'Sedang Diproses',
                'shipping': 'Sedang Dikirim',
                'delivered': 'Telah Diterima',
                'cancelled': 'Dibatalkan'
            }
            status_label = status_labels.get(new_status, new_status.replace('_', ' ').title())
            notif_type = 'success' if new_status in ['confirmed', 'shipping', 'delivered'] else 'warning' if new_status == 'cancelled' else 'info'
            queue_notification(
                order.user_id,
                'Status Pesanan Diperbarui',
                f"Status pesanan #{order.order_number} Anda telah diperbarui menjadi \"{status_label}\".",
                notif_type
            )
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': f'Order status updated to {new_status}'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


    # Admin: Update payment status
    @app.route('/api/admin/orders/<int:order_id>/payment', methods=['PUT'])
    @jwt_required()
    def admin_update_payment_status(order_id):
        """Update payment status (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403
            
            data = request.get_json()
            payment_status = data.get('payment_status')
            
            if not payment_status:
                return jsonify({'error': 'Payment status is required'}), 400
            
            # Validate payment status
            valid_statuses = ['pending', 'paid', 'failed']
            if payment_status not in valid_statuses:
                return jsonify({'error': f'Invalid payment status. Valid: {valid_statuses}'}), 400
            
            order = Order.query.get(order_id)
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            order.payment_status = payment_status
            order.updated_at = datetime.utcnow()
            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': f'Payment status updated to {payment_status}'
            }), 200
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


    # Admin: Get order statistics
    @app.route('/api/admin/orders/stats', methods=['GET'])
    @jwt_required()
    def admin_get_order_stats():
        """Get order statistics (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Total orders
            total_orders = Order.query.count()
            
            # Orders by status
            status_stats = db.session.query(
                Order.status,
                db.func.count(Order.id)
            ).group_by(Order.status).all()
            
            status_breakdown = {status: count for status, count in status_stats}
            
            # Payment statistics
            payment_stats = db.session.query(
                Order.payment_status,
                db.func.count(Order.id),
                db.func.sum(Order.total_price)
            ).group_by(Order.payment_status).all()
            
            payment_breakdown = [
                {
                    'status': status,
                    'count': count,
                    'total_amount': float(total or 0)
                }
                for status, count, total in payment_stats
            ]
            
            # Total revenue (paid orders only)
            total_revenue = db.session.query(
                db.func.sum(Order.total_price)
            ).filter_by(payment_status='paid').scalar() or 0
            
            # Recent orders (last 7 days)
            seven_days_ago = datetime.utcnow() - timedelta(days=7)
            recent_orders = Order.query.filter(
                Order.created_at >= seven_days_ago
            ).count()
            
            return jsonify({
                'success': True,
                'data': {
                    'total_orders': total_orders,
                    'total_revenue': float(total_revenue),
                    'recent_orders': recent_orders,
                    'status_breakdown': status_breakdown,
                    'payment_breakdown': payment_breakdown
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Admin: Get order analytics (weekly trends and revenue)
    @app.route('/api/admin/orders/analytics', methods=['GET'])
    @jwt_required()
    def admin_get_order_analytics():
        """Get order analytics data for charts (Admin only)"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'error': 'Unauthorized'}), 403
            
            # Get orders from last 7 days
            today = datetime.utcnow().date()
            days = []
            day_names = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
            
            weekly_trend = []
            weekly_revenue = []
            
            for i in range(6, -1, -1):  # Last 7 days
                target_date = today - timedelta(days=i)
                start_datetime = datetime.combine(target_date, datetime.min.time())
                end_datetime = datetime.combine(target_date, datetime.max.time())
                
                # Count orders for this day
                order_count = Order.query.filter(
                    Order.created_at >= start_datetime,
                    Order.created_at <= end_datetime
                ).count()
                
                # Sum revenue for this day (paid orders only)
                daily_revenue = db.session.query(
                    db.func.sum(Order.total_price)
                ).filter(
                    Order.created_at >= start_datetime,
                    Order.created_at <= end_datetime,
                    Order.payment_status == 'paid'
                ).scalar() or 0
                
                # Get day name (0=Monday, 6=Sunday)
                day_index = target_date.weekday()
                # Adjust: Monday=1(Sen), Sunday=0(Min)
                adjusted_index = (day_index + 1) % 7
                day_name = day_names[adjusted_index]
                
                weekly_trend.append({
                    'day': day_name,
                    'orders': order_count
                })
                
                weekly_revenue.append({
                    'day': day_name,
                    'revenue': float(daily_revenue)
                })
            
            # Status distribution
            status_counts = {
                'pending_payment': 0,
                'processing': 0,
                'shipped': 0,
                'completed': 0,
                'cancelled': 0
            }
            
            # Count orders by payment status
            pending_payment = Order.query.filter_by(payment_status='pending').count()
            status_counts['pending_payment'] = pending_payment
            
            # Count by order status
            processing = Order.query.filter(
                (Order.status == 'confirmed') | (Order.status == 'processing')
            ).count()
            status_counts['processing'] = processing
            
            shipped = Order.query.filter_by(status='shipping').count()
            status_counts['shipped'] = shipped
            
            completed = Order.query.filter(
                (Order.status == 'delivered') | (Order.status == 'completed')
            ).count()
            status_counts['completed'] = completed
            
            cancelled = Order.query.filter_by(status='cancelled').count()
            status_counts['cancelled'] = cancelled
            
            return jsonify({
                'success': True,
                'data': {
                    'weekly_trend': weekly_trend,
                    'weekly_revenue': weekly_revenue,
                    'status_distribution': status_counts
                }
            }), 200
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    # Notification Routes
    # ==================== DISEASE DETECTION ROUTES ====================

    @app.route('/api/disease-detections', methods=['GET'])
    @jwt_required()
    def get_all_disease_detections():
        """Get all disease detections with optional filtering"""
        try:
            # Get query parameters
            limit = request.args.get('limit', default=50, type=int)
            device_id = request.args.get('device_id', type=int)
            
            # Build query
            query = DiseaseDetection.query
            
            # Filter by device_id if provided (though user asked to ignore it for now, 
            # keeping it as an option is good practice)
            if device_id:
                query = query.filter_by(device_id=device_id)
            
            # Order by detected_at desc
            detections = query.order_by(DiseaseDetection.detected_at.desc()).limit(limit).all()
            
            return jsonify({
                'success': True,
                'detections': [d.to_dict() for d in detections],
                'count': len(detections)
            }), 200
            
        except Exception as e:
            print(f"❌ Error fetching disease detections: {e}")
            return jsonify({'success': False, 'error': str(e)}), 500

    # ==================== NOTIFICATION ROUTES ====================

    @app.route('/api/notifications', methods=['GET'])
    @jwt_required()
    def get_notifications():
        user_id = get_jwt_identity()
        
        limit = request.args.get('limit', default=50, type=int)
        unread_only = request.args.get('unread_only', default='false').lower() == 'true'
        
        query = Notification.query.filter_by(user_id=user_id)
        
        if unread_only:
            query = query.filter_by(is_read=False)
        
        notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
        
        return jsonify({
            'success': True,
            'notifications': [n.to_dict() for n in notifications],
            'count': len(notifications),
            'unread_count': Notification.query.filter_by(user_id=user_id, is_read=False).count()
        }), 200
    
    @app.route('/api/notifications/<int:notification_id>', methods=['GET'])
    @jwt_required()
    def get_notification_detail(notification_id):
        user_id_str = get_jwt_identity()
        user_id = int(user_id_str)  # ✅ Convert string to integer
        
        notification = Notification.query.get(notification_id)
        
        if not notification:
            return jsonify({'success': False, 'error': 'Notification not found'}), 404
        
        if notification.user_id != user_id:  # ✅ Sekarang keduanya integer
            return jsonify({'success': False, 'error': 'Unauthorized access'}), 403
        
        # Mark as read when viewed
        if not notification.is_read:
            notification.is_read = True
            db.session.commit()
        
        return jsonify({
            'success': True,
            'data': notification.to_dict()
        }), 200
    
    @app.route('/api/notifications/<int:notification_id>/read', methods=['PUT'])
    @jwt_required()
    def mark_notification_read(notification_id):
        user_id = get_jwt_identity()
        notification = Notification.query.get(notification_id)
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        if notification.user_id != user_id:
            return jsonify({'error': 'Unauthorized access'}), 403
        
        notification.is_read = True
        db.session.commit()
        
        return jsonify({'message': 'Notification marked as read'}), 200
    
    @app.route('/api/notifications/read-all', methods=['PUT'])
    @jwt_required()
    def mark_all_notifications_read():
        user_id = get_jwt_identity()
        
        Notification.query.filter_by(user_id=user_id, is_read=False)\
            .update({'is_read': True})
        db.session.commit()
        
        return jsonify({'message': 'All notifications marked as read'}), 200
    
    # Admin Routes
    @app.route('/api/admin/users', methods=['GET'])
    @jwt_required()
    def get_all_users():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        users = User.query.all()
        
        return jsonify({
            'users': [u.to_dict() for u in users],
            'count': len(users)
        }), 200
    
    # Admin: Create new user
    @app.route('/api/admin/users/<int:user_id>', methods=['PUT'])
    @jwt_required()
    def update_user(user_id):
        """Admin: Update user data"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'success': False, 'message': 'Admin access required'}), 403
            
            user_to_update = User.query.get(user_id)
            if not user_to_update:
                return jsonify({'success': False, 'message': 'User not found'}), 404
            
            data = request.get_json()
            
            # Check email uniqueness if email is being changed
            if 'email' in data and data['email'] != user_to_update.email:
                existing_user = User.query.filter_by(email=data['email']).first()
                if existing_user:
                    return jsonify({
                        'success': False,
                        'message': 'Email already in use'
                    }), 400
            
            # Update fields
            if 'name' in data:
                user_to_update.name = data['name']
            if 'email' in data:
                user_to_update.email = data['email']
            if 'phone' in data:
                user_to_update.phone = data['phone']
            
            # Don't allow role changes for security
            if user_to_update.role == 'member':
                queue_notification(
                    user_to_update.id,
                    'Profil Diperbarui',
                    'Profil akun Anda telah diperbarui oleh Admin.',
                    'info'
                )

            db.session.commit()
            
            return jsonify({
                'success': True,
                'message': 'User updated successfully',
                'user': user_to_update.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error updating user: {e}")
            return jsonify({'success': False, 'message': str(e)}), 500
    
    # Admin: Delete user
    @app.route('/api/admin/users/<int:user_id>/toggle-status', methods=['PUT'])
    @jwt_required()
    def toggle_user_status(user_id):
        """Admin: Toggle user active status"""
        try:
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)
            
            if current_user.role != 'admin':
                return jsonify({'success': False, 'message': 'Admin access required'}), 403
            
            user_to_toggle = User.query.get(user_id)
            if not user_to_toggle:
                return jsonify({'success': False, 'message': 'User not found'}), 404
            
            # Prevent deactivating admin accounts
            if user_to_toggle.role == 'admin':
                return jsonify({
                    'success': False,
                    'message': 'Cannot deactivate admin accounts'
                }), 400
            
            # Toggle status
            user_to_toggle.is_active = not user_to_toggle.is_active

            status_phrase = 'diaktifkan' if user_to_toggle.is_active else 'dinonaktifkan'
            notif_type = 'success' if user_to_toggle.is_active else 'warning'
            if user_to_toggle.role == 'member':
                queue_notification(
                    user_to_toggle.id,
                    'Status Akun Diubah',
                    f"Akun Anda telah {status_phrase} oleh Admin.",
                    notif_type
                )
            db.session.commit()
            
            status_text = 'activated' if user_to_toggle.is_active else 'deactivated'
            
            return jsonify({
                'success': True,
                'message': f'User {status_text} successfully',
                'user': user_to_toggle.to_dict()
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error toggling user status: {e}")
            return jsonify({'success': False, 'message': str(e)}), 500
    
    @app.route('/api/admin/stats', methods=['GET'])
    @jwt_required()
    def get_admin_stats():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        stats = {
            'total_users': User.query.count(),
            'total_members': User.query.filter_by(role='member').count(),
            'total_devices': Device.query.count(),
            'active_devices': Device.query.filter_by(status='active').count(),
            'total_detections': DiseaseDetection.query.count(),
            'recent_detections': DiseaseDetection.query.filter(
                DiseaseDetection.detected_at >= datetime.utcnow() - timedelta(days=7)
            ).count(),
            'total_orders': Order.query.count(),
            'pending_orders': Order.query.filter_by(status='pending').count(),
            'total_forum_topics': ForumTopic.query.count(),
            'total_fish_species': FishSpecies.query.count()
        }
        
        return jsonify({'stats': stats}), 200
    
    @app.route('/api/admin/disease-trends', methods=['GET'])
    @jwt_required()
    def get_disease_trends():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        days = request.args.get('days', default=30, type=int)
        time_threshold = datetime.utcnow() - timedelta(days=days)
        
        detections = DiseaseDetection.query.filter(
            DiseaseDetection.detected_at >= time_threshold
        ).all()
        
        # Group by disease name
        trends = {}
        for detection in detections:
            if detection.disease_name not in trends:
                trends[detection.disease_name] = {
                    'disease_name': detection.disease_name,
                    'count': 0,
                    'severity_counts': {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
                }
            trends[detection.disease_name]['count'] += 1
            if detection.severity in trends[detection.disease_name]['severity_counts']:
                trends[detection.disease_name]['severity_counts'][detection.severity] += 1
        
        return jsonify({
            'trends': list(trends.values()),
            'total_detections': len(detections),
            'period_days': days
        }), 200
    
    # AI Chat Routes with Gemini (using direct HTTP API)
    @app.route('/api/ai/chat', methods=['POST'])
    @jwt_required()
    def ai_chat():
        """Chat with AI about fish diseases, care, etc."""
        try:
            import requests
            import json
            from config import config
            import base64
            
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            data = request.get_json()
            message = data.get('message', '').strip()
            image_base64 = data.get('image')  # Base64 encoded image (optional)
            
            if not message:
                return jsonify({'error': 'Message is required'}), 400
            
            # Get Gemini API key
            api_key = config['development'].GEMINI_API_KEY or os.getenv('GEMINI_API_KEY')
            if not api_key:
                # Use database fallback if API key not configured
                print("API key not configured - Using database fallback")
                ai_response = generate_fallback_response(message, fish_species)
                # Save to chat history
                chat = ChatHistory(
                    user_id=user_id,
                    message=message,
                    response=ai_response,
                    has_image=bool(image_base64),
                    image_url=data.get('image_url')
                )
                db.session.add(chat)
                db.session.commit()
                return jsonify({
                    'response': ai_response,
                    'chat_id': chat.id,
                    'created_at': chat.created_at.isoformat()
                }), 200
            
            # Get context from database (fish species info)
            fish_species = FishSpecies.query.limit(50).all()
            fish_context = "\n\nInformasi Ikan di Database:\n"
            for fish in fish_species:
                fish_context += f"- {fish.name} ({fish.scientific_name}): {fish.description or 'Tidak ada deskripsi'}\n"
                if fish.water_temp:
                    fish_context += f"  Suhu air: {fish.water_temp}, pH: {fish.ph_range or 'N/A'}\n"
            
            # Build system prompt
            system_prompt = f"""Anda adalah asisten AI ahli untuk perawatan ikan hias dan diagnosis penyakit ikan. 
Anda membantu pengguna dengan informasi lengkap tentang:
- Jenis-jenis ikan hias dan cara perawatannya
- Penyakit ikan dan cara mengobatinya
- Kualitas air akuarium
- Tips dan trik perawatan ikan

{fish_context}

PENTING - Format Jawaban (WAJIB DIIKUTI):
1. JANGAN gunakan tanda asterisk (*), markdown, atau simbol formatting apapun
2. JANGAN gunakan simbol bullet point (•, -, *, dll)
3. Gunakan paragraf yang jelas dan terstruktur dengan spasi antar paragraf
4. Jika perlu penekanan, gunakan kata-kata yang jelas tanpa formatting khusus
5. Susun jawaban dalam paragraf yang mudah dibaca, setiap paragraf fokus pada satu topik
6. Jika perlu list, gunakan nomor (1, 2, 3) atau langsung dalam bentuk paragraf
7. Gunakan bahasa Indonesia yang ramah, profesional, dan mudah dipahami
8. Pisahkan setiap topik dengan baris kosong untuk readability

Jika menanyakan tentang penyakit ikan, susun jawaban dalam paragraf yang jelas dengan informasi:
1. Nama penyakit dan penjelasan singkat (paragraf pertama)
2. Gejala yang terlihat (paragraf kedua)
3. Penyebab penyakit (paragraf ketiga)
4. Cara pengobatan yang detail (paragraf keempat)
5. Langkah pencegahan (paragraf kelima)

Setiap paragraf harus jelas, informatif, dan mudah dipahami. Jangan gunakan formatting markdown apapun."""

            # Prepare request to Gemini API
            full_prompt = f"{system_prompt}\n\nPertanyaan pengguna: {message}"
            
            # Use Gemini REST API directly
            # Use gemini-2.0-flash (latest model)
            model_name = "gemini-2.0-flash"  # Latest fast model that supports both text and images
            if image_base64:
                model_name = "gemini-2.0-flash"  # Flash supports vision
            
            # Use v1beta endpoint with API key in header (recommended method)
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent"
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": full_prompt
                    }]
                }]
            }
            
            # Add image if provided
            if image_base64:
                # Remove data URL prefix if present
                image_data = image_base64.split(',')[1] if ',' in image_base64 else image_base64
                payload["contents"][0]["parts"].append({
                    "inline_data": {
                        "mime_type": "image/jpeg",
                        "data": image_data
                    }
                })
            
            headers = {
                'Content-Type': 'application/json',
                'X-goog-api-key': api_key
            }
            
            try:
                response = requests.post(url, headers=headers, json=payload, timeout=30)
                response.raise_for_status()
                
                result = response.json()
                
                # Extract text from response
                if 'candidates' in result and len(result['candidates']) > 0:
                    if 'content' in result['candidates'][0]:
                        if 'parts' in result['candidates'][0]['content']:
                            ai_response = result['candidates'][0]['content']['parts'][0].get('text', '')
                        else:
                            ai_response = result['candidates'][0]['content'].get('text', '')
                    else:
                        ai_response = result['candidates'][0].get('text', '')
                else:
                    ai_response = str(result)
                    
                if not ai_response:
                    ai_response = "Maaf, saya tidak dapat menghasilkan respons. Silakan coba lagi."
                    
            except requests.exceptions.RequestException as req_error:
                print(f"Error calling Gemini API: {req_error}")
                error_msg = str(req_error)
                status_code = None
                error_detail = None
                
                if hasattr(req_error, 'response') and req_error.response is not None:
                    status_code = req_error.response.status_code
                    try:
                        error_detail = req_error.response.json()
                    except:
                        error_detail = req_error.response.text
                    print(f"Response status: {status_code}")
                    print(f"Response: {error_detail}")
                
                # Handle specific error codes
                if status_code == 403:
                    # API key issue - try fallback model first, then provide fallback response from database
                    try:
                        print("403 Forbidden - Trying fallback to gemini-2.0-flash with header auth...")
                        fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
                        fallback_headers = {
                            'Content-Type': 'application/json',
                            'X-goog-api-key': api_key
                        }
                        fallback_response = requests.post(fallback_url, headers=fallback_headers, json=payload, timeout=30)
                        fallback_response.raise_for_status()
                        result = fallback_response.json()
                        if 'candidates' in result and len(result['candidates']) > 0:
                            if 'content' in result['candidates'][0] and 'parts' in result['candidates'][0]['content']:
                                ai_response = result['candidates'][0]['content']['parts'][0].get('text', '')
                                if ai_response:
                                    # Success with fallback, continue normally
                                    pass
                                else:
                                    # Provide fallback response from database
                                    ai_response = generate_fallback_response(message, fish_species)
                            else:
                                # Provide fallback response from database
                                ai_response = generate_fallback_response(message, fish_species)
                        else:
                            # Provide fallback response from database
                            ai_response = generate_fallback_response(message, fish_species)
                    except Exception as fallback_error:
                        print(f"Fallback model also failed: {fallback_error}")
                        # Provide fallback response from database
                        ai_response = generate_fallback_response(message, fish_species)
                elif status_code == 404:
                    # Model not found - try fallback, then use database fallback
                    try:
                        print("404 Not Found - Trying fallback to gemini-2.0-flash...")
                        fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
                        fallback_headers = {
                            'Content-Type': 'application/json',
                            'X-goog-api-key': api_key
                        }
                        fallback_response = requests.post(fallback_url, headers=fallback_headers, json=payload, timeout=30)
                        fallback_response.raise_for_status()
                        result = fallback_response.json()
                        if 'candidates' in result and len(result['candidates']) > 0:
                            if 'content' in result['candidates'][0] and 'parts' in result['candidates'][0]['content']:
                                ai_response = result['candidates'][0]['content']['parts'][0].get('text', '')
                                if not ai_response:
                                    # Use database fallback
                                    ai_response = generate_fallback_response(message, fish_species)
                            else:
                                # Use database fallback
                                ai_response = generate_fallback_response(message, fish_species)
                        else:
                            # Use database fallback
                            ai_response = generate_fallback_response(message, fish_species)
                    except Exception as fallback_error:
                        print(f"Fallback model also failed: {fallback_error}")
                        # Use database fallback
                        ai_response = generate_fallback_response(message, fish_species)
                elif status_code == 429:
                    # Quota exceeded - use database fallback instead of error
                    print("429 Quota exceeded - Using database fallback response")
                    ai_response = generate_fallback_response(message, fish_species)
                else:
                    # Generic error - use database fallback instead of returning error
                    print(f"Error {status_code} - Using database fallback response")
                    ai_response = generate_fallback_response(message, fish_species)
            except Exception as api_error:
                print(f"Error processing API response: {api_error}")
                import traceback
                print(traceback.format_exc())
                # Use database fallback instead of returning error
                ai_response = generate_fallback_response(message, fish_species)
            
            # Save to chat history
            chat = ChatHistory(
                user_id=user_id,
                message=message,
                response=ai_response,
                has_image=bool(image_base64),
                image_url=data.get('image_url')
            )
            db.session.add(chat)
            db.session.commit()
            
            return jsonify({
                'response': ai_response,
                'chat_id': chat.id,
                'created_at': chat.created_at.isoformat()
            }), 200
            
        except Exception as e:
            return jsonify({'error': f'AI service error: {str(e)}'}), 500
    
    @app.route('/api/ai/chat/history', methods=['GET'])
    @jwt_required()
    def get_chat_history():
        """Get user's chat history"""
        user_id = get_jwt_identity()
        
        # Get limit from query params
        limit = request.args.get('limit', 50, type=int)
        
        chats = ChatHistory.query.filter_by(user_id=user_id)\
            .order_by(ChatHistory.created_at.desc())\
            .limit(limit).all()
        
        return jsonify({
            'chats': [chat.to_dict() for chat in chats],
            'count': len(chats)
        }), 200
    
    @app.route('/api/ai/chat/<int:chat_id>', methods=['DELETE'])
    @jwt_required()
    def delete_chat(chat_id):
        """Delete a chat from history"""
        user_id = get_jwt_identity()
        chat = ChatHistory.query.filter_by(id=chat_id, user_id=user_id).first()
        
        if not chat:
            return jsonify({'error': 'Chat not found'}), 404
        
        db.session.delete(chat)
        db.session.commit()
        
        return jsonify({'message': 'Chat deleted successfully'}), 200
        """Upload payment proof for an order"""
        # Handle preflight CORS request
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            current_user_id = get_jwt_identity()
            
            # Get order and verify ownership
            order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
            
            if not order:
                print(f"❌ Order {order_id} not found for user {current_user_id}")
                return jsonify({'error': 'Order not found'}), 404
            
            print(f"✅ Found order: {order.order_number}")
            
            # Check if file is in request
            if 'payment_proof' not in request.files:
                print("❌ No file in request.files")
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['payment_proof']
            print(f"✅ File received: {file.filename}")
            
            # Check if file is selected
            if file.filename == '':
                print("❌ Empty filename")
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            if not allowed_file(file.filename):
                print(f"❌ Invalid file type: {file.filename}")
                return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed'}), 400
            
            print(f"✅ File type valid")
            
            # Generate unique filename
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_filename = f"{order.order_number}_{timestamp}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            print(f"✅ Saving to: {filepath}")
            
            # Save file
            file.save(filepath)
            print(f"✅ File saved successfully!")
            
            # Update order with payment proof path
            order.payment_proof = filepath
            order.payment_status = 'pending_verification'
            order.updated_at = datetime.utcnow()
            
            db.session.commit()
            print(f"✅ Order {order_id} updated in database")
            
            return jsonify({
                'success': True,
                'message': 'Payment proof uploaded successfully',
                'data': {
                    'order_id': order.id,
                    'order_number': order.order_number,
                    'payment_proof': filepath,
                    'payment_status': order.payment_status
                }
            }), 200
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ ERROR uploading payment proof: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
    
    # Member: Cancel order (only pending orders)
    # ==================== ADMIN ORDERS ROUTES ====================

    # Admin: Get all orders with filters and pagination
    # ==================== ADMIN ORDERS ROUTES ====================

    # Admin: Get all orders with filters and pagination
    # ==================== ADMIN ORDERS ROUTES ====================

    # Admin: Get all orders with filters and pagination
