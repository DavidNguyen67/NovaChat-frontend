/* eslint-disable prettier/prettier */
import { Icon } from '@iconify/react';

interface FallBackProps {
  type: 'empty' | 'error';
}

const FallBack = ({ type }: FallBackProps) => {
  if (type === 'error')
    return (
      <div className="flex flex-col items-center justify-center h-full text-default-500 gap-2">
        <Icon
          className="text-3xl text-danger"
          icon="mdi:alert-circle-outline"
        />
        <p className="text-sm font-medium">Failed to load data.</p>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-full text-default-500 gap-2">
      <Icon className="text-4xl text-default-400" icon="mdi:chat-outline" />
      <p className="text-sm font-medium">No data yet</p>
    </div>
  );
};

export default FallBack;
