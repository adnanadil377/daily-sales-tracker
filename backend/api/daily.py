from datetime import date, datetime
from typing import Dict, List, Optional, Literal

from fastapi import APIRouter, Depends, HTTPException, Path, status as fastapi_status
from pydantic import BaseModel, Field, computed_field
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload, joinedload
from models import User, RetailPartner, DailySalesItem, DailySalesReport, Product, Inventory 
import models  # Assuming your SQLAlchemy models are in models.py
from db.database import get_db

# --- Router Setup ---
router = APIRouter(prefix="/daily")

# --- Base Pydantic Model Configuration ---
class APIBaseModel(BaseModel):
    """Base Pydantic model with common configuration."""
    class Config:
        from_attributes = True
        populate_by_name = True


# ==============================================================================
# 1. USER RESOURCE
# ==============================================================================

class UserResponse(APIBaseModel):
    id:int
    name:str
    role: Literal['admin', 'merchandiser']
    retail_partner_id: Optional[int] = Field(default=None, alias="retailPartnerId")

@router.get("/merchandisers", response_model=list[UserResponse])
def get_merchandisers(db:Session=Depends(get_db)):
    all_users=db.query(User).all()
    if not all_users:
        raise HTTPException(status_code=fastapi_status.HTTP_204_NO_CONTENT, detail="merchandisers not found")
    return all_users
    

# ==============================================================================
# 2. RETAIL PARTNER RESOURCE
# ==============================================================================

class CreateRetailRequest(APIBaseModel):
    name:str
    location:str

class MerchandiserNameResponse(APIBaseModel):
    id:int
    name:str

class RetailPartnerResponse(APIBaseModel):
    id:int
    name:str = Field(alias="store")
    location:str
    merchandisers:List[MerchandiserNameResponse]

@router.get("/all_retail", response_model=List[RetailPartnerResponse])
def get_retail(db:Session=Depends(get_db)):
    retails=db.query(RetailPartner).options(selectinload(RetailPartner.merchandisers)).all()
    if not retails:
        raise HTTPException(status_code=fastapi_status.HTTP_204_NO_CONTENT, detail="retails not found")
    return retails

@router.post("/retail",response_model=RetailPartnerResponse)
def create_retail(retail:CreateRetailRequest, db:Session=Depends(get_db)):
    new_retail=RetailPartner(name=retail.name, location=retail.location)
    db.add(new_retail)
    try:
        db.commit()
        db.refresh(new_retail)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=fastapi_status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"error occured due to {str(e)}")
    return new_retail



# ==============================================================================
# 3. PRODUCT RESOURCE
# ==============================================================================
class ProductCreateRequest(APIBaseModel):
    name: str
    category: str
    unit_cost_price :float  # Cost price (what YOU paid)
    unit_price:float

class ProductResponse(APIBaseModel):
    id: int
    name: str
    category: str
    unitCostPrice: float
    unitPrice: float

@router.get("/products", response_model=List[ProductResponse], tags=["Products"])
def get_all_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.get("/products/{product_id}", response_model=ProductResponse, tags=["Products"])
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=fastapi_status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

@router.post("/products", response_model=ProductResponse, status_code=fastapi_status.HTTP_201_CREATED, tags=["Products"])
def create_product(req: ProductCreateRequest, db: Session = Depends(get_db)):
    new_product = Product(**req.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# ==============================================================================
# 4. INVENTORY RESOURCE
# ==============================================================================

# --- Inventory Pydantic Models ---
