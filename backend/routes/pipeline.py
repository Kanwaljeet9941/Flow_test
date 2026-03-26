from fastapi import APIRouter
from database import pipelines_collection
from models.pipeline import PipelinePayload, PipelineResponse

router = APIRouter(prefix="/pipelines", tags=["pipelines"])


@router.post("/", response_model=PipelineResponse)
async def create_pipeline(payload: PipelinePayload):
    doc = payload.model_dump()
    result = await pipelines_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return doc
