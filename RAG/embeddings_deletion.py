from pinecone import Pinecone
from app.core.config import get_settings

settings = get_settings()
pc = Pinecone(api_key=settings.pinecone_api_key)
pc.delete_index(settings.pinecone_index_name)