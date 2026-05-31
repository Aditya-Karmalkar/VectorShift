from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
from collections import defaultdict, deque

app = FastAPI(title="VectorShift Pipeline API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Pipeline(BaseModel):
    nodes: list[dict[str, Any]]
    edges: list[dict[str, Any]]


def is_dag(nodes: list[dict], edges: list[dict]) -> bool:
    """
    Determines if the pipeline graph is a Directed Acyclic Graph using
    Kahn's algorithm (topological sort via BFS).
    Returns True if no cycles are detected.
    """
    node_ids = {n["id"] for n in nodes}
    adj = defaultdict(list)
    in_degree = defaultdict(int)

    for node_id in node_ids:
        in_degree[node_id] = in_degree.get(node_id, 0)

    for edge in edges:
        src = edge.get("source")
        tgt = edge.get("target")
        if src in node_ids and tgt in node_ids:
            adj[src].append(tgt)
            in_degree[tgt] += 1

    queue = deque([n for n in node_ids if in_degree[n] == 0])
    visited = 0

    while queue:
        node = queue.popleft()
        visited += 1
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return visited == len(node_ids)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


@app.post("/pipelines/parse")
def parse_pipeline(pipeline: Pipeline):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    return {
        "num_nodes": num_nodes,
        "num_edges": num_edges,
        "is_dag": dag,
    }
