
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Device, WaterMonitoring, CleaningHistory, DiseaseDetection
from models import FishSpecies, ForumTopic, ForumReply, Order, Notification
from datetime import datetime, timedelta
import random
import string
from werkzeug.utils import secure_filename
import os
import base64
from datetime import datetime
from flask import send_file


def register_routes(app):
    """Register all API routes"""
    
    UPLOAD_FOLDER = 'uploads/payment_proofs'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1).lower() in ALLOWED_EXTENSIONS

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
                return jsonify({'error': 'Invalid email or password'}), 401
            
            # Generate token
            access_token = create_access_token(identity=str(user.id))
            
            # ✨ TEST: Decode token immediately to verify
            from flask import current_app
            import jwt as pyjwt
            
            print("=" * 70)
            print("🔍 TOKEN GENERATION TEST:")
            print(f"   User ID: {user.id}")
            print(f"   Token (first 50 chars): {access_token[:50]}...")
            
            try:
                # Decode with same secret key
                decoded = pyjwt.decode(
                    access_token, 
                    current_app.config['JWT_SECRET_KEY'], 
                    algorithms=['HS256']
                )
                print(f"   ✅ Decode successful!")
                print(f"   Decoded user ID (sub): {decoded.get('sub')}")
                print(f"   Issued at (iat): {decoded.get('iat')}")
                print(f"   Expires at (exp): {decoded.get('exp')}")
                
                from datetime import datetime
                iat_time = datetime.fromtimestamp(decoded.get('iat'))
                exp_time = datetime.fromtimestamp(decoded.get('exp'))
                print(f"   IAT datetime: {iat_time}")
                print(f"   EXP datetime: {exp_time}")
                
            except Exception as decode_error:
                print(f"   ❌ Decode failed: {decode_error}")
            
            print("=" * 70)
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
            
        except Exception as e:
            print(f"❌ Login error: {str(e)}")
            import traceback
            print(traceback.format_exc())
            return jsonify({'error': 'Internal server error'}), 500

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
    
    @app.route('/api/devices/<int:device_id>', methods=['GET'])
    @jwt_required()
    def get_device(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        return jsonify({'device': device.to_dict()}), 200
    
    @app.route('/api/devices', methods=['POST'])
    @jwt_required()
    def add_device():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Device name is required'}), 400
        
        # Generate unique device code
        device_code = data.get('device_code')
        if not device_code:
            device_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
        
        # Check if device code already exists
        if Device.query.filter_by(device_code=device_code).first():
            return jsonify({'error': 'Device code already exists'}), 400
        
        device = Device(
            name=data['name'],
            device_code=device_code,
            user_id=user_id,
            status='active',
            robot_status='idle',
            last_online=datetime.utcnow()
        )
        
        db.session.add(device)
        db.session.commit()
        
        return jsonify({
            'message': 'Device added successfully',
            'device': device.to_dict()
        }), 201
    
    @app.route('/api/devices/<int:device_id>', methods=['PUT'])
    @jwt_required()
    def update_device(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        if 'name' in data:
            device.name = data['name']
        if 'status' in data:
            device.status = data['status']
        if 'robot_status' in data:
            device.robot_status = data['robot_status']
        
        device.last_online = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Device updated successfully',
            'device': device.to_dict()
        }), 200
    
    @app.route('/api/devices/<int:device_id>', methods=['DELETE'])
    @jwt_required()
    def delete_device(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        db.session.delete(device)
        db.session.commit()
        
        return jsonify({'message': 'Device deleted successfully'}), 200
    
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
    
    @app.route('/api/devices/<int:device_id>/water-data', methods=['POST'])
    @jwt_required()
    def add_water_data(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        water_data = WaterMonitoring(
            device_id=device_id,
            temperature=data.get('temperature'),
            ph_level=data.get('ph_level'),
            turbidity=data.get('turbidity'),
            oxygen_level=data.get('oxygen_level'),
            ammonia_level=data.get('ammonia_level'),
            timestamp=datetime.utcnow()
        )
        
        db.session.add(water_data)
        device.last_online = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Water data recorded successfully',
            'data': water_data.to_dict()
        }), 201
    
    # Robot Control & Cleaning History Routes
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
    
    @app.route('/api/devices/<int:device_id>/disease-detections', methods=['POST'])
    @jwt_required()
    def add_disease_detection(device_id):
        user_id = get_jwt_identity()
        device = Device.query.get(device_id)
        
        if not device:
            return jsonify({'error': 'Device not found'}), 404
        
        user = User.query.get(user_id)
        if device.user_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        if not data.get('disease_name'):
            return jsonify({'error': 'Disease name is required'}), 400
        
        detection = DiseaseDetection(
            device_id=device_id,
            disease_name=data['disease_name'],
            confidence=data.get('confidence'),
            severity=data.get('severity', 'medium'),
            image_url=data.get('image_url'),
            symptoms=data.get('symptoms'),
            recommended_treatment=data.get('recommended_treatment'),
            status='detected',
            notes=data.get('notes')
        )
        
        db.session.add(detection)
        device.last_online = datetime.utcnow()
        
        # Create notification for user
        notification = Notification(
            user_id=device.user_id,
            device_id=device_id,
            type='alert',
            title=f'Penyakit Terdeteksi: {data["disease_name"]}',
            message=f'Sistem mendeteksi penyakit pada perangkat {device.name}. Segera periksa dan ambil tindakan.'
        )
        db.session.add(notification)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Disease detection recorded successfully',
            'detection': detection.to_dict()
        }), 201
    
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
            'species': [s.to_dict() for s in species],
            'count': len(species)
        }), 200
    
    @app.route('/api/fishpedia/<int:species_id>', methods=['GET'])
    def get_fish_species_detail(species_id):
        species = FishSpecies.query.get(species_id)
        
        if not species:
            return jsonify({'error': 'Species not found'}), 404
        
        return jsonify({'species': species.to_dict()}), 200
    
    @app.route('/api/fishpedia', methods=['POST'])
    @jwt_required()
    def add_fish_species():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Species name is required'}), 400
        
        species = FishSpecies(
            name=data['name'],
            scientific_name=data.get('scientific_name'),
            category=data.get('category'),
            description=data.get('description'),
            care_level=data.get('care_level'),
            temperament=data.get('temperament'),
            max_size=data.get('max_size'),
            min_tank_size=data.get('min_tank_size'),
            water_temp=data.get('water_temp'),
            ph_range=data.get('ph_range'),
            diet=data.get('diet'),
            image_url=data.get('image_url')
        )
        
        db.session.add(species)
        db.session.commit()
        
        return jsonify({
            'message': 'Fish species added successfully',
            'species': species.to_dict()
        }), 201
    
    @app.route('/api/fishpedia/<int:species_id>', methods=['PUT'])
    @jwt_required()
    def update_fish_species(species_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        species = FishSpecies.query.get(species_id)
        
        if not species:
            return jsonify({'error': 'Species not found'}), 404
        
        data = request.get_json()
        
        for key in ['name', 'scientific_name', 'category', 'description', 'care_level',
                    'temperament', 'max_size', 'min_tank_size', 'water_temp', 
                    'ph_range', 'diet', 'image_url']:
            if key in data:
                setattr(species, key, data[key])
        
        species.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Fish species updated successfully',
            'species': species.to_dict()
        }), 200
    
    @app.route('/api/fishpedia/<int:species_id>', methods=['DELETE'])
    @jwt_required()
    def delete_fish_species(species_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if user.role != 'admin':
            return jsonify({'error': 'Admin access required'}), 403
        
        species = FishSpecies.query.get(species_id)
        
        if not species:
            return jsonify({'error': 'Species not found'}), 404
        
        db.session.delete(species)
        db.session.commit()
        
        return jsonify({'message': 'Fish species deleted successfully'}), 200
    
    # Forum Routes
    @app.route('/api/forum/topics', methods=['GET'])
    def get_forum_topics():
        category = request.args.get('category', '')
        search = request.args.get('search', '')
        
        query = ForumTopic.query
        
        if category:
            query = query.filter_by(category=category)
        
        if search:
            query = query.filter(ForumTopic.title.ilike(f'%{search}%'))
        
        topics = query.order_by(
            ForumTopic.is_pinned.desc(),
            ForumTopic.updated_at.desc()
        ).all()
        
        return jsonify({
            'topics': [t.to_dict() for t in topics],
            'count': len(topics)
        }), 200
    
    @app.route('/api/forum/topics/<int:topic_id>', methods=['GET'])
    def get_forum_topic(topic_id):
        topic = ForumTopic.query.get(topic_id)
        
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        
        # Increment views
        topic.views += 1
        db.session.commit()
        
        return jsonify({'topic': topic.to_dict(include_replies=True)}), 200
    
    @app.route('/api/forum/topics', methods=['POST'])
    @jwt_required()
    def create_forum_topic():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('title') or not data.get('content'):
            return jsonify({'error': 'Title and content are required'}), 400
        
        topic = ForumTopic(
            title=data['title'],
            content=data['content'],
            category=data.get('category', 'general'),
            author_id=user_id
        )
        
        db.session.add(topic)
        db.session.commit()
        
        return jsonify({
            'message': 'Topic created successfully',
            'topic': topic.to_dict()
        }), 201
    
    @app.route('/api/forum/topics/<int:topic_id>', methods=['PUT'])
    @jwt_required()
    def update_forum_topic(topic_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        topic = ForumTopic.query.get(topic_id)
        
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        
        if topic.author_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        data = request.get_json()
        
        if 'title' in data:
            topic.title = data['title']
        if 'content' in data:
            topic.content = data['content']
        if 'category' in data:
            topic.category = data['category']
        
        # Admin-only fields
        if user.role == 'admin':
            if 'is_pinned' in data:
                topic.is_pinned = data['is_pinned']
            if 'is_locked' in data:
                topic.is_locked = data['is_locked']
        
        topic.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Topic updated successfully',
            'topic': topic.to_dict()
        }), 200
    
    @app.route('/api/forum/topics/<int:topic_id>', methods=['DELETE'])
    @jwt_required()
    def delete_forum_topic(topic_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        topic = ForumTopic.query.get(topic_id)
        
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        
        if topic.author_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        db.session.delete(topic)
        db.session.commit()
        
        return jsonify({'message': 'Topic deleted successfully'}), 200
    
    @app.route('/api/forum/topics/<int:topic_id>/replies', methods=['POST'])
    @jwt_required()
    def create_forum_reply(topic_id):
        user_id = get_jwt_identity()
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
        
        topic.updated_at = datetime.utcnow()
        
        db.session.add(reply)
        db.session.commit()
        
        return jsonify({
            'message': 'Reply created successfully',
            'reply': reply.to_dict()
        }), 201
    
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
    
    @app.route('/api/forum/replies/<int:reply_id>', methods=['DELETE'])
    @jwt_required()
    def delete_forum_reply(reply_id):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        reply = ForumReply.query.get(reply_id)
        
        if not reply:
            return jsonify({'error': 'Reply not found'}), 404
        
        if reply.author_id != user_id and user.role != 'admin':
            return jsonify({'error': 'Unauthorized access'}), 403
        
        db.session.delete(reply)
        db.session.commit()
        
        return jsonify({'message': 'Reply deleted successfully'}), 200
    
    # User Routes
    @app.route('/api/users/profile', methods=['GET'])
    @jwt_required()
    def get_user_profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({'user': user.to_dict()}), 200
    
    @app.route('/api/users/profile', methods=['PUT'])
    @jwt_required()
    def update_profile():
        try:
            print("=" * 70)
            print("📨 UPDATE PROFILE REQUEST")
            
            # Get user ID from token (akan return string sekarang)
            current_user_id = get_jwt_identity()
            print(f"   User ID from token: '{current_user_id}' (type: {type(current_user_id)})")
            
            # ✅ Convert string ke integer untuk query database
            user_id_int = int(current_user_id)
            
            # Get user from database
            user = User.query.get(user_id_int)
            if not user:
                print(f"❌ User not found in DB: ID {user_id_int}")
                return jsonify({
                    'error': 'User tidak ditemukan',
                    'message': 'Silahkan login kembali'
                }), 404
            
            print(f"✅ User found: {user.email}")
            
            # Get request data
            data = request.get_json()
            print(f"📝 Update data: {data}")
            
            # Update user fields
            updated_fields = []
            if 'name' in data:
                user.name = data['name']
                updated_fields.append('name')
            if 'phone' in data:
                user.phone = data['phone']
                updated_fields.append('phone')
            if 'address' in data:
                user.address = data['address']
                updated_fields.append('address')
            if 'age' in data:
                user.age = data['age']
                updated_fields.append('age')
            if 'primary_fish_type' in data:
                user.primary_fish_type = data['primary_fish_type']
                updated_fields.append('primary_fish_type')
            if 'password' in data and data['password']:
                user.set_password(data['password'])
                updated_fields.append('password')
            
            print(f"📝 Updating fields: {updated_fields}")
            
            # Commit changes
            db.session.commit()
            print("✅ Profile updated successfully!")
            print("=" * 70)
            
            return jsonify({
                'message': 'Profil berhasil diperbarui',
                'user': user.to_dict()
            }), 200
            
        except ValueError as ve:
            print(f"❌ Invalid user ID format: {ve}")
            return jsonify({
                'error': 'Token tidak valid',
                'message': 'Silahkan login kembali'
            }), 422
        except Exception as e:
            print(f"❌ EXCEPTION in update_profile: {str(e)}")
            import traceback
            print(traceback.format_exc())
            print("=" * 70)
            
            db.session.rollback()
            return jsonify({
                'error': 'Internal server error',
                'message': str(e)
            }), 500


    # Order Routes
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
    
    @app.route('/api/orders', methods=['POST'])
    @jwt_required()
    def create_order():
        """Create new order (Member only)"""
        try:
            current_user_id = get_jwt_identity()
            data = request.get_json()
            
            print(f"🔵 Creating order for user_id: {current_user_id}")
            print(f"🔵 Order data: {data}")
            
            # Validation
            required_fields = ['product_name', 'total_price']
            for field in required_fields:
                if field not in data:
                    return jsonify({'error': f'{field} is required'}), 400
            
            # Generate order number
            now = datetime.now()
            date_part = now.strftime('%Y%m%d')
            
            last_order = Order.query.filter(
                Order.order_number.like(f'ORD-{date_part}-%')
            ).order_by(Order.created_at.desc()).first()
            
            if last_order:
                last_num = int(last_order.order_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1
            
            order_number = f'ORD-{date_part}-{new_num:05d}'
            print(f"🔵 Generated order_number: {order_number}")
            
            # Create order
            order = Order(
                order_number=order_number,
                user_id=current_user_id,
                product_name=data['product_name'],
                quantity=data.get('quantity', 1),
                total_price=data['total_price'],
                status='pending',
                shipping_address=data.get('shipping_address', ''),
                payment_method=data.get('payment_method', ''),
                payment_status='pending',
                notes=data.get('notes', '')
            )
            
            print(f"🔵 Order object created")
            
            db.session.add(order)
            print(f"🔵 Order added to session")
            
            db.session.commit()
            print(f"✅ Order committed to database! ID: {order.id}")
            
            # Verify in database
            verify = Order.query.get(order.id)
            print(f"🔵 Verification - Order found in DB: {verify is not None}")
            
            return jsonify({
                'success': True,
                'message': 'Order created successfully',
                'data': order.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            print(f"❌ ERROR creating order: {str(e)}")
            import traceback
            traceback.print_exc()
            return jsonify({'error': str(e)}), 500
    
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
    
    @app.route('/api/orders/<int:order_id>/payment-proof', methods=['POST'])
    @jwt_required()
    def upload_payment_proof(order_id):
        """Upload payment proof for an order"""
        try:
            current_user_id = get_jwt_identity()
            
            # Get the order
            order = Order.query.filter_by(id=order_id, user_id=current_user_id).first()
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            
            # Check if file is in request
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            file = request.files['file']
            
            # Check if file is selected
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Validate file type
            if not allowed_file(file.filename):
                return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and PDF are allowed'}), 400
            
            # Generate unique filename
            filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            unique_filename = f"{order.order_number}_{timestamp}_{filename}"
            filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
            
            # Save file
            file.save(filepath)
            
            # Update order with payment proof path
            order.payment_proof = filepath
            order.payment_status = 'pending_verification'
            db.session.commit()
            
            return jsonify({
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
            print(f"Error uploading payment proof: {str(e)}")
            return jsonify({'error': str(e)}), 500
    
    
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
                'data': {
                    'filename': os.path.basename(order.payment_proof),
                    'mime_type': mime_type,
                    'base64': base64_data,
                    'url': f'/api/orders/{order_id}/payment-proof/file'
                }
            }), 200
            
        except Exception as e:
            print(f"Error getting payment proof: {str(e)}")
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

    # Notification Routes
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
            'notifications': [n.to_dict() for n in notifications],
            'count': len(notifications),
            'unread_count': Notification.query.filter_by(user_id=user_id, is_read=False).count()
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
