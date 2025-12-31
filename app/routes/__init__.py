from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import AccountCreate, AccountResponse
from app.services import create_account, get_account_by_id


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