from db.base import Base
from sqlalchemy import (
    Column, Integer, String, Text, Date, ForeignKey, Numeric, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime

class DailySalesItem(Base):
    __tablename__ = "daily_sales_items"

    id = Column(Integer, primary_key=True)
    report_id = Column(Integer, ForeignKey("daily_sales_report.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity_sold = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)         # Final sold price (after discount)
    discount_percent = Column(Numeric(5, 2), nullable=True)     # Optional discount

    report = relationship("DailySalesReport", back_populates="sales_items")
    product = relationship("Product", back_populates="sales_items")

    @property
    def total_price(self):
        return float(self.quantity_sold) * float(self.unit_price)