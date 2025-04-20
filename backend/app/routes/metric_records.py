from fastapi import APIRouter

router = APIRouter()

@router.get("/metric_records")
async def get_metrics():
    return {"message": "metric_records endpoint"}