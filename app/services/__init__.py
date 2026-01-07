from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from app.models import Account, TransactionType, Transaction
from app.schemas import AccountCreate, TransactionSuccessResponse, TransferSuccessResponse, AccountTransactionDetail
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

def get_account_by_account_number(db: Session, account_number: str) -> Account | None:
    """Get account by account number"""
    return db.query(Account).filter(Account.account_number == account_number).first()


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

def transfer_funds(db: Session, from_account_id: int, to_account_id: int, amount: d, description: str = None) -> TransferSuccessResponse:
    try:
        if amount <= 0:
            raise ValueError("Amount has to be greater than zero")
        if from_account_id == to_account_id:
            raise ValueError("Cannot transfer to same account!")
        
        #Row-level locking with deadlock prevention:
        if from_account_id < to_account_id:
            first_id, second_id = from_account_id, to_account_id
        else:
            first_id, second_id = to_account_id, from_account_id

        first_account = db.query(Account).filter(Account.id == first_id).with_for_update().first()
        second_account = db.query(Account).filter(Account.id == second_id).with_for_update().first()

        if from_account_id < to_account_id:
            from_account, to_account = first_account, second_account
        else:
            from_account, to_account = second_account, first_account

        if not from_account:
            raise ValueError(f"Source account with ID: {from_account_id} not found")
        
        if not to_account:
            raise ValueError(f"Destination account with ID: {to_account_id} not found")
        
        if from_account.balance < amount:
            raise ValueError("Insufficeient funds")
        
        from_old_balance = from_account.balance
        from_new_balance = from_old_balance - amount
        from_account.balance = from_new_balance

        to_old_balance = to_account.balance
        to_new_balance = to_old_balance + amount
        to_account.balance = to_new_balance

        from_transaction = Transaction(
            account_id=from_account_id,
            transaction_type=TransactionType.DEBIT,
            amount=amount,
            balance_after=from_new_balance,
            description=description or f"Transfer to account {to_account.account_number}"
        )

        db.add(from_transaction)

        to_transaction = Transaction(
            account_id=to_account_id,
            transaction_type=TransactionType.CREDIT,
            amount=amount,
            balance_after=to_new_balance,
            description=description or f"Transfer from account {from_account.account_number}"
        )

        db.add(to_transaction)

        db.flush()

        from_transaction.related_transaction_id = to_transaction.id
        to_transaction.related_transaction_id = from_transaction.id

        db.flush()

        db.refresh(from_transaction)
        db.refresh(to_transaction)

        try:
            response = TransferSuccessResponse(
                message="Transfer successful",
                from_account=AccountTransactionDetail(
                    account_id=from_account_id,
                    transaction=from_transaction,
                    new_balance=from_new_balance
                ),
                to_account=AccountTransactionDetail(
                    account_id=to_account_id,
                    transaction=to_transaction,
                    new_balance=to_new_balance
                )
            )
        except Exception as validation_error:
            db.rollback()
            raise Exception(
                f"Response validation failed: {validation_error}"
            )

    # Only commit if validation succeeded
        db.commit()

        return response
    
    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise

def transfer_by_account_number(db: Session, from_account_id: int, to_account_number: str, amount: d, description: str = None) -> TransferSuccessResponse:
    """Transfer funds using recipient's account number"""
    try:
        # Find recipient account by account number
        to_account = get_account_by_account_number(db, to_account_number)
        
        if not to_account:
            raise ValueError(f"Account with account number {to_account_number} not found")
        
        # Use existing transfer_funds function
        return transfer_funds(db, from_account_id, to_account.id, amount, description)
    
    except ValueError:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise

def get_dashboard_stats(db: Session, account_id: int, days: int = 30) -> dict:
    """Get dashboard statistics for the last N days"""
    account = get_account_by_id(db, account_id)
    
    if not account:
        raise ValueError(f"Account with id {account_id} not found")
    
    # Calculate date threshold
    from datetime import datetime, timedelta
    threshold_date = datetime.now() - timedelta(days=days)
    
    # Get all transactions in the period
    transactions = db.query(Transaction).filter(
        Transaction.account_id == account_id,
        Transaction.created_at >= threshold_date
    ).all()
    
    total_income = sum(
        t.amount for t in transactions 
        if t.transaction_type == TransactionType.CREDIT
    )
    
    total_expenses = sum(
        t.amount for t in transactions 
        if t.transaction_type == TransactionType.DEBIT
    )
    
    return {
        "total_income": total_income,
        "total_expenses": total_expenses,
        "total_transactions": len(transactions)
    }
