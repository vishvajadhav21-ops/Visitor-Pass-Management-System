import { useState } from 'react';
import { scanPass } from '../../api/checklogApi';
import CameraScanner from './CameraScanner';

const QRScanner = ({ onScanSuccess }) => {
  const [qrToken, setQrToken] = useState('');
  const [location, setLocation] = useState('Main Gate');
  const [action, setAction] = useState('in');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const submitScan = async (token) => {
    setError('');
    setResult(null);

    const cleanToken = token.trim();
    if (!cleanToken) {
      setError('Please scan a QR code or enter a token');
      return;
    }

    setSubmitting(true);
    try {
      const res = await scanPass({ qrToken: cleanToken, action, location });
      setResult(res.data);
      setQrToken('');
      onScanSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Scan failed — invalid or expired pass');
    } finally {
      setSubmitting(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    submitScan(qrToken);
  };

  const handleCameraScan = (decodedText) => {
    setCameraOn(false); // close the camera right after a successful read
    // If the QR ever holds a link like .../pass/<token>, keep only the token part
    const token = decodedText.trim().split('/').pop();
    setQrToken(token);
    submitScan(token);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <p className="text-base font-semibold text-slate-900 mb-1">Check-in scan</p>
      <p className="text-sm text-slate-500 mb-4">
        Choose Check In or Check Out first, then scan the visitor's QR code.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Action</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setAction('in')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                action === 'in' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Check In
            </button>
            <button
              type="button"
              onClick={() => setAction('out')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                action === 'out' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              Check Out
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm text-slate-600 mb-1.5">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {cameraOn ? (
        <div className="mb-4">
          <CameraScanner onScan={handleCameraScan} onClose={() => setCameraOn(false)} />
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setResult(null); setError(''); setCameraOn(true); }}
          disabled={submitting}
          className="w-full mb-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition disabled:opacity-60"
        >
          {submitting ? 'Checking pass...' : 'Scan with camera'}
        </button>
      )}

      <form onSubmit={handleManualSubmit} className="flex gap-2">
        <input
          type="text"
          value={qrToken}
          onChange={(e) => setQrToken(e.target.value)}
          placeholder="Or paste the QR token manually"
          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition disabled:opacity-60"
        >
          Submit
        </button>
      </form>

      {error && (
        <div className="mt-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 px-4 py-4 rounded-lg bg-green-50 border border-green-200 flex items-center gap-3">
          {result.visitor?.photoUrl ? (
            <img src={result.visitor.photoUrl} alt={result.visitor.name} className="w-14 h-14 rounded-full object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold">
              {result.visitor?.name?.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-green-800">{result.message}</p>
            <p className="text-sm text-green-700">{result.visitor?.name} — {result.visitor?.phone}</p>
            <p className="text-xs text-green-600">Verify this matches the person in front of you.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;