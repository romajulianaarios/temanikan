from app import create_app
from models import db, User, Order
from datetime import datetime

app = create_app()

with app.app_context():
    # Setup Admin
    admin = User.query.filter_by(email='admin@temanikan.com').first()
    if not admin:
        print("Creating admin user...")
        admin = User(name='Admin', email='admin@temanikan.com', role='admin', phone='081234567890')
        db.session.add(admin)
    admin.set_password('admin123')
    print("Admin password set to admin123")

    # Setup Member
    member = User.query.filter_by(email='caesar1@hey.pink').first()
    if not member:
        print("Creating member user...")
        member = User(name='Caesar', email='caesar1@hey.pink', role='member', phone='081234567891')
        db.session.add(member)
    member.set_password('Caesar1234')
    print("Member password set to Caesar1234")
    
    db.session.commit()
    
    # Ensure member has an order to update
    order = Order.query.filter_by(user_id=member.id).first()
    if not order:
        print("Creating test order for member...")
        order = Order(
            user_id=member.id,
            order_number=f'ORD-{datetime.now().strftime("%Y%m%d")}-TEST',
            product_name='Paket Starter Kolam',
            quantity=1,
            total_price=500000,
            status='pending',
            created_at=datetime.utcnow()
        )
        db.session.add(order)
        db.session.commit()
        print(f"Created test order {order.order_number}")
    else:
        print(f"Member already has order {order.order_number}")

    print("Setup complete.")
