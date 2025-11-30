"""
Script untuk menjalankan semua seed data sekaligus
"""
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

print("=" * 70)
print("  SEED ALL DATA - TEMANIKAN")
print("=" * 70)
print()

# Import semua seed functions
try:
    from seed_fishpedia import seed_fishpedia
    print("✓ seed_fishpedia imported")
except Exception as e:
    print(f"✗ Error importing seed_fishpedia: {e}")
    seed_fishpedia = None

try:
    from seed_forum import seed_forum
    print("✓ seed_forum imported")
except Exception as e:
    print(f"✗ Error importing seed_forum: {e}")
    seed_forum = None

try:
    from seed_disease_detections import seed
    print("✓ seed_disease_detections imported")
except Exception as e:
    print(f"✗ Error importing seed_disease_detections: {e}")
    seed = None

print()
print("=" * 70)
print("  STARTING SEED PROCESS")
print("=" * 70)
print()

# Run all seeds
if seed_fishpedia:
    try:
        # Auto-confirm untuk fishpedia
        import io
        import contextlib
        
        # Simulate 'y' input untuk fishpedia
        old_input = __builtins__['input']
        def mock_input(prompt):
            if 'Delete existing data' in prompt:
                return 'y'
            return old_input(prompt)
        __builtins__['input'] = mock_input
        
        seed_fishpedia()
        __builtins__['input'] = old_input
    except Exception as e:
        print(f"ERROR in seed_fishpedia: {e}")

if seed_forum:
    try:
        seed_forum()
    except Exception as e:
        print(f"ERROR in seed_forum: {e}")

if seed:
    try:
        seed()
    except Exception as e:
        print(f"ERROR in seed_disease_detections: {e}")

print()
print("=" * 70)
print("  SEED PROCESS COMPLETE")
print("=" * 70)
print()

