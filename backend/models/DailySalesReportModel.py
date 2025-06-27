from db.base import Base
from sqlalchemy import (
    Column, Integer, String, Text, Date, ForeignKey, Numeric, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class DailySalesReport(Base):
    __tablename__ = "daily_sales_report"

    id = Column(Integer, primary_key=True)
    merchandiser_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    retail_partner_id = Column(Integer, ForeignKey("retail_partners.id"), nullable=False)
    report_date = Column(Date, nullable=False)
    status = Column(String(50), default="submitted")
    notes = Column(Text)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    merchandiser = relationship("User", back_populates="sales_reports")
    retail_partner = relationship("RetailPartner", back_populates="sales_reports")
    sales_items = relationship("DailySalesItem", back_populates="report", cascade="all, delete-orphan")

    __table_args__ = (
        UniqueConstraint("merchandiser_id", "report_date", name="uix_merch_report_date"),
        CheckConstraint("status IN ('submitted', 'pending', 'approved', 'rejected')"),
    )