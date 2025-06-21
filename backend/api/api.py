from fastapi import APIRouter, Depends
import models
from db.database import get_db
router=APIRouter(path="/api",tags=["api"])

@router.get("/")
def get_all_users(db=Depends(get_db)):
    all_users=db.query(models.user).all()
    return all_users