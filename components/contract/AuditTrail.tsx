
import React from 'react';
import { AuditLog } from '../../types';
import { formatDate } from '../../utils';
import CheckCircleIcon from '../icons/CheckCircleIcon';

interface AuditTrailProps {
  logs: AuditLog[];
  onViewTransaction: (log: AuditLog) => void;
}

const AuditTrail: React.FC<AuditTrailProps> = ({ logs, onViewTransaction }) => {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {logs.map((log, logIdx) => (
          <li key={log.id}>
            <div className="relative pb-8">
              {logIdx !== logs.length - 1 ? (
                <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center ring-8 ring-white">
                    <CheckCircleIcon className="h-5 w-5 text-white" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      {log.action} by <span className="font-medium text-gray-900">{log.userEmail}</span>
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{formatDate(log.timestamp)}</p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    {log.hederaTransactionId !== 'N/A' && (
                        <button onClick={() => onViewTransaction(log)} className="text-sm font-medium text-secondary hover:text-green-700">
                        View Transaction
                        </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuditTrail;
