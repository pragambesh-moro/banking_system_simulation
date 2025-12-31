from pydantic import BaseModel, Field, ConfigDict
from decimal import Decimal
from typing import Optional
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