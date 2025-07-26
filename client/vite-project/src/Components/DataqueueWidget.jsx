import React, { useEffect, useRef } from 'react';

export const DataqueueWidget = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            // Inject the custom element
            const dqVoice = document.createElement('dq-voice');
            dqVoice.setAttribute('agent-id', '688371b17c8cb56d6b1eacff');
            dqVoice.setAttribute('env', 'https://voicehub.dataqueue.ai/');
            dqVoice.setAttribute('api-key', 'dqKey_fc814cc7f6e548b456b9b142ceee800b60e0ba4e3e9ecdf794b625a82c79d0eemtnkd75nn2');
            containerRef.current.appendChild(dqVoice);

            // Inject the script if not already loaded
            const scriptId = 'dq-voice-script';
            if (!document.getElementById(scriptId)) {
                const script = document.createElement('script');
                script.src = 'https://voicehub.dataqueue.ai/DqVoiceWidget.js';
                script.id = scriptId;
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }, []);

    return <div ref={containerRef}></div>;
};
