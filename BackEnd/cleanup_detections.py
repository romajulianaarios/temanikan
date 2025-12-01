from app import create_app
from models import db, DiseaseDetection

def cleanup_detections():
    app = create_app('development')
    with app.app_context():
        # Keep only IDs 1, 2, 3
        # Delete all where id > 3
        try:
            deleted_count = DiseaseDetection.query.filter(DiseaseDetection.id > 3).delete()
            db.session.commit()
            print(f"Successfully deleted {deleted_count} detection records.")
            
            # Verify remaining
            remaining = DiseaseDetection.query.all()
            print(f"Remaining records: {[d.id for d in remaining]}")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error cleaning up detections: {e}")

if __name__ == '__main__':
    cleanup_detections()
