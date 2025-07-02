import { RefreshCw } from 'lucide-react';
import { Button } from './button';

interface RefreshButtonProps {
  onClick: () => void;
  refreshing: boolean;
  title?: string;
  className?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ 
  onClick, 
  refreshing, 
  title = "Refresh data",
  className = "h-10 w-10"
}) => {
  return (
    <Button 
      onClick={onClick}
      disabled={refreshing}
      variant="outline"
      size="icon"
      className={className}
      title={title}
    >
      <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
    </Button>
  );
};

export default RefreshButton; 