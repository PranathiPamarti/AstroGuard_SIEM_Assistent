import { SecurityEvent } from '../../utils/syntheticData';
import { ReportGenerator } from '../ReportGenerator';
import { FileText } from 'lucide-react';

interface ReportsViewProps {
  allEvents: SecurityEvent[];
}

export function ReportsView({ allEvents }: ReportsViewProps) {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-orange-600" />
          <h1>Security Reports</h1>
        </div>
        <p className="text-muted-foreground">
          Generate comprehensive security reports with textual summaries, tabular data, and graphical visualizations
        </p>
      </div>

      {/* Report Generator */}
      <ReportGenerator events={allEvents} />
    </div>
  );
}
