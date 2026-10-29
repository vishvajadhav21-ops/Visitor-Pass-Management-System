import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import QRScanner from '../../components/checklogs/QRScanner';
import CheckLogTable from '../../components/checklogs/CheckLogTable';
import { getAllCheckLogs } from '../../api/checklogApi';

const ScanPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await getAllCheckLogs();
      setLogs(res.data.logs.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <DashboardLayout title="Check-in scan" subtitle="Scan or enter a QR token to check visitors in and out.">
      <div className="mb-6">
        <QRScanner onScanSuccess={fetchLogs} />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <p className="text-base font-semibold text-slate-900 p-5 pb-0">Recent activity</p>
        <div className="p-5 pt-4">
          <CheckLogTable logs={logs} loading={loading} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ScanPage;