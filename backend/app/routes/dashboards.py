from fastapi import APIRouter


router = APIRouter(prefix="/api/v1/dashboard", tags=["dashboard"])
@router.get("/view")
async def get_metrics():
    return {"message": "dashboards endpoint"}