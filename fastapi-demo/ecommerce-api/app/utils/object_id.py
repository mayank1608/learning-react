# app/utils/object_id.py

from bson import ObjectId

def to_object_id(id: str):
    return ObjectId(id)