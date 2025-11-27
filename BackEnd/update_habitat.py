"""Update existing fish species with habitat information"""
from app import create_app
from models import db, FishSpecies

app = create_app('development')

# Habitat data untuk setiap ikan
habitat_data = {
    'Ikan Koi': 'Kolam outdoor dan indoor dengan air tenang. Berasal dari Jepang, ikan koi hidup di kolam dengan kedalaman minimal 1 meter. Mereka lebih menyukai air yang jernih dengan oksigen yang cukup.',
    'Ikan Cupang': 'Perairan tenang seperti sawah, rawa, dan sungai kecil di Asia Tenggara. Ikan cupang dapat hidup di air dengan oksigen rendah karena memiliki organ labirin.',
    'Ikan Mas Koki': 'Akuarium dan kolam indoor dengan air bersih. Berasal dari China, ikan mas koki adalah hasil domestikasi yang memerlukan air yang bersih dan well-maintained.',
    'Ikan Discus': 'Sungai Amazon dengan air hangat dan lunak. Habitat alami mereka adalah perairan hitam (blackwater) di Amazon dengan pH rendah dan suhu hangat.',
    'Ikan Arwana': 'Sungai dan danau besar di Asia Tenggara dan Amerika Selatan. Ikan arwana adalah predator permukaan yang hidup di perairan tawar dengan banyak vegetasi.',
    'Ikan Guppy': 'Sungai dan anak sungai di Amerika Selatan dan Karibia. Ikan guppy sangat adaptif dan dapat hidup di berbagai kondisi air, dari air tawar hingga sedikit payau.',
    'Ikan Molly': 'Perairan payau dan tawar di Amerika Tengah dan Selatan. Ikan molly dapat beradaptasi dengan baik di air payau dan lebih menyukai air dengan sedikit garam.',
    'Ikan Neon Tetra': 'Sungai blackwater di Amazon dengan air lunak dan asam. Habitat alami mereka adalah perairan gelap dengan banyak tumbuhan dan pH rendah.'
}

with app.app_context():
    print("Updating habitat information...")
    
    updated_count = 0
    for fish_name, habitat_text in habitat_data.items():
        fish = FishSpecies.query.filter_by(name=fish_name).first()
        if fish:
            fish.habitat = habitat_text
            updated_count += 1
            print(f"✓ Updated habitat for: {fish_name}")
        else:
            print(f"✗ Fish not found: {fish_name}")
    
    db.session.commit()
    print(f"\n✅ Successfully updated {updated_count} fish species with habitat information")
    
    # Verify
    print("\n=== Verification ===")
    all_fish = FishSpecies.query.all()
    for fish in all_fish:
        habitat_status = "✓" if fish.habitat else "✗"
        print(f"{habitat_status} {fish.name}: {len(fish.habitat) if fish.habitat else 0} characters")
