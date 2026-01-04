from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AccountCreate, AccountResponse, TransactionHistoryResponse, DepositRequest, TransactionSuccessResponse
from app.services import create_account, get_account_by_id, get_account_transactions, deposit_funds


router = APIRouter(prefix="/api/v1", tags=["accounts"])


@router.post(
    "/accounts",
    response_model=AccountResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new bank account",
    description="Creates a new bank account with an optional initial balance"
)
def create_account_endpoint(account_data: AccountCreate, db: Session = Depends(get_db)):
    try:
        account = create_account(db, account_data)
        return account
    except Exception as e:
        db.rollback()
        import traceback
        print("=" * 60)
        print("ERROR CREATING ACCOUNT:")
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        print("Full Traceback:")
        traceback.print_exc()
        print("=" * 60)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create account: {str(e)}"
        )


@router.get(
    "/accounts/{account_id}",
    response_model=AccountResponse,
    summary="Get account details",
    description="Retrieve account information by account ID"
)
def get_account_endpoint(account_id: int, db: Session = Depends(get_db)):
 
    account = get_account_by_id(db, account_id)
    
    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Account with id {account_id} not found"
        )
    
    return account


@router.get(
    "/accounts/{account_id}/history",
    response_model=TransactionHistoryResponse,
    summary="Get Transaction History",
    description="Retrieve transaction history for the given account in a paginated format"
)
def get_transaction_history_endpoint(account_id: int, limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 100!")
    if offset < 0:
        raise HTTPException(status_code=400, detail="Offset cannot be negative!!")
    
    try:
        history = get_account_transactions(db, account_id, limit, offset)
        return history
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"failed to retrieve transaction history: {str(e)}")
    

@router.post(
    "/transactions/deposit",
    response_model=TransactionSuccessResponse,
    summary="Make a deposit",
    description="Add funds to an account given the deatils and amount"
)
def deposit_funds_endpoint(deposit_data: DepositRequest, db: Session = Depends(get_db)):
    try:
        result = deposit_funds(
            db=db,
            account_id=deposit_data.account_id,
            amount=deposit_data.amount,
            description=deposit_data.description            
        )

        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Deposit failed: {str(e)}")