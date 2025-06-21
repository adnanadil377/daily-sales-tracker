from db.base import Base
from sqlalchemy import (
    Column, Integer, String, Text, Date, ForeignKey, Numeric, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class User(Base):
    __tablename__="users"

    id=Column(Integer, primary_key=True, index=True)
    name=Column(String(100), nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String(50), nullable=False)
    retail_partner_id = Column(Integer, ForeignKey("retail_partners.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    retail_partner = relationship("RetailPartner", back_populates="merchandisers")
    sales_reports = relationship("DailySalesReport", back_populates="merchandiser")

    __table_args__ = (
        CheckConstraint("role IN ('admin', 'merchandiser')"),
    )