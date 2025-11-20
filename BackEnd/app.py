from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db, bcrypt
from routes import register_routes

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "expose_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)
    
    # Register routes
    register_routes(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
        # Seed default admin account
        from models import User
        admin = User.query.filter_by(email='admin@temanikan.com').first()
        if not admin:
            admin = User(
                name='Super Admin',
                email='admin@temanikan.com',
                role='admin'
            )
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("✓ Admin account created: admin@temanikan.com / admin123")
        
        # Seed demo member account
        member = User.query.filter_by(email='member@temanikan.com').first()
        if not member:
            member = User(
                name='Ahmad Wijaya',
                email='member@temanikan.com',
                role='member'
            )
            member.set_password('12345678')
            db.session.add(member)
            db.session.commit()
            print("✓ Member account created: member@temanikan.com / 12345678")
    
    @app.route('/')
    def index():
        return {
            'message': 'Temanikan API Server',
            'version': '1.0.0',
            'status': 'running'
        }
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
