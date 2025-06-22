from datetime import date, datetime
from typing import Dict, List, Optional, Literal

from fastapi import APIRouter, Depends, HTTPException, Path, status as fastapi_status
from pydantic import BaseModel, Field, computed_field
from sqlalchemy import func
from sqlalchemy.orm import Session, selectinload, joinedload

import models  # Assuming your SQLAlchemy models are in models.py
from db.database import get_db

# --- Router Setup ---
router = APIRouter(prefix="/sales")

# --- Base Pydantic Model Configuration ---
class APIBaseModel(BaseModel):
    """Base Pydantic model with common configuration."""
    class Config:
        from_attributes = True
        populate_by_name = True

# ==============================================================================
# 1. USER RESOURCE
# ==============================================================================

# --- User Pydantic Models ---
class UserResponse(APIBaseModel):
    """Response model for a User, matches TS 'User' interface."""
    id: int
    name: str
    role: Literal['admin', 'merchandiser']
    retail_partner_id: Optional[int] = Field(default=None, alias="retailPartnerId")

# --- User Endpoints ---
@router.get("/users", response_model=List[UserResponse], tags=["Users"])
def get_all_users(db: Session = Depends(get_db)):
    """Retrieves a list of all users."""
    return db.query(models.User).all()

# ==============================================================================
# 2. RETAIL PARTNER RESOURCE
# ==============================================================================

# --- Retail Partner Pydantic Models ---
class CreateRetailRequest(BaseModel):
    """Request model for creating a new Retail Partner."""
    name: str
    location: str

class MerchandiserNameResponse(APIBaseModel):
    """A simplified User model for embedding in RetailPartnerResponse."""
    id: int
    name: str

class RetailPartnerResponse(APIBaseModel):
    """
    Response model for a Retail Partner.
    Note: This is more detailed than the TS 'RetailPartner' interface, which
    has a denormalized 'merchandiser: string'. This response reflects a
    proper one-to-many database relationship for better scalability.
    """
    id: int
    store: str = Field(alias="name") # 'store' is an alias for the 'name' attribute
    location: str
    merchandisers: List[MerchandiserNameResponse]

# --- Retail Partner Endpoints ---
@router.get("/retail-partners", response_model=List[RetailPartnerResponse], tags=["Retail Partners"])
def get_retail_partners(db: Session = Depends(get_db)):
    """Retrieves all retail partners with their associated merchandisers."""
    partners_db = db.query(models.RetailPartner).options(
        selectinload(models.RetailPartner.merchandisers)
    ).all()
    # Pydantic's `model_validate` handles the mapping including the merchandiser list
    return [RetailPartnerResponse.model_validate(p) for p in partners_db]

@router.post("/retail-partners", response_model=RetailPartnerResponse, status_code=fastapi_status.HTTP_201_CREATED, tags=["Retail Partners"])
def create_retail_partner(req: CreateRetailRequest, db: Session = Depends(get_db)):
    """Creates a new retail partner."""
    db_partner = models.RetailPartner(name=req.name, location=req.location)
    db.add(db_partner)
    db.commit()
    db.refresh(db_partner)
    # The new partner will have an empty merchandisers list initially
    return RetailPartnerResponse.model_validate(db_partner)


# ==============================================================================
# 3. PRODUCT RESOURCE
# ==============================================================================

# --- Product Pydantic Models ---
class ProductCreateRequest(BaseModel):
    """Request model for creating a new Product."""
    name: str
    category: str
    unit_cost_price: float = Field(alias="unitCostPrice")
    unit_price: float = Field(alias="unitPrice")

class ProductResponse(APIBaseModel):
    """Response model for a Product, matches TS 'Product' interface."""
    id: int
    name: str
    category: str
    unit_cost_price: float = Field(alias="unitCostPrice")
    unit_price: float = Field(alias="unitPrice")

# --- Product Endpoints ---
@router.get("/products", response_model=List[ProductResponse], tags=["Products"])
def get_all_products(db: Session = Depends(get_db)):
    """Retrieves a list of all products."""
    return db.query(models.Product).all()

@router.get("/products/{product_id}", response_model=ProductResponse, tags=["Products"])
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    """Retrieves a single product by its ID."""
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=fastapi_status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product

@router.post("/products", response_model=ProductResponse, status_code=fastapi_status.HTTP_201_CREATED, tags=["Products"])
def create_product(req: ProductCreateRequest, db: Session = Depends(get_db)):
    """Creates a new product."""
    new_product = models.Product(**req.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

# ==============================================================================
# 4. INVENTORY RESOURCE
# ==============================================================================

# --- Inventory Pydantic Models ---
class InventorySummaryResponse(APIBaseModel):
    """Response for inventory summary, matches TS 'InventoryItem'."""
    retail_partner_id: int = Field(alias="retailPartnerId")
    store_name: str = Field(alias="storeName")
    total_quantity: int = Field(alias="totalQuantity")
    total_value: float = Field(alias="totalValue")

class InventoryProductDetail(APIBaseModel):
    """Response for a single product line in detailed inventory, matches TS 'InventoryDetail'."""
    product_id: int = Field(alias="productId")
    product_name: str = Field(alias="productName")
    category: str
    quantity: int
    unit_selling_price: float = Field(alias="unitSellingPrice")

    @computed_field(alias="totalValue")
    @property
    def total_value(self) -> float:
        return round(self.quantity * self.unit_selling_price, 2)

class StoreInventoryResponse(APIBaseModel):
    """Response for detailed inventory of a store, matches TS 'StoreInventory'."""
    retail_partner_id: int = Field(alias="retailPartnerId")
    store_name: str = Field(alias="storeName")
    products: List[InventoryProductDetail]

class CreateInventoryRequest(BaseModel):
    """Request model for creating a new inventory entry."""
    retail_partner_id: int = Field(alias="retailPartnerId")
    product_id: int = Field(alias="productId")
    quantity: int
    unit_selling_price: float = Field(alias="unitSellingPrice")
    
class FlatInventoryItemResponse(APIBaseModel):
    """Response for a single, flat inventory item (used for POST response)."""
    id: int
    retail_partner_id: int = Field(alias="retailPartnerId")
    product: ProductResponse
    quantity: int
    unit_selling_price: float = Field(alias="unitSellingPrice")

# --- Inventory Endpoints ---
@router.get("/inventory/summary", response_model=List[InventorySummaryResponse], tags=["Inventory"])
def get_inventory_summary(db: Session = Depends(get_db)):
    """
    Retrieves a summary of inventory for each retail partner, including
    total quantity and total value of stock.
    """
    summary_query = db.query(
        models.Inventory.retail_partner_id,
        models.RetailPartner.name.label("store_name"),
        func.sum(models.Inventory.quantity).label("total_quantity"),
        func.sum(models.Inventory.quantity * models.Inventory.unit_selling_price).label("total_value")
    ).join(
        models.RetailPartner, models.Inventory.retail_partner_id == models.RetailPartner.id
    ).group_by(
        models.Inventory.retail_partner_id, models.RetailPartner.name
    ).order_by(
        models.RetailPartner.name
    ).all()

    return [InventorySummaryResponse.model_validate(row) for row in summary_query]

@router.get("/inventory/details-by-store", response_model=List[StoreInventoryResponse], tags=["Inventory"])
def get_detailed_inventory_by_store(db: Session = Depends(get_db)):
    """
    Retrieves detailed inventory for each store, listing all products
    with their quantities, selling prices, and total value per product line.
    """
    all_items = db.query(models.Inventory).options(
        joinedload(models.Inventory.product),
        joinedload(models.Inventory.retail_partner)
    ).order_by(models.Inventory.retail_partner_id, models.Inventory.product_id).all()

    grouped_data: Dict[int, StoreInventoryResponse] = {}
    for item in all_items:
        if not item.retail_partner or not item.product:
            continue
        
        partner_id = item.retail_partner_id
        if partner_id not in grouped_data:
            grouped_data[partner_id] = StoreInventoryResponse(
                retailPartnerId=partner_id,
                storeName=item.retail_partner.name,
                products=[]
            )

        product_detail = InventoryProductDetail(
            productId=item.product.id,
            productName=item.product.name,
            category=item.product.category,
            quantity=item.quantity,
            unitSellingPrice=item.unit_selling_price
        )
        grouped_data[partner_id].products.append(product_detail)

    return list(grouped_data.values())

@router.get("/inventory/{store_id}", response_model=List[StoreInventoryResponse], tags=["Inventory"])
def get_detailed_inventory_by_store_id(store_id:int, db: Session = Depends(get_db)):
    """
    Retrieves detailed inventory for particular store, listing all products
    with their quantities, selling prices, and total value per product line.
    """
    all_items = db.query(models.Inventory).options(
        joinedload(models.Inventory.product),
        joinedload(models.Inventory.retail_partner)
    ).order_by(models.Inventory.retail_partner_id, models.Inventory.product_id).filter(models.Inventory.retail_partner_id==store_id).all()

    grouped_data: Dict[int, StoreInventoryResponse] = {}
    for item in all_items:
        if not item.retail_partner or not item.product:
            continue
        
        partner_id = item.retail_partner_id
        if partner_id not in grouped_data:
            grouped_data[partner_id] = StoreInventoryResponse(
                retailPartnerId=partner_id,
                storeName=item.retail_partner.name,
                products=[]
            )

        product_detail = InventoryProductDetail(
            productId=item.product.id,
            productName=item.product.name,
            category=item.product.category,
            quantity=item.quantity,
            unitSellingPrice=item.unit_selling_price
        )
        grouped_data[partner_id].products.append(product_detail)

    return list(grouped_data.values())

@router.post("/inventory", response_model=FlatInventoryItemResponse, status_code=fastapi_status.HTTP_201_CREATED, tags=["Inventory"])
def create_inventory_item(req: CreateInventoryRequest, db: Session = Depends(get_db)):
    """Creates a single inventory item (associates a product with a retail partner)."""
    # Check for existing item
    existing = db.query(models.Inventory).filter_by(
        retail_partner_id=req.retail_partner_id,
        product_id=req.product_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=fastapi_status.HTTP_409_CONFLICT,
            detail="Inventory item for this product and store already exists."
        )

    # Create new item
    db_item = models.Inventory(**req.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item, attribute_names=['product']) # Eager load the product for the response

    return FlatInventoryItemResponse.model_validate(db_item)

# ==============================================================================
# 5. DAILY SALES RESOURCE
# ==============================================================================

# --- Daily Sales Pydantic Models ---
class DailySalesItemCreate(BaseModel):
    """Request model for an item within a new sales report."""
    product_id: int = Field(alias="productId")
    quantity_sold: int = Field(alias="quantitySold")
    sales_price: float = Field(alias="salesPrice")
    discount_percent: float = Field(alias="discountPercent", ge=0, le=100)

class DailySalesReportCreate(APIBaseModel):
    """Request model to create a new sales report with its items."""
    merchandiser_id: int = Field(alias="merchandiserId")
    retail_partner_id: int = Field(alias="retailPartnerId")
    report_date: date = Field(alias="reportDate")
    data: List[DailySalesItemCreate] # Matches 'data' field in TS
    status: Literal['submitted', 'pending', 'approved', 'rejected'] = 'pending'
    notes: Optional[str] = None

class DailySalesItemResponse(APIBaseModel):
    """Response for a single sales item, matches TS 'DailySalesItem'."""
    product_id: int = Field(alias="productId")
    product_name: str = Field(alias="productName")
    quantity_sold: int = Field(alias="quantitySold")
    sales_price: float = Field(alias="salesPrice")
    discount_percent: float = Field(alias="discountPercent")

    @computed_field(alias="finalPrice")
    @property
    def final_price(self) -> float:
        value = self.sales_price * self.quantity_sold
        discount = value * (self.discount_percent / 100)
        return round(value - discount, 2)

class DailySalesReportResponse(APIBaseModel):
    """Response for a full sales report, matches TS 'DailySalesReport'."""
    id: int = Field(alias="salesId")
    data: List[DailySalesItemResponse]
    merchandiser_id: int = Field(alias="merchandiserId")
    merchandiser_name: str = Field(alias="merchandiserName") # ADDED FIELD
    retail_partner_id: int = Field(alias="retailPartnerId")
    report_date: date = Field(alias="reportDate")
    status: Literal['submitted', 'pending', 'approved', 'rejected']
    notes: Optional[str] = None
    submitted_at: Optional[datetime] = Field(default=None, alias="submittedAt")

    @computed_field(alias="totalQuantity")
    @property
    def total_quantity(self) -> int:
        return sum(item.quantity_sold for item in self.data)

    @computed_field(alias="totalSales")
    @property
    def total_sales_value(self) -> float:
        return round(sum(item.sales_price * item.quantity_sold for item in self.data), 2)

    @computed_field(alias="finalValue")
    @property
    def final_value_after_discount(self) -> float:
        return round(sum(item.final_price for item in self.data), 2)

# --- Daily Sales Endpoints ---
@router.get('/daily-sales-reports', response_model=List[DailySalesReportResponse], tags=["Daily Sales"])
def get_daily_sales_reports(
    db: Session = Depends(get_db),
    merchandiser_id: Optional[int] = None,
    retail_partner_id: Optional[int] = None,
    report_date: Optional[date] = None,
):
    """
    Retrieves daily sales reports with full details.

    Can be filtered by providing optional query parameters:
    - `merchandiser_id`: Filter reports by a specific merchandiser.
    - `retail_partner_id`: Filter reports for a specific retail partner.
    - `report_date`: Filter reports for a specific date (YYYY-MM-DD).
    """
    # Start with a base query
    query = db.query(models.DailySalesReport)

    # Apply filters conditionally
    if merchandiser_id is not None:
        query = query.filter(models.DailySalesReport.merchandiser_id == merchandiser_id)
    if retail_partner_id is not None:
        query = query.filter(models.DailySalesReport.retail_partner_id == retail_partner_id)
    if report_date is not None:
        query = query.filter(models.DailySalesReport.report_date == report_date)

    # Eagerly load related data for efficiency and order the results
    reports_db = query.options(
        selectinload(models.DailySalesReport.merchandiser), # Eager load merchandiser for the name
        selectinload(models.DailySalesReport.sales_items).selectinload(models.DailySalesItem.product)
    ).order_by(models.DailySalesReport.report_date.desc(), models.DailySalesReport.id.desc()).all()

    # Manually construct the response to populate derived fields like 'productName' and 'merchandiserName'
    response_list = []
    for report in reports_db:
        items_response = [
            DailySalesItemResponse(
                productId=item.product_id,
                productName=item.product.name if item.product else "N/A",
                quantitySold=item.quantity_sold,
                salesPrice=item.unit_price, # Assuming DB model's `unit_price` holds the sales price
                discountPercent=item.discount_percent
            ) for item in report.sales_items
        ]
        
        response_list.append(
            DailySalesReportResponse(
                salesId=report.id,
                data=items_response,
                merchandiserId=report.merchandiser_id,
                merchandiserName=report.merchandiser.name if report.merchandiser else "Unknown Merchandiser",
                retailPartnerId=report.retail_partner_id,
                reportDate=report.report_date,
                status=report.status,
                notes=report.notes,
                submittedAt=report.submitted_at
            )
        )
    return response_list

@router.post('/daily-sales-reports', response_model=DailySalesReportResponse, status_code=fastapi_status.HTTP_201_CREATED, tags=["Daily Sales"])
def create_daily_sales_report(req: DailySalesReportCreate, db: Session = Depends(get_db)):
    """Creates a new daily sales report along with its associated sale items."""
    # Create the main report object
    report_db = models.DailySalesReport(
        merchandiser_id=req.merchandiser_id,
        retail_partner_id=req.retail_partner_id,
        report_date=req.report_date,
        status=req.status,
        notes=req.notes,
        submitted_at=datetime.utcnow()
    )
    # Create and add sale item objects
    for item_data in req.data:
        report_db.sales_items.append(models.DailySalesItem(
            product_id=item_data.product_id,
            quantity_sold=item_data.quantity_sold,
            unit_price=item_data.sales_price,
            discount_percent=item_data.discount_percent
        ))

    db.add(report_db)
    db.commit()
    db.refresh(report_db)
    
    # Eagerly load relationships needed for the response model
    db.refresh(report_db, attribute_names=['sales_items', 'merchandiser'])
    for item in report_db.sales_items:
        db.refresh(item, attribute_names=['product'])
        
    # Manually construct the response to ensure all fields are correctly populated
    items_response = [
        DailySalesItemResponse(
            productId=item.product_id,
            productName=item.product.name if item.product else "N/A",
            quantitySold=item.quantity_sold,
            salesPrice=item.unit_price,
            discountPercent=item.discount_percent
        ) for item in report_db.sales_items
    ]
    return DailySalesReportResponse(
        salesId=report_db.id,
        data=items_response,
        merchandiserId=report_db.merchandiser_id,
        merchandiserName=report_db.merchandiser.name if report_db.merchandiser else "Unknown Merchandiser",
        retailPartnerId=report_db.retail_partner_id,
        reportDate=report_db.report_date,
        status=report_db.status,
        notes=report_db.notes,
        submittedAt=report_db.submitted_at
    )