from app import create_app
from models import User

app = create_app()

with app.app_context():
    admin = User.query.filter_by(role='admin').first()
    if admin:
        print(f"ADMIN_EMAIL: {admin.email}")
    else:
        print("ADMIN_NOT_FOUND")
