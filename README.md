# Settlement Support

An AI-powered settlement support application for tracking and explaining
payment transactions.

The project provides a simple web-based chat interface where users can
ask questions about payment transactions. A Python/FastAPI backend
receives the questions, communicates with a local Ollama model, and
returns the AI-generated response to the frontend.

## Features

-   4-digit demo PIN login
-   Settlement-support chatbot interface
-   Transaction ID and natural-language queries
-   FastAPI backend
-   Local AI inference using Ollama
-   MySQL transaction database integration
-   CORS-enabled frontend/backend communication
-   Previous chat interface
-   Past transactions section
-   Account switching/logout
-   Demo and informational sections

## Project Architecture

``` text
                    ┌──────────────────────┐
                    │      Web Browser     │
                    │   HTML / CSS / JS    │
                    └──────────┬───────────┘
                               │
                     HTTP :5500│
                               ▼
                    ┌──────────────────────┐
                    │   Python HTTP Server │
                    │   python -m http...  │
                    └──────────┬───────────┘
                               │
                               │ POST /api/submit
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │      Uvicorn :8000   │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ▼                           ▼
        ┌────────────────┐          ┌────────────────┐
        │    MySQL DB    │          │     Ollama     │
        │  Transactions  │          │  llama3.2:1b   │
        └────────────────┘          └────────────────┘
```

## Requirements

Install or have the following available:

-   Python 3.12+
-   MySQL Server
-   Ollama
-   A locally installed Ollama model
-   A modern web browser

The current backend is configured to use:

``` text
llama3.2:1b
```

## Project Structure

A typical project layout is:

``` text
OriginHackathon/
│
├── main.py
├── sql_connector.py
├── index.html
├── script.js
├── style.css
├── transactions_100.csv
├── .venv/
└── README.md
```

## 1. Clone / Open the Project

Open a terminal and navigate to the project directory:

``` bash
cd ~/OriginHackathon
```

If you are using a virtual environment:

``` bash
source .venv/bin/activate
```

If the virtual environment does not exist yet:

``` bash
python3 -m venv .venv
source .venv/bin/activate
```

## 2. Install Python Dependencies

Install the packages used by the backend:

``` bash
pip install fastapi uvicorn mysql-connector-python ollama pydantic
```

If the project has a `requirements.txt`, you can instead use:

``` bash
pip install -r requirements.txt
```

## 3. Configure MySQL

The backend uses MySQL through `SQLConnector`.

Make sure MySQL is running and that the database/user configured in
`sql_connector.py` exists.

The current connection configuration follows this structure:

``` python
mysql.connector.connect(
    host="localhost",
    database="payment_thing",
    user="py_developer",
    password="YOUR_PASSWORD",
)
```

Update these values if your local MySQL configuration is different.

### Importing the transaction CSV

The repository includes `transactions_100.csv`, containing 100 sample
transactions.

The columns are:

``` text
id
status
amount
reconciled_at
notes
```

Transaction IDs follow the format:

``` text
TXN12345
```

and `reconciled_at` contains a 24-hour time in `HHMM` format.

You can import the CSV into your MySQL transaction table using MySQL's
CSV import functionality or your preferred database client.

Make sure the target table's columns match the CSV structure.

## 4. Set Up Ollama

Make sure Ollama is installed and running.

Check that the model exists:

``` bash
ollama list
```

The project currently expects:

``` text
llama3.2:1b
```

If it is not installed:

``` bash
ollama pull llama3.2:1b
```

You can test the model directly:

``` bash
ollama run llama3.2:1b
```

Then enter a test message such as:

``` text
Hello
```

Exit Ollama with:

``` text
/bye
```

## 5. Start the Backend

Open a terminal and navigate to the project:

``` bash
cd ~/OriginHackathon
```

Activate the virtual environment:

``` bash
source .venv/bin/activate
```

Start the FastAPI/Uvicorn server:

``` bash
python main.py
```

The backend should start on:

``` text
http://127.0.0.1:8000
```

You should see output similar to:

``` text
Uvicorn running on http://127.0.0.1:8000
Application startup complete.
```

### Backend API

#### GET `/api/status`

Checks whether the backend is running.

Example:

``` bash
curl http://127.0.0.1:8000/api/status
```

Expected response:

``` json
{
  "message": "Connected successfully"
}
```

#### POST `/api/submit`

Sends a user message to the AI backend.

Request:

``` json
{
  "prompt": "What happened to TXN12345?"
}
```

Example using `curl`:

``` bash
curl -X POST http://127.0.0.1:8000/api/submit \
  -H "Content-Type: application/json" \
  -d '{"prompt":"What happened to TXN12345?"}'
```

Expected response format:

``` json
{
  "reply": "..."
}
```

## 6. Start the Frontend

The frontend should **not** be opened directly using `file://`.

Instead, start a local HTTP server.

Open a **second terminal**:

``` bash
cd ~/OriginHackathon
```

Then run:

``` bash
python3 -m http.server 5500
```

The frontend will be available at:

``` text
http://127.0.0.1:5500
```

or:

``` text
http://localhost:5500
```

Open that address in your browser.

### Why use `http.server`?

Opening `index.html` directly produces a `file://` origin. Browsers can
treat that as a `null` origin, which can cause the FastAPI CORS
middleware to reject requests.

Using:

``` bash
python3 -m http.server 5500
```

gives the frontend a normal HTTP origin, allowing it to communicate with
the FastAPI backend.

## 7. Running the Complete Application

You need two terminal sessions.

### Terminal 1 --- Backend

``` bash
cd ~/OriginHackathon
source .venv/bin/activate
python main.py
```

Keep this terminal running.

### Terminal 2 --- Frontend

``` bash
cd ~/OriginHackathon
python3 -m http.server 5500
```

Keep this terminal running as well.

Then open:

``` text
http://127.0.0.1:5500
```

in your browser.

The complete request flow is:

``` text
Browser
   │
   │ User enters question
   ▼
script.js
   │
   │ POST /api/submit
   ▼
FastAPI :8000
   │
   ├──► MySQL
   │
   └──► Ollama
           │
           │ llama3.2:1b
           ▼
        AI reply
   │
   ▼
FastAPI
   │
   │ JSON response
   ▼
script.js
   │
   ▼
Chat interface
```

## Demo Login PINs

The frontend includes demo accounts.

Current demo PINs:

``` text
1234 → Aisha
5678 → Rohan
6420 → Meera
```

Make sure the PIN values in `script.js` and the login hints in
`index.html` remain synchronized.

## CORS Configuration

The FastAPI application uses CORS middleware so that the frontend
running on port `5500` can communicate with the backend running on port
`8000`.

The development configuration allows:

``` text
http://localhost:5500
http://127.0.0.1:5500
```

If the frontend is served from another port, update the FastAPI CORS
configuration accordingly.

### MAKE SURE TO LOAD THE SAMPLE DATA INTO AN SQL TABLE CALLED 'payment_thing' into a table called 'ledger_data' BEFORE TRYING OUT THE PROGRAM

## Troubleshooting

### `OPTIONS /api/submit 400 Bad Request`

This usually indicates a CORS/preflight issue.

Check:

1.  The frontend is being served using `python3 -m http.server 5500`.
2.  You are opening `http://127.0.0.1:5500` or `http://localhost:5500`.
3.  The frontend origin is included in FastAPI's CORS configuration.

In the browser console:

``` javascript
location.origin
```

should return something like:

``` text
http://127.0.0.1:5500
```

It should not return:

``` text
null
```

### Frontend says it cannot connect to the settlement server

Check that the backend is running:

``` bash
python main.py
```

Then test:

``` bash
curl http://127.0.0.1:8000/api/status
```

If this fails, the backend is not reachable.

### Ollama errors

Check:

``` bash
ollama list
```

Make sure:

``` text
llama3.2:1b
```

is available.

You can also test:

``` bash
ollama run llama3.2:1b
```

### MySQL connection errors

Verify:

-   MySQL is running.
-   The database exists.
-   The configured username and password are correct.
-   The transaction table exists.
-   The MySQL user has permission to access the database.

## Development Notes

The frontend maintains chat state in JavaScript while the application is
running.

The current AI endpoint returns a simple response object:

``` json
{
  "reply": "AI response"
}
```

The intended future architecture can be expanded so that the backend:

1.  Receives the user's natural-language question.
2.  Identifies the relevant transaction.
3.  Queries MySQL for only the required transaction data.
4.  Determines the transaction/settlement state.
5.  Passes the relevant information to Ollama.
6.  Generates a concise explanation.
7.  Returns structured information to the frontend.

A future response could contain fields such as:

``` json
{
  "transaction_id": "TXN12345",
  "status": "pending",
  "confidence": "high",
  "explanation": "The transaction is awaiting bank settlement.",
  "next_step": "Wait for bank confirmation."
}
```

This would allow the frontend to display a richer settlement-tracing
interface rather than only displaying plain AI text.

## Technology Stack

### Frontend

-   HTML
-   CSS
-   JavaScript
-   Browser Fetch API
-   Python `http.server` for local development

### Backend

-   Python
-   FastAPI
-   Uvicorn
-   Pydantic
-   MySQL Connector/Python
-   Ollama

### AI

``` text
Ollama
└── llama3.2:1b
```

## Quick Start

For subsequent runs, assuming everything is already configured:

**Terminal 1:**

``` bash
cd ~/OriginHackathon
source .venv/bin/activate
python main.py
```

**Terminal 2:**

``` bash
cd ~/OriginHackathon
python3 -m http.server 5500
```

Then open:

``` text
http://127.0.0.1:5500
```

That's it --- the frontend runs on port `5500`, the FastAPI backend runs
on port `8000`, MySQL provides transaction data, and Ollama handles the
local AI response generation.
