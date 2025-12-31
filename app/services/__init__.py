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

