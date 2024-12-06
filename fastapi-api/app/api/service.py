import pandas as pd
from sqlalchemy import create_engine
import os

def get_query_engine():
    conn_string = f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@timescale-db:5432/{os.getenv('POSTGRES_DB')}"
    local_engine = create_engine(conn_string)
    # postgresql://username:password@hostname:port/database_name
    local_engine.dialect.description_encoding = None
    return local_engine


def run_query(query: str):
    df = pd.read_sql_query(query, con=get_query_engine())

    if df is not None:
        if len(df):
            return df.to_json(orient='records', force_ascii=False)

    return """{"detail": {"status": "success", "message":"no data found"}}"""
