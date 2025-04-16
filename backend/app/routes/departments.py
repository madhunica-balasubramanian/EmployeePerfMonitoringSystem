from fastapi import APIRouter

router = APIRouter()

@router.get("/departments")
async def get_metrics():
    return {"message": "Departments endpoint"}