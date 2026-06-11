# T2P Usage Guide

## How to Use the API Key Feature

### Step 1: Open the Application
- Navigate to **http://localhost:5174/** in your browser
- You should see the T2P (Tosca to Playwright) converter interface

### Step 2: Set Your API Key
1. Click the **"🔑 Set API Key"** button in the top-right corner
2. A drawer will slide in from the right side
3. Enter your Anthropic API key in the password field (it will be hidden)
4. Click **"Save API Key"** or press Enter
5. The drawer will close and the button will change to **"🔑 API Key Set"**

### Step 3: Upload and Convert
1. Upload a `.tsu` file by:
   - Clicking the upload zone and selecting a file, OR
   - Dragging and dropping a `.tsu` file into the upload zone
2. Click the **"Convert"** button
3. Wait for Claude to process your file
4. Download the generated Playwright project ZIP file

## Features

### API Key Management
- **Secure Input**: API key is entered as a password (hidden text)
- **Toggle Drawer**: Click the button again to open/close the API key drawer
- **Validation**: The app won't let you convert without setting an API key first
- **Flexible**: API key can be provided via the UI OR set as an environment variable on the backend

### File Upload
- **Drag & Drop**: Drag `.tsu` files directly into the upload zone
- **File Browser**: Click to browse and select files
- **Validation**: Only `.tsu` files are accepted

### Conversion Status
- Real-time status updates during conversion
- Clear error messages if something goes wrong
- Download link appears when conversion is complete

## Backend Compatibility

The backend now accepts API keys in two ways:
1. **From the frontend** (via the form field)
2. **From environment variable** (`ANTHROPIC_API_KEY`)

This means you can:
- Use the UI for personal/development use
- Set the environment variable for production deployments
- Mix both approaches (frontend key takes priority)

## Troubleshooting

### "Please set your API key first"
- Click the 🔑 button and enter your Anthropic API key
- Make sure you clicked "Save API Key"

### "API key is required"
- The API key wasn't sent to the backend
- Try re-entering and saving your API key

### Blank Screen
- Make sure you're accessing the correct URL: **http://localhost:5174/**
- Check browser console (F12) for errors
- Verify both frontend and backend are running

## Running the Application

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Access at: http://localhost:5174/

### Backend
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate  # Windows Git Bash
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Access at: http://127.0.0.1:8000
