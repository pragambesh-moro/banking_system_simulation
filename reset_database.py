from app.database import engine, SessionLocal
from app.models import Account, Transaction
from sqlalchemy import text

def reset_database():
    """
    Reset database by clearing all data and resetting auto-increment counters.
    WARNING: This deletes ALL data!
    """
    db = SessionLocal()
    
    try:
        print("Clearing database...")
        
        # Disable foreign key checks
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
        
        # Truncate tables
        db.execute(text("TRUNCATE TABLE transactions"))
        db.execute(text("TRUNCATE TABLE accounts"))
        
        # Re-enable foreign key checks
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
        
        db.commit()
        
        print("✅ Database reset successfully!")
        print("   - All accounts deleted")
        print("   - All transactions deleted")
        print("   - Auto-increment counters reset to 1")
        
    except Exception as e:
        print(f"❌ Error resetting database: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    response = input("This will DELETE ALL DATA. Continue? (yes/no): ")
    if response.lower() == "yes":
        reset_database()
    else:
        print("Cancelled.")