"""Update status check constraint

Revision ID: 58ba57059975
Revises: 74f0eed47c92
Create Date: 2025-06-27 12:52:50.914312

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '58ba57059975'
down_revision: Union[str, Sequence[str], None] = '74f0eed47c92'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop old constraint (you must use the actual name)
    op.drop_constraint('daily_sales_report_status_check', 'daily_sales_report', type_='check')

    # Add the updated constraint
    op.create_check_constraint(
        "daily_sales_report_status_check",
        "daily_sales_report",
        "status IN ('submitted', 'pending', 'approved', 'rejected')"
    )


def downgrade() -> None:
    # Revert to the old constraint (if needed)
    op.drop_constraint('daily_sales_report_status_check', 'daily_sales_report', type_='check')
    op.create_check_constraint(
        "daily_sales_report_status_check",
        "daily_sales_report",
        "status IN ('submitted', 'approved', 'rejected')"  # Old version
    )
