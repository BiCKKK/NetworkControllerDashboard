import os 
from dotenv import load_dotenv

# Load the environment variables from a .env file
load_dotenv()

class Config:
    """
    Configuration class for setting up Flask application settings.
    
    Attributes:
        SECRET_KEY (str): Secret key for Flask application security.
        SQLALCHEMY_TRACK_MODIFICATIONS (bool): Disable SQLAlchemy modification tracking to save resources.
        SQLALCHEMY_DATABASE_URI (str): URI for connecting to the PostgreSQL database.
    """
    SECRET_KEY = os.environ.get('SECRET_KEY', 'bikram123') # Default secret key for development (An example for further secure development)
    SQLALCHEMY_TRACK_MODIFICATIONS = False # Disable modification tracking to improve performance

    # Database URI for connecting to PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    if not SQLALCHEMY_DATABASE_URI:
        raise RuntimeError("DATABASE_URL not set. Please configure your PostgreSQL credentials.")