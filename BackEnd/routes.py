from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Device, WaterMonitoring, CleaningHistory, DiseaseDetection
from models import FishSpecies, ForumTopic, ForumReply, Order, Notification
from datetime import datetime, timedelta
import random
import string

def register_routes(app):
    """Register all API routes"""
    
    # Authentication Routes
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        
        user = User(
            name=data.get('name', data['email'].split('@')[0]),
            email=data['email'],
            role='member',
            phone=data.get('phone'),
            address=data.get('address')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
    
    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid email or password'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
    
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
    def update_user_profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            user.name = data['name']
        if 'phone' in data:
            user.phone = data['phone']
        if 'address' in data:
            user.address = data['address']
        if 'password' in data and data['password']:
            user.set_password(data['password'])
        
        user.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'user': user.to_dict()
        }), 200
    
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
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data.get('product_name') or not data.get('total_price'):
            return jsonify({'error': 'Product name and total price are required'}), 400
        
        # Generate order number
        order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{''.join(random.choices(string.digits, k=6))}"
        
        order = Order(
            order_number=order_number,
            user_id=user_id,
            product_name=data['product_name'],
            quantity=data.get('quantity', 1),
            total_price=data['total_price'],
            shipping_address=data.get('shipping_address'),
            payment_method=data.get('payment_method'),
            notes=data.get('notes')
        )
        
        db.session.add(order)
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order': order.to_dict()
        }), 201
    
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
