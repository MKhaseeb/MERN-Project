import React, { useEffect, useRef } from 'react';

const DataqueueWidget = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Load the script dynamically if not already loaded
        const scriptId = 'dq-voice-script';

        if (!document.getElementById(scriptId)) {
            const script = document.createElement('script');
            script.src = 'https://voicehub.dataqueue.ai/DqVoiceWidget.js';
            script.id = scriptId;
            script.async = true;
            script.onload = () => {
                renderWidget();
            };
            document.body.appendChild(script);
        } else {
            renderWidget();
        }

        function renderWidget() {
            if (containerRef.current && !containerRef.current.hasChildNodes()) {
                const dqVoice = document.createElement('dq-voice');
                dqVoice.setAttribute('agent-id', '68863fa33495fd66c043d6ce');
                dqVoice.setAttribute('env', 'https://voicehub.dataqueue.ai/');
                dqVoice.setAttribute('api-key', 'dqKey_01500d51f65553a33789dc4a551c38caa2b6b9a42c068b1d04045258cf613c06i2iz21mmpw');
                containerRef.current.appendChild(dqVoice);
            }
        }
    }, []);

    return (
        <div ref={containerRef} />
    );
};

export default DataqueueWidget;
