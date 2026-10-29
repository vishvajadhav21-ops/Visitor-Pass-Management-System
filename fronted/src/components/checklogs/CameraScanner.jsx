import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const REGION_ID = 'qr-camera-region';

const CameraScanner = ({ onScan, onClose }) => {
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(true);

  const onScanRef = useRef(onScan);
  const handledRef = useRef(false);
  const queueRef = useRef(Promise.resolve());

  // Always call the latest onScan (so it sees the current action/location)
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    let cancelled = false;
    const scanner = new Html5Qrcode(REGION_ID);

    // Start/stop are queued one after another. This avoids camera errors
    // when React (in dev mode) mounts and unmounts the component quickly.
    queueRef.current = queueRef.current.then(async () => {
      if (cancelled) return;
      try {
        await scanner.start(
          { facingMode: 'environment' }, // back camera on phones, webcam on laptops
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            if (handledRef.current) return; // only react to the first successful read
            handledRef.current = true;
            onScanRef.current(decodedText);
          },
          () => {} // ignore "no QR found in this frame" messages
        );
        if (!cancelled) setStarting(false);
      } catch (err) {
        if (!cancelled) {
          setStarting(false);
          setError(
            'Could not access the camera. Allow camera permission in your browser, or use manual entry below.'
          );
        }
      }
    });

    return () => {
      cancelled = true;
      queueRef.current = queueRef.current.then(async () => {
        try {
          if (scanner.isScanning) await scanner.stop();
          scanner.clear();
        } catch {
          // camera was already stopped
        }
      });
    };
  }, []);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-slate-800">
          Point the camera at the visitor's QR code
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-slate-500 hover:text-red-500 transition"
        >
          Close camera
        </button>
      </div>

      <div id={REGION_ID} className="w-full max-w-sm mx-auto overflow-hidden rounded-lg bg-black" />

      {starting && !error && (
        <p className="text-xs text-slate-400 text-center mt-3">Starting camera...</p>
      )}
      {error && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default CameraScanner;