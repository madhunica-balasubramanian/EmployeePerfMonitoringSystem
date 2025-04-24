from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/metric-records", tags=["metric-records"])

@router.get("/view")
async def get_metrics():
    return {"message": "metric_records endpoint"}

#@router.post("/submit-perf-data")
#@router.post("/submit-wellness-data")