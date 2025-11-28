from app import create_app
from flask_jwt_extended import create_access_token

app = create_app()
with app.app_context():
    print(f"Generating token with secret: {app.config.get('JWT_SECRET_KEY')}")
    token = create_access_token(identity="4") # User ID "4" (string)
    with open('token.txt', 'w') as f:
        f.write(token)
    print("Token written to token.txt")
