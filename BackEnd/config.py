import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    # ✨ TEMPORARY FIX - Hardcode untuk testing
    JWT_SECRET_KEY = 'dev-jwt-secret-key'  # Fixed string!
    
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///temanikan_v2.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False
    SQLALCHEMY_ENGINE_OPTIONS = {'connect_args': {'timeout': 30}}
    
    # Gemini AI Configuration - Support Multiple API Keys untuk High Availability
    # Format: GEMINI_API_KEYS=key1,key2,key3 (pisahkan dengan koma untuk backup keys)
    # Prioritas: GEMINI_API_KEYS (plural) > GEMINI_API_KEY (singular, backward compatibility)
    _GEMINI_API_KEYS_STR = os.getenv('GEMINI_API_KEYS', os.getenv('GEMINI_API_KEY', 'AIzaSyA_nyNIO60t4OUKkJLKgPnXw4EwoUcOfB8'))
    
    @classmethod
    def _parse_api_keys(cls):
        """Parse API keys from string"""
        # Prioritize GEMINI_API_KEYS (plural), fallback to GEMINI_API_KEY (singular)
        keys_str = os.getenv('GEMINI_API_KEYS') or os.getenv('GEMINI_API_KEY') or cls._GEMINI_API_KEYS_STR
        if not keys_str:
            return []
        # Split by comma and strip whitespace
        keys = [key.strip() for key in keys_str.split(',') if key.strip()]
        return keys
    
    # Class property untuk backward compatibility dan multiple keys support
    @classmethod
    def get_gemini_api_keys(cls):
        """Get list of API keys (primary + backups) - class method"""
        return cls._parse_api_keys()
    
    @classmethod
    def get_gemini_api_key(cls):
        """Get primary API key (backward compatibility) - class method"""
        keys = cls._parse_api_keys()
        return keys[0] if keys else None
    
    # Instance property untuk backward compatibility
    @property
    def GEMINI_API_KEY(self):
        """Get primary API key (backward compatibility)"""
        return self.get_gemini_api_key()
    
    @property
    def GEMINI_API_KEYS(self):
        """Get list of API keys (primary + backups)"""
        return self.get_gemini_api_keys()

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    SQLALCHEMY_ECHO = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
