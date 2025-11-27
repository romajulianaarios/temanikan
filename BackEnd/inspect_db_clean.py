import logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

from app import create_app
from models import db, User, Order, Notification

app = create_app()

with app.app_context():
    print("\n=== USERS ===")
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Email: {u.email}, Role: {u.role}")

    print("\n=== NOTIFICATIONS ===")
    notifications = Notification.query.all()
    for n in notifications:
        print(f"ID: {n.id}, UserID: {n.user_id}, Title: {n.title}")
