import { useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import IssuePassForm from '../../components/passes/IssuePassForm';
import PassCard from '../../components/passes/PassCard';

const IssuePassPage = () => {
  const [issuedPass, setIssuedPass] = useState(null);

  return (
    <DashboardLayout title="Issue pass" subtitle="Generate a QR pass for a visitor.">
      <div className="grid grid-cols-2 gap-6 items-start">
        <div>
          <IssuePassForm onSuccess={setIssuedPass} />
        </div>

        <div>
          {issuedPass ? (
            <PassCard pass={issuedPass} />
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center">
              <p className="text-sm text-slate-400">The issued pass will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IssuePassPage;