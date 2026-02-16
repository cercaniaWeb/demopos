import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#0b0c15] text-white">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
    );
}
