from app import create_app
from models import db, User

app = create_app()

with app.app_context():
    # Reset Admin Password
    admin = User.query.filter_by(email='admin@temanikan.com').first()
    if admin:
        admin.set_password('123456')
        print(f"Reset password for {admin.email} to 123456")
    
    # Reset Member Password
    member = User.query.filter_by(email='rjulianaarios@gmail.com').first()
    if member:
        member.set_password('123456')
        print(f"Reset password for {member.email} to 123456")
        
    db.session.commit()
