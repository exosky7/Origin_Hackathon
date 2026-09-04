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

                #for row in rows:
                #    print(row)

                self.cursor.close()

        except Error as e:
            print("FAILED TO CONNECT TO MYSQL")
    
    def quit(self):
        if 'connection' in locals() and self.connection.is_connected():
            self.cursor.close()
            self.connection.close()

            print("DISCONNECTED FROM MYSQL")

    def addRow(self, id:str, status:str, amount:int, recon_time:str, notes:str):
        self.cursor = self.connection.cursor(dictionary=True)
        query = """
                INSERT INTO ledger_data
                (id, status, amount, reconciled_at, notes)
                VALUES (%s, %s, %s, %s, %s)
                """

        values = (id, status, amount, recon_time, notes)

        self.cursor.execute(query, values)
        self.connection.commit()
        self.cursor.close()
        

    def delRow(self, ID:str):
        self.cursor = self.connection.cursor(dictionary=True)
        self.cursor.execute("delete from ledger_data where id = %s", (ID,))
        self.connection.commit()
        self.cursor.close()

    def printTable(self):
        self.cursor = self.connection.cursor(dictionary=True)
        self.cursor.execute("select * from ledger_data")
        rows = self.cursor.fetchall()

        print("---------------------------------------------------------------------")
        for row in rows:
            print(row)
        print("---------------------------------------------------------------------")
        self.cursor.close()

