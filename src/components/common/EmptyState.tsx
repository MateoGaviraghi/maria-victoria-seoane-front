import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      {icon && <div className="text-muted-foreground mb-4">{icon}</div>}
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-4 max-w-sm text-sm">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
};

export default EmptyState;
