from fastapi import APIRouter

router = APIRouter()

@router.get("/dashboard")
async def get_metrics():
    return {"message": "dashboards endpoint"}