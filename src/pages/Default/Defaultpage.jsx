import { MessageCircle } from 'lucide-react';
import React from 'react';

const Defaultpage = () => {
    return (
        <div className="flex flex-col items-center justify-center text-white p-10 ">

            {/* Icon Box */}
            <div className="bg-[#1A3A4E] w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={40} />
            </div>

            {/* Text */}
            <p className="text-lg font-semibold mb-1">Select a conversation</p>
            <p className="text-sm text-gray-300">Choose a contact from the sidebar to start chatting or</p>
            <p className="text-sm text-gray-300">continue a previous conversation.</p>

        </div>
    );
};

export default Defaultpage;
