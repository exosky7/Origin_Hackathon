import mysql.connector
from mysql.connector import Error


class SQLConnector:

    def __init__(self):
        try:
            connection = mysql.connector.connect(
                host='localhost',
                database='ledger_data',
                user='py_developer',
                password='MySql1234!',
            )

            if connection.is_connected():
                db_info = connection.get_server_info()
                print(f"CONNECTED TO SQL VERSION {db_info}")

                cursor = connection.cursor(dictionary=True)

                cursor.execute("select * from ledger_data")
                rows = cursor.fetchall()

                for row in rows:
                    print(row)

        except Error as e:
            print("FAILED TO CONNECT TO MYSQL")
            print(e)

        finally:
            if 'connection' in locals() and connection.is_connected():
                cursor.close()
                connection.close()
                print("DISCONNECTED FROM MYSQL")
