from sql_connector import SQLConnector
import ollama

class App:

    db = SQLConnector()
    SYS_CONTEXT = f"""
                    You are an expert AI assistant that will help people track and resolve queries about their payment transactions, your job is to help users with their qualms based ONLY on these strict rules:
                     - Be concise, try to keep responses shorter than 3 sentences.
                     - If the user asks about something unrelated to their transactions, gently guide them back to the topic.
                     - Use a friendly encouraging tone.
                     - all transaction data is here: {db.table_data}
                  """

    def __init__(self):
        pass

    def main(self):
        while True:
            prompt = input("?")
            response = ollama.chat(
                model="llama3.2:1b",
                messages=[{
                    'role':'system',
                    'content':self.SYS_CONTEXT
                }, 
                {
                    'role':'user',
                    'content':prompt
                }]
            )
            print(response['message']['content'], "\n")
        


if __name__ == "__main__":
    yes = App()
    yes.main()