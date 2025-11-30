from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db, bcrypt
from routes import register_routes

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    print("=" * 70)
    print("JWT CONFIGURATION:")
    print(f"   JWT_SECRET_KEY: {app.config.get('JWT_SECRET_KEY', 'NOT SET')}")
    print(f"   JWT_ACCESS_TOKEN_EXPIRES: {app.config.get('JWT_ACCESS_TOKEN_EXPIRES', 'NOT SET')}")
    print("=" * 70)
    
    CORS(app, 
        resources={r"/api/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    db.init_app(app)
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({'success': False, 'message': 'Token has expired'}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({'success': False, 'message': 'Invalid token'}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({'success': False, 'message': 'Authorization token missing'}), 401
    
    # Try to load ML routes (optional - backend can run without ML features)
    try:
        from routes_ml import ml_bp
        app.register_blueprint(ml_bp, url_prefix='/api')
        print("ML routes loaded successfully")
    except ImportError as e:
        print(f"WARNING: ML routes not available: {e}")
        print("Backend will run without ML features (login and other features will still work)")
    
    register_routes(app)
    
    with app.app_context():
        db.create_all()
        print("Database tables created/verified")
    
    return app

if __name__ == '__main__':
    try:
        app = create_app('development')
        print("\nStarting Flask server...")
        print("Server running on: http://localhost:5000")
        print("CORS: ENABLED (Allow All Origins)")
        print("=" * 70)
        app.run(debug=True, host='0.0.0.0', port=5000)
    except Exception as e:
        print(f"ERROR starting server: {e}")
        import traceback
        traceback.print_exc()
        input("Press Enter to exit...")

# ... kodingan def create_app() di atas ...

# Tambahkan baris ini di paling bawah agar Gunicorn bisa menemukannya:
app = create_app()