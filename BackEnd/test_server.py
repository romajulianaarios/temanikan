"""Simple test server"""
from flask import Flask, jsonify
from flask_cors import CORS
import sys

print("Python version:", sys.version)
print("Creating Flask app...")

app = Flask(__name__)
CORS(app)

@app.route('/test')
def test():
    return jsonify({"message": "Server is working"})

@app.route('/api/fishpedia')
def get_fish():
    return jsonify({
        "success": True,
        "count": 8,
        "species": [
            {"id": 1, "name": "Test Fish", "scientificName": "Testus fishus"}
        ]
    })

if __name__ == '__main__':
    print("Starting simple test server on port 5000...")
    try:
        app.run(host='0.0.0.0', port=5000, debug=False)
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        input("Press Enter to exit...")
