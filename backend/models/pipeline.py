from pydantic import BaseModel
from typing import List, Optional, Any


class FlowNode(BaseModel):
    id: str
    type: str
    data: dict
    position: dict


class FlowEdge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None


class FlowGraph(BaseModel):
    nodes: List[FlowNode]
    edges: List[FlowEdge]


class FlowMessage(BaseModel):
    messageId: str
    type: str
    triggerMessageId: str
    defaultTriggerMessageId: str
    content: List[Any]


class PipelinePayload(BaseModel):
    flow: FlowGraph
    flowMessage: List[FlowMessage]


class PipelineResponse(BaseModel):
    id: str
    flow: FlowGraph
    flowMessage: List[FlowMessage]
