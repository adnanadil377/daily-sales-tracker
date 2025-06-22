from datetime import date
from typing import List
from fastapi import APIRouter, Depends
import models
from sqlalchemy.orm import Session, selectinload, joinedload
from db.database import get_db
from pydantic import BaseModel

router=APIRouter(prefix="/api",tags=["api"])

class CreateRetail(BaseModel):
    name:str
    location:str
    class Config:
        from_attributes=True

class MerchName(BaseModel):
    id:int
    name:str

class RetailPartnerResponse(BaseModel):
    id:int
    merchandisers: List[MerchName]
    store: str
    location: str


@router.get("/")
def get_all_users(db=Depends(get_db)):
    all_users=db.query(models.User).all()
    return all_users

@router.get("/retail_partners",response_model=List[RetailPartnerResponse])
def get_retail_partners(db: Session = Depends(get_db)):
    retailpartners = db.query(models.RetailPartner).options(joinedload(models.RetailPartner.merchandisers)).all()
    response_list = []
    for rp in retailpartners:
        merchandiser_names = [{"name":merch.name,"merch_id":merch.id} for merch in rp.merchandisers]
        response_list.append(
            RetailPartnerResponse(
                id=rp.id,
                merchandisers=merchandiser_names,
                store=rp.name if hasattr(rp, 'name') else "N/A", # Assuming 'name' for store, or adjust
                location=rp.location
            )
        )
    return response_list

# @router.get("/retail_partners")
# def get_retail_partners(db: Session = Depends(get_db)):
#     # retailpartners=db.query(models.RetailPartner).options(joinedload(models.User.name)).all()
#     retailpartners = db.query(models.RetailPartner).options(joinedload(models.RetailPartner.merchandisers)).all()
#     # return RetailResponseModel(id=retailpartners.id, merchandiser=retailpartners.merchandisers[0].name, location=retailpartners.location)
#     # return retailpartners
#     # response_list = []
#     # for rp in retailpartners:
#     #     merchandiser_names = [merch.name for merch in rp.merchandisers]
#     #     response_list.append(
#     #         RetailPartnerResponse(
#     #             id=rp.id,
#     #             merchandisers=merchandiser_names,
#     #             store=rp.name if hasattr(rp, 'name') else "N/A", # Assuming 'name' for store, or adjust
#     #             location=rp.location
#     #         )
#     #     )
#     return retailpartners

@router.post("/retail_partners", response_model=CreateRetail)
def create_retail_partners(newRetail:CreateRetail, db: Session = Depends(get_db)):
    # retailpartners=db.query(models.RetailPartner).all()
    retailpartners=models.RetailPartner(name=newRetail.name, location=newRetail.location)
    db.add(retailpartners)
    db.commit()
    db.refresh(retailpartners)
    return CreateRetail(name=retailpartners.name,location=retailpartners.location)


class ProductModel(BaseModel):
    name:str
    category: str
    unit_cost_price: str # Cost price (what YOU paid)
    unit_price: str


@router.get("/products")
def get_products(db:Session=Depends(get_db)):
    all_products=db.query(models.Product).all()  
    return all_products


@router.post("/products")
def create_products(product:ProductModel,db:Session=Depends(get_db)):
    new_products=models.Product(name=product.name, category=product.category, unit_cost_price=product.unit_cost_price, unit_price=product.unit_cost_price)  
    db.add(new_products)
    db.commit()
    db.refresh(new_products)
    return new_products



class CreateInventoryModel(BaseModel):
    retail_partner_id: int
    product_id: int
    quantity: int
    unit_selling_price:int  # Price offered at this partner

@router.get('/inventory')
def get_inventory(db:Session=Depends(get_db)):
    all_inventory=db.query(models.Inventory).options(joinedload(models.Inventory.product)).all()
    return all_inventory

@router.post("/inventory")
def create_inventory(inv:CreateInventoryModel,db:Session=Depends(get_db)):
    new_inventory=models.Inventory(retail_partner_id=inv.retail_partner_id, product_id=inv.product_id, quantity=inv.quantity, unit_selling_price=inv.unit_selling_price)
    db.add(new_inventory)
    db.commit()
    db.refresh(new_inventory)
    return new_inventory


class CreateDailySaleModel(BaseModel):
    merchandiser_id:int
    retail_partner_id:int
    report_date:date

@router.get('/dailysalesreport')
def get_daily_sales_all(db:Session=Depends(get_db)):
    daily_sales=db.query(models.DailySalesReport).options(joinedload(models.DailySalesReport.sales_items)).all()
    return daily_sales

@router.get('/dailysalesreport/{reportdate}')
def get_daily_sales(reportdate:date, db:Session=Depends(get_db)):
    daily_sales=db.query(models.DailySalesReport).options(joinedload(models.DailySalesReport.sales_items)).filter(models.DailySalesReport.report_date==reportdate).all()
    return daily_sales

@router.post('/dailysalesreport')
def create_daily_sales(dailyreport:CreateDailySaleModel,db:Session=Depends(get_db)):
    new_daily_report=models.DailySalesReport(merchandiser_id=dailyreport.merchandiser_id, retail_partner_id=dailyreport.retail_partner_id, report_date=dailyreport.report_date)
    db.add(new_daily_report)
    db.commit()
    db.refresh(new_daily_report)
    return new_daily_report

class CreateDailyItem(BaseModel):
    report_id :int
    product_id :int
    quantity_sold :int 
    unit_price :int        # Final sold price (after discount)
    discount_percent:int

@router.post('/dailyitem')
def create_daily_sales_item(dailyItem:CreateDailyItem, db:Session=Depends(get_db)):
    new_daily_sales=models.DailySalesItem(report_id=dailyItem.report_id, product_id=dailyItem.product_id, quantity_sold=dailyItem.quantity_sold, unit_price=dailyItem.unit_price, discount_percent=dailyItem.discount_percent)
    db.add(new_daily_sales)
    db.commit()
    db.refresh(new_daily_sales)
    return new_daily_sales