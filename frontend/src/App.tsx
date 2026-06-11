import { useEffect, useMemo, useState } from 'react';

type ConvertState = 'idle' | 'uploading' | 'ready' | 'error';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadName, setDownloadName] = useState('');
  const [status, setStatus] = useState<ConvertState>('idle');
  const [message, setMessage] = useState('Upload a .tsu file to generate a structured Playwright project bundle.');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');

  useEffect(() => {
    return () => {
      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }
    };
  }, [downloadUrl]);

  const canConvert = useMemo(() => Boolean(selectedFile && savedApiKey), [selectedFile, savedApiKey]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      window.alert('Please enter a valid API key');
      return;
    }
    setSavedApiKey(apiKey.trim());
    setIsDrawerOpen(false);
    setMessage('API key saved. Upload a .tsu file to continue.');
  };

  const showUploadError = () => {
    window.alert('Tosca file upload pannu da venna...');
  };

  const isValidTsuFile = (file: File | null) => Boolean(file && file.name.toLowerCase().endsWith('.tsu'));

  const setUploadedFile = (file: File | null) => {
    setSelectedFile(file);
    setStatus('idle');
    setMessage(file ? `${file.name} is ready to convert.` : 'Upload a .tsu file to generate a structured Playwright project bundle.');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!isValidTsuFile(file)) {
      showUploadError();
      event.target.value = '';
      setUploadedFile(null);
      return;
    }

    setUploadedFile(file);
  };

  const handleDropZoneDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDropZoneDragLeave = () => {
    setIsDragging(false);
  };

  const handleDropZoneDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0] ?? null;
    if (isValidTsuFile(file)) {
      setUploadedFile(file);
      return;
    }

    showUploadError();
    setStatus('error');
    setMessage('Drop a .tsu file to continue.');
  };

  const handleConvert = async () => {
    if (!selectedFile) {
      setStatus('error');
      setMessage('Choose a .tsu file first.');
      return;
    }

    if (!savedApiKey) {
      setStatus('error');
      setMessage('Please set your API key first.');
      setIsDrawerOpen(true);
      return;
    }

    setStatus('uploading');
    setMessage('Converting with Claude...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('api_key', savedApiKey);

      const response = await fetch(`${API_BASE_URL}/convert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail ?? 'Conversion failed');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition') ?? '';
      const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
      const filename = match?.[1] ?? `${selectedFile.name.replace(/\.tsu$/i, '')}-playwright.zip`;

      if (downloadUrl) {
        URL.revokeObjectURL(downloadUrl);
      }

      const objectUrl = URL.createObjectURL(blob);
      setDownloadUrl(objectUrl);
      setDownloadName(filename);
      setStatus('ready');
      setMessage('Conversion complete. Download the zip below.');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong.');
    }
  };

  return (
    <div className="app-shell">
      <button className="api-button" type="button" onClick={toggleDrawer}>
        {savedApiKey ? '🔑 API Key Set' : '🔑 Set API Key'}
      </button>

      <div className={`drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>API Key</h2>
          <button className="icon-button" type="button" onClick={toggleDrawer}>
            ✕
          </button>
        </div>
        <p className="drawer-copy">
          Enter your Anthropic API key to enable conversion. The key will be sent securely to the backend.
        </p>
        <div className="field">
          <label htmlFor="api-key-input">
            <strong>API Key</strong>
          </label>
          <input
            id="api-key-input"
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveApiKey();
              }
            }}
          />
        </div>
        <button className="secondary-button" type="button" onClick={handleSaveApiKey}>
          Save API Key
        </button>
      </div>

      <main className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Tosca 2 Playwright</p>
          <p className="lead centered-message">{message}</p>
        </div>

        <div className="content-grid">
          <section className="panel upload-panel">
            <div className="panel-header">
              <h2>Upload</h2>
              <span className={`status-pill ${status}`}>{status === 'idle' ? 'Ready' : status}</span>
            </div>

            <label
              className={`upload-zone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDropZoneDragOver}
              onDragLeave={handleDropZoneDragLeave}
              onDrop={handleDropZoneDrop}
            >
              <input type="file" accept=".tsu" onChange={handleFileChange} />
              <strong>Choose a .tsu file</strong>
              <span>Drop a .tsu file here or click to browse</span>
            </label>

            {selectedFile ? (
              <div className="file-row">
                <div>
                  <p className="file-label">Selected file</p>
                  <p className="file-name">{selectedFile.name}</p>
                </div>
                <p className="file-meta">{Math.max(1, Math.round(selectedFile.size / 1024))} KB</p>
              </div>
            ) : null}

            <button className="primary-button" type="button" onClick={handleConvert} disabled={!canConvert || status === 'uploading'}>
              {status === 'uploading' ? 'Converting...' : 'Convert'}
            </button>
          </section>

          <section className="panel result-panel">
            <div className="panel-header">
              <h2>Converted file</h2>
              <span className="status-pill neutral">Download</span>
            </div>

            <div className="result-box">
              {downloadUrl ? (
                <>
                  <p className="result-title">{downloadName}</p>
                  <p className="result-copy">Your zip is ready. It contains page objects, test data, Playwright config, and a README.</p>
                  <a className="primary-button download-link" href={downloadUrl} download={downloadName}>
                    Download zip
                  </a>
                </>
              ) : (
                <p className="empty-state">The converted project bundle will appear here after Claude finishes the extraction.</p>
              )}
            </div>
          </section>
        </div>

      </main>
    </div>
  );
}
