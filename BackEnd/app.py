from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db, bcrypt
from routes import register_routes

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Debug JWT Configuration
    print("=" * 70)
    print("🔍 JWT CONFIGURATION:")
    print(f"   JWT_SECRET_KEY: {app.config.get('JWT_SECRET_KEY', 'NOT SET')}")
    print(f"   JWT_ACCESS_TOKEN_EXPIRES: {app.config.get('JWT_ACCESS_TOKEN_EXPIRES', 'NOT SET')}")
    print("=" * 70)
    
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
    
    # ✨ ENHANCED JWT error handlers with detailed logging
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        print("=" * 70)
        print("❌ JWT ERROR: Token Expired")
        print(f"   Header: {jwt_header}")
        print(f"   Payload: {jwt_payload}")
        print(f"   User ID: {jwt_payload.get('sub', 'unknown')}")
        print(f"   Expired at: {jwt_payload.get('exp', 'unknown')}")
        print("=" * 70)
        return jsonify({
            'error': 'Token telah kadaluarsa',
            'message': 'Silahkan login kembali'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        print("=" * 70)
        print("❌ JWT ERROR: Invalid Token")
        print(f"   Error: {error}")
        print(f"   Request path: {request.path}")
        print(f"   Request method: {request.method}")
        auth_header = request.headers.get('Authorization', 'NOT PROVIDED')
        print(f"   Auth header (first 50 chars): {auth_header[:50]}")
        print("=" * 70)
        return jsonify({
            'error': 'Token tidak valid',
            'message': 'Silahkan login kembali'
        }), 422
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        print("=" * 70)
        print("❌ JWT ERROR: Missing Token")
        print(f"   Error: {error}")
        print(f"   Request path: {request.path}")
        print(f"   Request method: {request.method}")
        print("=" * 70)
        return jsonify({
            'error': 'Token tidak ditemukan',
            'message': 'Silahkan login kembali'
        }), 401
    
    # ✨ ADD: Catch-all for other JWT errors
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        print("=" * 70)
        print("❌ JWT ERROR: Token Revoked")
        print(f"   Header: {jwt_header}")
        print(f"   Payload: {jwt_payload}")
        print("=" * 70)
        return jsonify({
            'error': 'Token telah dicabut',
            'message': 'Silahkan login kembali'
        }), 401
    
    # Register routes
    register_routes(app)
    
    return app

if __name__ == '__main__':
    try:
        app = create_app('development')
        
        # Create tables if they don't exist
        with app.app_context():
            db.create_all()
            print("✅ Database tables created/verified")
        
        print("\n🚀 Starting Flask server...")
        print("📍 Server running on: http://localhost:5000")
        print("=" * 70)
        
        # Use debug=False to avoid auto-reload issues
        app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
    except Exception as e:
        print(f"\n❌ ERROR starting server: {e}")
        import traceback
        traceback.print_exc()
        input("Press Enter to exit...")
