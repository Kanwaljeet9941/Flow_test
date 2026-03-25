from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import pipelines_collection
from models.pipeline import PipelinePayload, PipelineResponse

router = APIRouter(prefix="/pipelines", tags=["pipelines"])


def to_response(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.post("/", response_model=PipelineResponse)
async def create_pipeline(payload: PipelinePayload):
    doc = payload.model_dump()
    result = await pipelines_collection.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return doc


@router.get("/", response_model=list[PipelineResponse])
async def list_pipelines():
    pipelines = []
    async for doc in pipelines_collection.find():
        pipelines.append(to_response(doc))
    return pipelines


@router.get("/{pipeline_id}", response_model=PipelineResponse)
async def get_pipeline(pipeline_id: str):
    if not ObjectId.is_valid(pipeline_id):
        raise HTTPException(status_code=400, detail="Invalid pipeline ID")
    doc = await pipelines_collection.find_one({"_id": ObjectId(pipeline_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return to_response(doc)


@router.put("/{pipeline_id}", response_model=PipelineResponse)
async def update_pipeline(pipeline_id: str, payload: PipelinePayload):
    if not ObjectId.is_valid(pipeline_id):
        raise HTTPException(status_code=400, detail="Invalid pipeline ID")
    result = await pipelines_collection.replace_one(
        {"_id": ObjectId(pipeline_id)},
        payload.model_dump(),
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    doc = await pipelines_collection.find_one({"_id": ObjectId(pipeline_id)})
    return to_response(doc)


@router.delete("/{pipeline_id}")
async def delete_pipeline(pipeline_id: str):
    if not ObjectId.is_valid(pipeline_id):
        raise HTTPException(status_code=400, detail="Invalid pipeline ID")
    result = await pipelines_collection.delete_one({"_id": ObjectId(pipeline_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Pipeline not found")
    return {"status": "deleted", "id": pipeline_id}
