import mysql.connector
from mysql.connector import Error


class SQLConnector:

    def __init__(self):
        try:
            self.connection = mysql.connector.connect(
                host='localhost',
                database='payment_thing',
                user='py_developer',
                password='MySql1234!',
            )

            if self.connection.is_connected():
                db_info = self.connection.get_server_info()
                print(f"CONNECTED TO SQL VERSION {db_info}")

                self.cursor = self.connection.cursor(dictionary=True)

                self.cursor.execute("select * from ledger_data")
                rows = self.cursor.fetchall()

                for row in rows:
                    print(row)

        except Error as e:
            print("FAILED TO CONNECT TO MYSQL")
    
    def quit(self):
        if 'connection' in locals() and self.connection.is_connected():
            self.cursor.close()
            self.connection.close()

            print("DISCONNECTED FROM MYSQL")

    def addRow(self, id:str, status:str, amount:int, recon_time:str, notes:str):


