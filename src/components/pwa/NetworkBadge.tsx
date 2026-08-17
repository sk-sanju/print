import React from 'react';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';
import { Badge } from '../ui/Badge';

export const NetworkBadge: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  return (
    <Badge variant={isOnline ? 'emerald' : 'amber'} size="sm" className="gap-1.5 shadow-xs border">
      <span
        className={`w-2 h-2 rounded-full inline-block ${
          isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
        }`}
      />
      <span>{isOnline ? 'Online' : 'Offline'}</span>
    </Badge>
  );
};
