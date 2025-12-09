# Project Title & Summary
Invoice Digitizer with Double Billing Prevention and Vendor Normalization

# Tech Stack/Tools

Phase 1: n8n Workflow
- Used local npm n8n

Phase 2: Backend
- Languages: Node.js, Express
- Database: Local db.json file
- Libraries/Tools: Express Generator, Nodemon (hot reload), Cors, string-similarity, Crypto

Phase 3: Frontend
- Languages: TypeScript, JavaScript, HTML, CSS
- Libraries/Tools: vite

# Architecture Overview
Frontend React project inside of /client folder. Backend Express REST API project inside /server. n8n workflow in the root of the project.

# Setup and Installation

## Installation and Running Node Services
1. Clone the repository
2. Install dependencies:
    - Run "npm install" inside of the /client folder
    - Run "npm install" inside of the /server folder
3. Configure environment variables
4. Start services
    - Run "npm run build" then "npm run preview" inside of the /client folder or alternatively "npm run dev" for development environment
    - Run "npm start" inside of /server folder
5. Optionally: environment variables for ports can be changed.
    - Inside of client folder .env, "VITE_PORT=????" for React, "VITE_EXPRESS_PORT=????" for Express Server otherwise the default port for client is 5173.
    - Inside of server folder .env, "EXPRESS_PORT=????" otherwise the default port for server is 3000.
    - NOTE: If server EXPRESS_PORT is changed, then client EXPRESS_PORT must be changed.

## Installation and Running n8n
1. "npm install -g n8n"
2. Run "n8n"
3. Create account
4. Import workflow
5. Go to https://ocr.space/ and get an API key
6. Open OCR Request Nodes
7. Create new credential under Header Auth
8. Name = "apikey" Value = "API key from OCR Space"
9. If Express.js backend runs on a different port then 3000, go to Express Backend Node and change url port to desired port.
10. n8n Runs on PORT 5678 if changed inside of client folder .env, VITE_N8N_PORT must also be changed.

Now everything should be setup.

# How to Use / API

| Method | Endpoint          | Description                         |
| ------ | ----------------- | ----------------------------------- |
| GET    | `/api/invoices`   | Retrieve all stored invoices        |
| POST   | `/api/invoices`   | Add a new invoice                   |
| GET    | `/api/csv-export` | Download all invoices as a CSV file |

Example Calls:

GET /api/invoices
curl http://localhost:3000/api/invoices

POST /api/invoices
curl -X POST http://localhost:3000/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
        "date": "2025-12-07",
        "vendor": "Home Depot",
        "total": 450,
        "status": "Unpaid"
      }'

GET /api/csv-export
curl http://localhost:3000/api/csv-export --output invoices.csv

# Assumptions Made
1. For vendor normalization, I only considered 4 vendors that are common in Canada inside the top of the compareVendorName.js file.

vendorList = {
  rona: "RONA",
  home_depot: "Home Depot",
  lowes: "Lowes",
  home_hardware: "Home Hardware",
};

2. I am making the assumption that OCR.space return and parsing is very dependent on the vendor therefore I developed specifically for the dirty data provided. I make the assumption that the first set of text is the vendor name, I then search for date according to typical date formats, and I search for the following text for Total. I tested against the dirty data provided which can be pinned into the OCR Request node for testing in the following format.

[
  {
    "ParsedResults": [
      {
        "ParsedText": "HOME DEP0T -- DATE: 2024/05/12 -- TOTAL: $ 450.00 -- THANK YOU"
      }
    ]
  }
]

3. Disabled CORS as it is a prototype.

4. Security was not taken into account as it is a functional local prototype aside from hiding the OCR.space API key.

5. Default status is "Unpaid".

# Trade-off / Design Decisions

1. I used synchronous file writes to db.json because this is a prototype with minimal traffic. Writing to a json requires rewriting the full file as well. This approach makes the code simpler but should not be used for production.

2. As building a general parser for OCR raw text can be very dependent on the photo, pdf, specific invoice etc. I decided to develop according to the provided dirty data. In practice, if we know what the format of x% of invoices are, we can parse the data quite easily. You could also add in a fallback node that uses an LLM model to parse the data for the remaining %. I also tested the OCR raw text with a invoice I found online, and the returned raw text was very different from the provided dirty data. Parsing one was not like the other so I  parsed for the provided data. This meant that my n8n workflow may not work for a typical invoice image, but does work for the provided dirty data.

3. I provide file upload as well as url upload for invoices. Adding both is trivial and OCR.space can handle both, therefore it made sense to include both in the development.

4. For speed and simplicity, I used inline styles instead of extracting CSS for the frontend React application.

5. For the backend, I chose to implement it in JavaScript rather than TypeScript to keep the setup lightweight and reduce configuration. I also chose to use CommonJS because it offers compatability accross many different Node environments without configuration. For a production system, especially one using TypeScript, I would use the ES Modules for a more modern standard.

# Improvements
- Security: Use OAuth2 (ex. Microsoft), issue bearer tokens for authorization of Express.js endpoints
- Store Original Pictures/URL Storage
- AI Backup for OCR if OCR is not able to get information required. Might also require human intervention for edge cases.
- Create unit and integration tests
- Performance Considerations: caching common calls such as get all invoices for frontend view.
- Frontend Feedback to show loading or upload complete etc.
- Containerize frontend and backend