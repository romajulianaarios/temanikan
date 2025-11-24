import urllib.request
import json

# Direct test without sleep
try:
    # Test GET /api/fishpedia
    print("=== Testing GET /api/fishpedia ===")
    req = urllib.request.Request('http://localhost:5000/api/fishpedia')
    with urllib.request.urlopen(req, timeout=5) as response:
        print(f"Status: {response.status}")
        
        if response.status == 200:
            data = json.loads(response.read().decode())
            print(f"✓ success: {data.get('success')}")
            print(f"✓ count: {data.get('count')}")
            
            if data.get('species'):
                first_fish = data['species'][0]
                print(f"\n--- Sample Fish ---")
                print(json.dumps(first_fish, indent=2, ensure_ascii=False))
                    
            print(f"\n✅ API Test OK - {data.get('count', 0)} fish found")
        
except Exception as e:
    print(f"✗ Error: {e}")
