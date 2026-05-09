-- Custom: pgvector extension + ivfflat index for similarity search
-- Drizzle-kit doesn't generate pgvector-specific DDL, so we add it here.

CREATE EXTENSION IF NOT EXISTS vector;

-- ivfflat index on kb_chunks.embedding for cosine similarity search.
-- Requires the table to have data before it becomes effective; fine for Phase 1.
-- lists=100 is appropriate for <1M rows; increase to 1000 for production.
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx
  ON kb_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
