
const statusStyles = {
  active: 'bg-green-100 text-green-700',
  used: 'bg-slate-100 text-slate-600',
  expired: 'bg-red-100 text-red-700',
  revoked: 'bg-red-100 text-red-700',
};

const PassCard = ({ pass }) => {
  if (!pass) return null;

  return (
    <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mx-auto">

      <div className="bg-blue-300 from-blue-500 to-blue-600 p-6 text-center">
        <p className="text-white/80 text-xs font-medium mb-1">VISITOR PASS</p>
        <p className="text-white text-xl font-bold">{pass.visitor?.name}</p>
      </div>

      <div className="p-6">
        <div className="flex justify-center mb-5">
          <img
            src={pass.qrCodeUrl}
            alt="QR Code"
            className="w-48 h-48 border border-slate-200 rounded-lg"
          />
        </div>

        <div className="flex justify-center mb-5">
          <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusStyles[pass.status]}`}>
            {pass.status}
          </span>
        </div>

        <div className="space-y-2 text-sm mb-5">
          <div className="flex justify-between">
            <span className="text-slate-500">Phone</span>
            <span className="text-slate-800 font-medium">{pass.visitor?.phone}</span>
          </div>
          {pass.visitor?.company && (
            <div className="flex justify-between">
              <span className="text-slate-500">Company</span>
              <span className="text-slate-800 font-medium">{pass.visitor.company}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Valid from</span>
            <span className="text-slate-800 font-medium">{new Date(pass.validFrom).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Valid to</span>
            <span className="text-slate-800 font-medium">{new Date(pass.validTo).toLocaleString()}</span>
          </div>
        </div>

        {pass.pdfUrl && (
          <a
            href={pass.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition"
          >
            Download PDF pass
          </a>
        )}
      </div>
    </div>
  );
};

export default PassCard;