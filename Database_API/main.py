import os
import mysql.connector
import jwt
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mysql.connector import errorcode

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI()

# Define allowed origins for CORS
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get MySQL credentials from environment variables
MYSQL_USER = os.getenv("MYSQL_USER")
MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD")
MYSQL_HOST = os.getenv("MYSQL_HOST")
MYSQL_DB = os.getenv("MYSQL_DB")
SECRET_KEY = os.getenv("SECRET_KEY")

# Check if all required environment variables are set
if not all([MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_DB, SECRET_KEY]):
    raise ValueError("❌ Missing environment variables in .env file!")

# Connect to the MySQL database
try:
    cnx = mysql.connector.connect(
        user=MYSQL_USER,
        password=MYSQL_PASSWORD,
        host=MYSQL_HOST,
        database=MYSQL_DB
    )
    cursor = cnx.cursor()
    print("✅ Connected to MySQL successfully!")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("❌ Incorrect MySQL username or password!")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print(f"❌ Database '{MYSQL_DB}' does not exist!")
    else:
        print(f"❌ MySQL Error: {err}")
    raise err  # Stop execution if MySQL connection fails

# Define Pydantic model for login request
class LoginRequest(BaseModel):
    voter_id: str
    password: str

# Authentication function
async def authenticate(voter_id: str, password: str):
    try:
        cursor.execute("SELECT role FROM voters WHERE voter_id = %s AND password = %s", (voter_id, password))
        role = cursor.fetchone()

        if not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid voter ID or password"
            )
        return role[0]
    except mysql.connector.Error as err:
        print("Database error:", err)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )

# Define the POST endpoint for login
@app.post("/login")
async def login(request: LoginRequest):
    role = await authenticate(request.voter_id, request.password)

    # Generate JWT token
    token = jwt.encode(
        {"voter_id": request.voter_id, "role": role},
        SECRET_KEY,
        algorithm="HS256"
    )

    return {"token": token, "role": role}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
