import mysql.connector
import os
import dotenv

# Load environment variables
dotenv.load_dotenv()

# Connect to the database
try:
    cnx = mysql.connector.connect(
        user=os.environ['MYSQL_USER'],
        password=os.environ['MYSQL_PASSWORD'],
        host=os.environ['MYSQL_HOST'],
        database=os.environ['MYSQL_DB'],
    )
    cursor = cnx.cursor()

    # Check if admin user exists
    cursor.execute("SELECT * FROM voters WHERE role = 'admin'")
    admin_exists = cursor.fetchone()

    if not admin_exists:
        # Add an admin user
        cursor.execute(
            "INSERT INTO voters (voter_id, role, password) VALUES (%s, %s, %s)",
            ("admin1", "admin", "admin123")
        )
        cnx.commit()
        print("Admin user created: voter_id='admin1', password='admin123'")
    else:
        print("Admin user already exists")

    # Clear any unread results
    while cnx.unread_result:
        cursor.fetchall()

    # Show all users
    cursor.execute("SELECT * FROM voters")
    users = cursor.fetchall()
    print("\nAll users in the database:")
    for user in users:
        print(f"voter_id: {user[0]}, role: {user[1]}, password: {user[2]}")

except mysql.connector.Error as err:
    print(f"Database error: {err}")
finally:
    if 'cnx' in locals() and cnx.is_connected():
        cursor.close()
        cnx.close()
