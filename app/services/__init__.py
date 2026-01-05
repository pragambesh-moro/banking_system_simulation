from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models import Account, TransactionType, Transaction
from app.schemas import AccountCreate, TransactionSuccessResponse
from decimal import Decimal as d
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

def deposit_funds(db: Session, account_id: int, amount: d, description: str = None) -> TransactionSuccessResponse:

    if amount <= 0:
        raise ValueError("Deposit amount must be positive")
    
    try:
        account = db.query(Account).filter(Account.id == account_id).with_for_update().first()
        
        if not account:
            raise ValueError(f"Account with id {account_id} not found")
        
        old_balance = account.balance
        new_balance = old_balance + amount
        
        account.balance = new_balance
        
        transaction = Transaction(
            account_id=account_id,
            transaction_type=TransactionType.CREDIT,
            amount=amount,
            balance_after=new_balance,
            description=description or "Deposit"
        )
        
        db.add(transaction)
        db.flush()
        db.refresh(transaction)
        
        # Validate response BEFORE committing
        try:
            response = TransactionSuccessResponse(
                message="Deposit successful",
                transaction=transaction,
                new_balance=new_balance
            )
        except Exception as validation_error:
            db.rollback()
            raise Exception(
                f"Response validation failed - this is a code bug: {validation_error}"
            )
        
        # Only commit if response is valid
        db.commit()
        
        return response
        
    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise

def withdraw_funds(db: Session, account_id: int, amount: d, description: str = None) -> TransactionSuccessResponse:

    if amount <= 0:
        raise ValueError("Withdrawal amount must be positive!")
    
    try:
        account = db.query(Account).filter(Account.id == account_id).with_for_update().first()

        if not account:
            raise ValueError(f"Account with account_id {account_id} not found")
        
        old_balance = account.balance
        
        if old_balance < amount:
            raise ValueError(f"Insuficient funds! Current balance: {old_balance}")
        
        new_balance = old_balance - amount

        account.balance = new_balance

        transaction = Transaction(
            account_id=account_id,
            transaction_type=TransactionType.DEBIT,
            amount=amount,
            balance_after=new_balance,
            description=description or "Withdrawal"
        )

        db.add(transaction)
        db.flush()
        db.refresh(transaction)

        try:
            response = TransactionSuccessResponse(
                message="Withdrawal successful!",
                transaction=transaction,
                new_balance=new_balance
            )
        except Exception as error:
            db.rollback()
            print(f"Error: {error}")

        db.commit()

        return response
    
    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise

