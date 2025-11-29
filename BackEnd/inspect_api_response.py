from app import create_app
from flask_jwt_extended import create_access_token
from models import User
import json

app = create_app()

with app.app_context():
    member = User.query.filter_by(email='caesar1@hey.pink').first()
    client = app.test_client()
    token = create_access_token(identity=str(member.id))
    headers = {'Authorization': f'Bearer {token}'}
    
    response = client.get('/api/notifications', headers=headers)
    data = response.get_json()
    
    print(json.dumps(data, indent=2))
