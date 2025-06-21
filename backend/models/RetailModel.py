from db.base import Base
from sqlalchemy import (
    Column, Integer, String, Text, Date, ForeignKey, Numeric, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class RetailPartner(Base):
    __tablename__ = "retail_partners"

    id=Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    location = Column(Text)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    merchandisers = relationship("User", back_populates="retail_partner")
    inventory = relationship("Inventory", back_populates="retail_partner")
    sales_reports = relationship("DailySalesReport", back_populates="retail_partner")