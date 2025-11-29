from app import create_app
from models import Notification, User

app = create_app()

with app.app_context():
    member = User.query.filter_by(email='caesar1@hey.pink').first()
    if member:
        print(f"Checking notifications for User ID: {member.id} ({member.email})")
        notifications = Notification.query.filter_by(user_id=member.id).all()
        if not notifications:
            print("No notifications found.")
        for n in notifications:
            print(f"ID: {n.id}, Type: {n.type}, Title: {n.title}, Message: {n.message}, Created: {n.created_at}")
    else:
        print("Member not found.")
