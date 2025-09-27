
import React, { useRef, useEffect, useState } from 'react';
import Button from '../ui/Button';

interface SignaturePadProps {
    onSave: (signatureDataUrl: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;
        ctx.strokeStyle = '#1A2A3A';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
    }, []);

    const getCoords = (event: MouseEvent | TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        if (event instanceof MouseEvent) {
            return { x: event.clientX - rect.left, y: event.clientY - rect.top };
        }
        if (event.touches && event.touches.length > 0) {
            return { x: event.touches[0].clientX - rect.left, y: event.touches[0].clientY - rect.top };
        }
        return { x: 0, y: 0 };
    };

    const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        setIsDrawing(true);
        const { x, y } = getCoords(event.nativeEvent);
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;
        
        const { x, y } = getCoords(event.nativeEvent);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        setIsDrawing(false);
        ctx.closePath();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }
    };
    
    const handleSave = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            onSave(dataUrl);
        }
    };

    return (
        <div className="w-full">
            <canvas
                ref={canvasRef}
                className="w-full h-48 border border-gray-300 rounded-md bg-white cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
            />
            <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-gray-500">Draw your signature above</p>
                <div className="space-x-2">
                    <Button variant="outline" onClick={clearCanvas}>Clear</Button>
                    <Button variant="secondary" onClick={handleSave}>Save Signature</Button>
                </div>
            </div>
        </div>
    );
};

export default SignaturePad;
