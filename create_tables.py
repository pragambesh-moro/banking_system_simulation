from app.database import engine, Base
from app.models import Account, Transaction

def create_tables():
    print("Database table creation in progress..")
    Base.metadata.create_all(bind=engine)
    print("Tables created")

if __name__ == "__main__":
    create_tables()
