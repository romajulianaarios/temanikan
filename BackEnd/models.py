from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime
import json

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='member')  # 'member' or 'admin'
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    age = db.Column(db.Integer)  # Usia
    primary_fish_type = db.Column(db.String(100))  # Jenis Ikan Hias Utama
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    devices = db.relationship('Device', backref='owner', lazy=True, cascade='all, delete-orphan')
    forum_topics = db.relationship('ForumTopic', backref='author', lazy=True)
    forum_replies = db.relationship('ForumReply', backref='author', lazy=True)
    orders = db.relationship('Order', back_populates='user', lazy=True)
    notifications = db.relationship('Notification', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'role': self.role,
            'phone': self.phone,
            'address': self.address,
            'age': self.age,
            'primary_fish_type': self.primary_fish_type,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Device(db.Model):
    __tablename__ = 'devices'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    device_code = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.String(20), default='active')  # active, inactive, maintenance
    robot_status = db.Column(db.String(20), default='idle')  # idle, cleaning, charging, error
    last_online = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    water_data = db.relationship('WaterMonitoring', backref='device', lazy=True, cascade='all, delete-orphan')
    cleaning_history = db.relationship('CleaningHistory', backref='device', lazy=True, cascade='all, delete-orphan')
    disease_detections = db.relationship('DiseaseDetection', backref='device', lazy=True, cascade='all, delete-orphan')
    notifications = db.relationship('Notification', backref='device', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'device_code': self.device_code,
            'user_id': self.user_id,
            'status': self.status,
            'robot_status': self.robot_status,
            'last_online': self.last_online.isoformat() if self.last_online else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class WaterMonitoring(db.Model):
    __tablename__ = 'water_monitoring'
    
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False)
    temperature = db.Column(db.Float)  # in Celsius
    ph_level = db.Column(db.Float)
    turbidity = db.Column(db.Float)  # NTU
    oxygen_level = db.Column(db.Float)  # mg/L
    ammonia_level = db.Column(db.Float)  # ppm
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'temperature': self.temperature,
            'ph_level': self.ph_level,
            'turbidity': self.turbidity,
            'oxygen_level': self.oxygen_level,
            'ammonia_level': self.ammonia_level,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None
        }

class CleaningHistory(db.Model):
    __tablename__ = 'cleaning_history'
    
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False)
    started_at = db.Column(db.DateTime, nullable=False)
    completed_at = db.Column(db.DateTime)
    duration = db.Column(db.Integer)  # in seconds
    status = db.Column(db.String(20), default='in_progress')  # in_progress, completed, cancelled, failed
    cleaning_type = db.Column(db.String(50))  # manual, scheduled, auto
    area_cleaned = db.Column(db.Float)  # percentage or area unit
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration': self.duration,
            'status': self.status,
            'cleaning_type': self.cleaning_type,
            'area_cleaned': self.area_cleaned,
            'notes': self.notes
        }

class DiseaseDetection(db.Model):
    __tablename__ = 'disease_detections'
    
    id = db.Column(db.Integer, primary_key=True)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'), nullable=False)
    disease_name = db.Column(db.String(100), nullable=False)
    confidence = db.Column(db.Float)  # 0-100
    severity = db.Column(db.String(20))  # low, medium, high, critical
    image_url = db.Column(db.String(255))
    symptoms = db.Column(db.Text)
    recommended_treatment = db.Column(db.Text)
    detected_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='detected')  # detected, treating, resolved
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'device_id': self.device_id,
            'disease_name': self.disease_name,
            'confidence': self.confidence,
            'severity': self.severity,
            'image_url': self.image_url,
            'symptoms': self.symptoms,
            'recommended_treatment': self.recommended_treatment,
            'detected_at': self.detected_at.isoformat() if self.detected_at else None,
            'status': self.status,
            'notes': self.notes
        }

class FishSpecies(db.Model):
    __tablename__ = 'fish_species'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    scientific_name = db.Column(db.String(100))
    category = db.Column(db.String(50))  # freshwater, saltwater, etc
    description = db.Column(db.Text)
    care_level = db.Column(db.String(20))  # easy, moderate, difficult
    temperament = db.Column(db.String(50))
    max_size = db.Column(db.String(50))
    min_tank_size = db.Column(db.String(50))
    water_temp = db.Column(db.String(50))
    ph_range = db.Column(db.String(50))
    diet = db.Column(db.Text)
    image_url = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'scientific_name': self.scientific_name,
            'category': self.category,
            'description': self.description,
            'care_level': self.care_level,
            'temperament': self.temperament,
            'max_size': self.max_size,
            'min_tank_size': self.min_tank_size,
            'water_temp': self.water_temp,
            'ph_range': self.ph_range,
            'diet': self.diet,
            'image_url': self.image_url,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class ForumTopic(db.Model):
    __tablename__ = 'forum_topics'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50))
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    views = db.Column(db.Integer, default=0)
    is_pinned = db.Column(db.Boolean, default=False)
    is_locked = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    replies = db.relationship('ForumReply', backref='topic', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_replies=False):
        data = {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'category': self.category,
            'author': self.author.to_dict() if self.author else None,
            'views': self.views,
            'is_pinned': self.is_pinned,
            'is_locked': self.is_locked,
            'reply_count': len(self.replies),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        if include_replies:
            data['replies'] = [reply.to_dict() for reply in self.replies]
        return data

class ForumReply(db.Model):
    __tablename__ = 'forum_replies'
    
    id = db.Column(db.Integer, primary_key=True)
    topic_id = db.Column(db.Integer, db.ForeignKey('forum_topics.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'topic_id': self.topic_id,
            'author': self.author.to_dict() if self.author else None,
            'content': self.content,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    product_name = db.Column(db.String(200), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    shipping_address = db.Column(db.Text)
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(20), default='pending')
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', back_populates='orders')
    
    def to_dict(self):
        """Convert order to dictionary"""
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'user': {
                'id': self.user.id,
                'name': self.user.name,
                'email': self.user.email,
                'phone': self.user.phone
            } if self.user else None,
            'product_name': self.product_name,
            'quantity': self.quantity,
            'total_price': self.total_price,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'notes': self.notes,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'payment_proof': self.payment_proof,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    device_id = db.Column(db.Integer, db.ForeignKey('devices.id'))
    type = db.Column(db.String(50), nullable=False)  # alert, info, warning, success
    title = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'device_id': self.device_id,
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
