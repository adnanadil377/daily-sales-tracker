from db.base import Base
from sqlalchemy import (
    Column, Integer, String, Text, Date, ForeignKey, Numeric, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50))
    unit_cost_price = Column(Numeric(10, 2), nullable=False)  # Cost price (what YOU paid)
    unit_price = Column(Numeric(10, 2), nullable=False)       # Default selling price (optional fallback)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    inventory = relationship("Inventory", back_populates="product")
    sales_items = relationship("DailySalesItem", back_populates="product")