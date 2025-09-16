import mysql.connector
import os
import dotenv

# Load environment variables
dotenv.load_dotenv()

# Connect to the database
try:
    print(f"Connecting to database: {os.environ.get('MYSQL_DB', 'unknown')} on {os.environ.get('MYSQL_HOST', 'unknown')}")
    print(f"Using user: {os.environ.get('MYSQL_USER', 'unknown')}")
    
    cnx = mysql.connector.connect(
        user=os.environ['MYSQL_USER'],
        password=os.environ['MYSQL_PASSWORD'],
        host=os.environ['MYSQL_HOST'],
        database=os.environ['MYSQL_DB'],
    )
    print("Connected to database successfully!")
    
    cursor = cnx.cursor()
    
    # Add an admin user if it doesn't exist
    cursor.execute("INSERT IGNORE INTO voters (voter_id, role, password) VALUES ('admin1', 'admin', 'admin123')")
    cnx.commit()
    print(f"Rows affected: {cursor.rowcount}")
    
    # Add a regular user if it doesn't exist
    cursor.execute("INSERT IGNORE INTO voters (voter_id, role, password) VALUES ('user1', 'user', 'user123')")
    cnx.commit()
    print(f"Rows affected: {cursor.rowcount}")
    
    # Show all users
    cursor.execute("SELECT * FROM voters")
    users = cursor.fetchall()
    print("\nAll users in the database:")
    for user in users:
        print(f"voter_id: {user[0]}, role: {user[1]}, password: {user[2]}")
    
except mysql.connector.Error as err:
    print(f"Database error: {err}")
except Exception as e:
    print(f"General error: {e}")
finally:
    if 'cnx' in locals() and cnx.is_connected():
        cursor.close()
        cnx.close()
        print("Database connection closed.")
