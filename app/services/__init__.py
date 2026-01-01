from sqlalchemy.orm import Session
from app.models import Account, TransactionType, Transaction
from app.schemas import AccountCreate
from decimal import Decimal
import random

def generate_account_number() -> str:
    number = random.randint(100000, 999999)
    return f"ACC-{number:06d}"
    #Account number looks like ACC-XXXXXX

def create_account(db: Session, account_data: AccountCreate) -> Account:
    account_number = generate_account_number()

    new_account = Account(
        account_number = account_number,
        balance = account_data.initial_balance
    )

    db.add(new_account)
    db.flush()

    if account_data.initial_balance > 0:
        initial_transaction = Transaction(
            account_id=new_account.id,
            transaction_type=TransactionType.CREDIT,
            amount=account_data.initial_balance,
            balance_after=account_data.initial_balance,
            description="Initial deposit"
        )
        db.add(initial_transaction)
    
    db.commit()

    db.refresh(new_account)

    return new_account

def get_account_by_id(db: Session, account_id: int) -> Account | None:
    #returns account object if found or None
    return db.query(Account).filter(Account.id == account_id).first()


def get_account_transactions(db: Session, account_id: int, limit: int = 10, offset: int = 0) -> dict:
    account = db.query(Account).filter(Account.id == account_id).first()

    if not account:
        raise ValueError(f"Account with account id: {account_id} not found!!")
    
    total_count = db.query(Transaction).filter(Transaction.account_id == account_id).count()

    transactions = db.query(Transaction).filter(Transaction.account_id == account_id).order_by(Transaction.created_at.desc()).limit(limit).offset(offset).all()

    return {
        "account_id": account.id,
        "account_number": account.account_number,
        "current_balance": account.balance,
        "transactions": transactions,
        "total_transactions": total_count
    }

