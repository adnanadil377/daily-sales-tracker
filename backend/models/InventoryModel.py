from db.base import Base
from sqlalchemy import (
    Column, Integer, String, Text, Date, ForeignKey, Numeric, DateTime,
    CheckConstraint, UniqueConstraint
)
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

class Inventory(Base):
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True)
    retail_partner_id = Column(Integer, ForeignKey("retail_partners.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    unit_selling_price = Column(Numeric(10, 2), nullable=False)  # Price offered at this partner
    last_updated = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    retail_partner = relationship("RetailPartner", back_populates="inventory")
    product = relationship("Product", back_populates="inventory")

    __table_args__ = (
        UniqueConstraint("retail_partner_id", "product_id", name="uix_inventory_partner_product"),
    )