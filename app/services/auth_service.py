from sqlalchemy.orm import Session
from app.models import User, Account, Transaction, TransactionType
from app.schemas import UserCreate, AuthResponse, UserResponse, AccountInfoResponse
from app.utils import hash_password, verify_password, create_access_token
from app.services import generate_account_number
from decimal import Decimal

def resgister_user(db: Session, user_data: UserCreate) -> dict:

    existing_user = db.query(User).filter(User.email == user_data.email).first()

    if existing_user:
        raise ValueError("Email already registered with system")
    
    # Validate password length (bcrypt max is 72 bytes)
    if len(user_data.password.encode('utf-8')) > 72:
        raise ValueError("Password is too long. Maximum length is 72 characters.")
    
    try:
        hashed_pwd = hash_password(user_data.password)
        new_user = User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_pwd
        )
        db.add(new_user)
        db.flush()

        account_number = generate_account_number()
        new_account = Account(
            user_id=new_user.id,
            account_number=account_number,
            balance=user_data.initial_deposit
        )
        db.add(new_account)
        db.flush()

        if user_data.initial_deposit > 0:
            initial_transaction = Transaction(
                account_id=new_account.id,
                transaction_type=TransactionType.CREDIT,
                amount=user_data.initial_deposit,
                balance_after=user_data.initial_deposit,
                description="Initial deposit"
            )
            db.add(initial_transaction)

        db.commit()
        db.refresh(new_user)
        db.refresh(new_account)

        token = create_access_token(data={"user_id": new_user.id, "email": new_user.email})

        return {
            "user":new_user,
            "account": new_account,
            "token": token
        }
    
    except Exception as e:
        db.rollback()
        raise Exception(f"Registration failed: {str(e)}")
    
def login_user(db: Session, email: str, password: str) -> dict:

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise ValueError("Invalid email or password")
    
    if not verify_password(password, user.hashed_password):
        raise ValueError("Invalid email or password")
    
    account = db.query(Account).filter(Account.user_id == user.id).first()

    if not account:
        raise ValueError("Account not found for user")

    token = create_access_token(data={"user_id": user.id, "email": user.email})

    return {
        "user": user,
        "account": account,
        "token": token
    }