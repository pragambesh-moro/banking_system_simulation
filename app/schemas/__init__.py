from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from typing import Optional, List
from datetime import datetime
from enum import Enum

class TransactionTypeEnum(str, Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"

class AccountCreate(BaseModel):
    initial_balance: Decimal = Field(default=Decimal('0.00'), ge=0, description="Initial balance of the account, must be non-negative.")
    model_config = ConfigDict(
        json_schema_extra={
            "example":{
                "initial_balance":1000.00
            }
        }
    )

class AccountResponse(BaseModel):
    id: int
    account_number: str
    balance: Decimal
    created_at: datetime

    model_config = ConfigDict(from_attributes=True, json_encoders={
        Decimal: lambda v: float(v)
    })

class TransactionResponse(BaseModel):
    id: int
    account_id: int
    transaction_type: TransactionTypeEnum
    amount: Decimal
    balance_after: Decimal
    related_trasaction_id: Optional[int] = None
    description: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TransactionHistoryResponse(BaseModel):
    account_id: int
    account_number: str
    current_balance: Decimal
    transactions: List[TransactionResponse]
    total_transactions: int

    model_config = ConfigDict(from_attributes=True, json_encoders= {
        Decimal: lambda v: float(v)
    })

class DepositRequest(BaseModel):
    account_id: int = Field(..., gt=0, description="Acount ID to deposit into")
    amount: Decimal = Field(..., gt=0.00, description="Amount to deposit")
    description: Optional[str] = Field(None, max_length=255, description="Optional description on the transaction")

    model_config = ConfigDict(
        json_schema_extra={
            "example" : {
                "account_id":1,
                "amount":500.00,
                "description":"Monthly allowance"
            }
        }
    )

class TransactionSuccessResponse(BaseModel):
    message: str
    transaction: TransactionResponse
    new_balance: Decimal

    model_config = ConfigDict(from_attributes=True, json_encoders={
        Decimal: lambda v: float(v)
        })

class WithdrawalRequest(BaseModel):
    account_id: int = Field(..., gt=0, description="Account to withdraw from")
    amount: Decimal = Field(..., gt=0, description="Amount to withdraw")
    description: Optional[str] = Field(None, max_length=255, description="Optional description")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "account_id":1,
                "amount":20.00,
                "description":"Test withdrawal"
            }
        }
    )

class TransferRequest(BaseModel):
    from_account_id: int = Field(..., gt=0, description="Transferring from")
    to_account_id: int = Field(..., gt=0, description="Transferring to")
    amount: Decimal = Field(..., gt=0.00, description="Amount to transfer")
    description: Optional[str] = Field(None, max_length=255, description="Optional description")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "from_account_id":1,
                "to_account_id":2,
                "amount":200.00,
                "description":"Rent payment"
            }
        }
    )

class AccountTransactionDetail(BaseModel):
    account_id: int
    transaction: TransactionResponse
    new_balance: Decimal
    
    model_config = ConfigDict(from_attributes=True, json_encoders={
            Decimal: lambda v: float(v)
        }
    )

class TransferSuccessResponse(BaseModel):
    message: str
    from_account: AccountTransactionDetail
    to_account: AccountTransactionDetail
    
    model_config = ConfigDict(from_attributes=True)