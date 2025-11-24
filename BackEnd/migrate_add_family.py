"""
Migration script to add 'family' column to fish_species table
"""

from models import db, FishSpecies
from app import create_app

app = create_app('development')

def add_family_column():
    """Add family column to fish_species table"""
    with app.app_context():
        try:
            # Check if column already exists
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            columns = [col['name'] for col in inspector.get_columns('fish_species')]
            
            if 'family' in columns:
                print("✓ Column 'family' already exists in fish_species table")
                return
            
            # Add the column
            with db.engine.connect() as conn:
                conn.execute(db.text("""
                    ALTER TABLE fish_species 
                    ADD COLUMN family VARCHAR(100)
                """))
                conn.commit()
            
            print("✅ Successfully added 'family' column to fish_species table")
            
        except Exception as e:
            print(f"❌ Error adding family column: {e}")
            raise

def populate_family_data():
    """Populate family data for existing fish"""
    with app.app_context():
        try:
            # Default family data based on common fish types
            family_data = {
                'Ikan Koi': 'Cyprinidae',
                'Ikan Cupang': 'Osphronemidae',
                'Ikan Mas Koki': 'Cyprinidae',
                'Ikan Discus': 'Cichlidae',
                'Ikan Arwana': 'Osteoglossidae',
                'Ikan Guppy': 'Poeciliidae',
                'Ikan Molly': 'Poeciliidae',
                'Ikan Neon Tetra': 'Characidae'
            }
            
            updated_count = 0
            for fish_name, family_name in family_data.items():
                fish = FishSpecies.query.filter_by(name=fish_name).first()
                if fish:
                    fish.family = family_name
                    updated_count += 1
                    print(f"✓ Updated family for: {fish_name} -> {family_name}")
            
            db.session.commit()
            print(f"\n✅ Successfully updated {updated_count} fish species with family information")
            
            # Verification
            print("\n=== Verification ===")
            all_fish = FishSpecies.query.all()
            for fish in all_fish:
                print(f"✓ {fish.name}: {fish.family or 'N/A'}")
                
        except Exception as e:
            db.session.rollback()
            print(f"❌ Error populating family data: {e}")
            raise

if __name__ == '__main__':
    print("🔧 Starting migration to add 'family' column...\n")
    add_family_column()
    print("\n📝 Populating family data for existing fish...\n")
    populate_family_data()
    print("\n✨ Migration completed successfully!")
