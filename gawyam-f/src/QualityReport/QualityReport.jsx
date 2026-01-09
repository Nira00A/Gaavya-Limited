import { Clipboard } from 'react-feather';

export const QualityReport = () => {
  return (
    <div className="min-h-[60vh] w-full flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8">
        
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
            <Clipboard className="w-10 h-10 text-green-600" />
        </div>

        <h3 className="text-xl font-bold text-gray-700 mb-2">Report Pending</h3>
        <p className="text-gray-400 font-medium text-center max-w-xs leading-relaxed">
            The quality assurance report for this batch is yet to be submitted by the lab.
        </p>
        
    </div>
  );
};