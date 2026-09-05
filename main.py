from sql_connector import SQLConnector
import ollama
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

class UserMessage(BaseModel):
    prompt: str

class App:

    def __init__(self):

        self.db = SQLConnector()
        self.front_comms = FastAPI()
    
        self.origins = ['http://localhost:5500', 'http://127.0.0.1:5500']
        self.SYS_CONTEXT = f"""
                        You are an expert AI assistant that will help people track and resolve queries about their payment transactions, your job is to help users with their qualms based ONLY on these strict rules:
                            - Be concise, try to keep responses shorter than 3 sentences.
                            - If the user asks about something unrelated to their transactions, gently guide them back to the topic.
                            - Use a friendly encouraging tone.
                            - all transaction data is here: {self.db.table_data}
                            - you are in india and the currency here is INR
                            - if the user asks you for a refund or asks you for anything outside your ability please ask them to contact their bank and speak to a customer service agent, politely of course
                            - you are confined only and only to what you can do, do not ask the user if he wants to do something that you cannot do
                        """
        self.front_comms.add_middleware(CORSMiddleware, allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?", allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
        self._setup_routes_js()

    def _setup_routes_js(self):
        @self.front_comms.get("/api/status")
        def get_status():
            return {"message":"Connected succesfully"}

        @self.front_comms.post("/api/submit", response_model=None)
        def save_submitted_data(payload: UserMessage):
            response = ollama.chat(
                model="llama3.2:1b",
                messages=[{
                            'role':'system',
                            'content':self.SYS_CONTEXT
                        }, 
                        {
                            'role':'user',
                            'content':payload.prompt
                        }
                    ]
                )

            ai_reply = response['message']['content']
            return {"reply": ai_reply}


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
        

yes = App()
app = yes.front_comms

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)