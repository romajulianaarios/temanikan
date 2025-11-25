import { Dialog, DialogContent, DialogTitle, DialogDescription } from './dialog';
import { Button } from './button';
import { CheckCircle, XCircle, AlertCircle, Info } from '../icons';

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
}

export default function NotificationModal({
    isOpen,
    onClose,
    type,
    title,
    message
}: NotificationModalProps) {
    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'error':
                return <XCircle className="w-12 h-12 text-red-500" />;
            case 'warning':
                return <AlertCircle className="w-12 h-12 text-amber-500" />;
            case 'info':
                return <Info className="w-12 h-12 text-blue-500" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50';
            case 'error':
                return 'bg-red-50';
            case 'warning':
                return 'bg-amber-50';
            case 'info':
                return 'bg-blue-50';
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <div className={`flex flex-col items-center text-center p-6 rounded-lg ${getBackgroundColor()}`}>
                    <div className="mb-4">
                        {getIcon()}
                    </div>
                    <DialogTitle className="text-xl font-semibold mb-2" style={{ color: '#133E87' }}>
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 mb-6">
                        {message}
                    </DialogDescription>
                    <Button
                        onClick={onClose}
                        className="w-full text-white"
                        style={{ backgroundColor: '#133E87' }}
                    >
                        OK
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
