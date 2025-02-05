import os 

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

    PG_USER = os.environ.get('PG_USER', 'postgres')
    PG_PASSWORD = os.environ.get('PG_PASSWORD', 'postgres')
    PG_HOST = os.environ.get('PG_HOST', 'localhost')
    PG_PORT = os.environ.get('PG_PORT', '5432')
    PG_DATABASE = os.environ.get('PG_DATABASE', 'postgres')

    # Database URI for connecting to PostgreSQL
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f'postgresql+psycopg://{PG_USER}:{PG_PASSWORD}@{PG_HOST}:{PG_PORT}/{PG_DATABASE}')