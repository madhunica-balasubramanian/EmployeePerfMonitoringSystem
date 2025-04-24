from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/departments", tags=["departments"])

@router.get("/view")
async def get_metrics():
    return {"message": "Departments endpoint"}