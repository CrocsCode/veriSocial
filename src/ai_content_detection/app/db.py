from mysql.connector import pooling
from contextlib import contextmanager
from app.config import settings

# Initialize MySQL connection pool
mysql_pool = pooling.MySQLConnectionPool(
    pool_name="mypool",
    pool_size=3,
    pool_reset_session=True,
    host=settings.database_host,
    port=settings.database_port,
    user=settings.database_user,
    password=settings.database_password,
    database=settings.database_name,
)

@contextmanager
def get_db_connection():
    conn = mysql_pool.get_connection()
    try:
        yield conn
    finally:
        conn.close()
