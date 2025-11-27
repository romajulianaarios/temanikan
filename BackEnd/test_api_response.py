from app import create_app
from flask_jwt_extended import create_access_token
from models import Notification

app = create_app()

with app.app_context():
    # Generate token for User 3
    access_token = create_access_token(identity='3')
    
    # Create a test client
    client = app.test_client()
    
    # Make request
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    response = client.get('/api/notifications', headers=headers)
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.get_json()}")
