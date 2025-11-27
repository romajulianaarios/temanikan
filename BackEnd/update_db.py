from app import create_app
from models import db, User, Order, Notification

app = create_app()

with app.app_context():
    # Update Notification
    notification = Notification.query.get(1)
    if notification:
        notification.user_id = 3
        print(f"Updated Notification 1 user_id to 3")
    
    # Update Order
    order = Order.query.get(1)
    if order:
        order.user_id = 3
        print(f"Updated Order 1 user_id to 3")
        
    db.session.commit()
    print("Database updated successfully.")
