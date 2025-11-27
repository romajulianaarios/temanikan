from app import create_app
from models import db, User, Order, Notification

app = create_app()

with app.app_context():
    print("=== USERS ===")
    users = User.query.all()
    for u in users:
        print(f"ID: {u.id}, Name: {u.name}, Email: {u.email}, Role: {u.role}")

    print("\n=== ORDERS ===")
    orders = Order.query.all()
    for o in orders:
        print(f"ID: {o.id}, UserID: {o.user_id}, Status: {o.status}")

    print("\n=== NOTIFICATIONS ===")
    notifications = Notification.query.all()
    for n in notifications:
        print(f"ID: {n.id}, UserID: {n.user_id}, Title: {n.title}, Message: {n.message}")
