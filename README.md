<<<<<< HEAD
# TSU to Playwright Converter

A small full-stack app that lets a user upload a `.tsu` file, send it to a backend powered by Claude, and download a zip containing a structured Playwright project bundle.

## Structure

- `frontend/` - React UI for uploading files and downloading results
- `backend/` - FastAPI service that accepts the upload and returns a structured zip archive

## Backend

1. Create and activate a Python virtual environment.
2. Install dependencies from `backend/requirements.txt`.
3. Set `ANTHROPIC_API_KEY` in the backend environment.
4. Run the FastAPI app with `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000` from the `backend/` directory.

## Frontend

1. Install dependencies in `frontend/`.
2. Set `VITE_API_BASE_URL` to the backend URL if it is not running on `http://127.0.0.1:8000`.
3. Start the app with the Vite dev server.

## Hosting

For production, keep the Claude key only on the backend host.

Backend environment variables:
- `ANTHROPIC_API_KEY` - required
- `ANTHROPIC_MODEL` - optional
- `CORS_ORIGINS` - comma-separated frontend origin list

Frontend environment variables:
- `VITE_API_BASE_URL` - backend public URL

The frontend no longer collects an API key from the browser. It only uploads the `.tsu` file and calls the backend.

## Notes

The current converter is Tosca-aware in the sense that it asks Claude to separate page objects, data, config, and tests into different files instead of returning one flat spec.
