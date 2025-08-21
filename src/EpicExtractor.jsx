import React, { useRef } from 'react';
import html2canvas from 'html2canvas';

const EpicExtractor = () => {
  const iframeRef = useRef(null);

  const captureScreenshot = async () => {
    if (!iframeRef.current) return;

    try {
      const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      const canvas = await html2canvas(iframeDocument.body, {
        useCORS: true,
        logging: true
      });

      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'screenshot.png';
      link.click();
    } catch (error) {
      console.error('Errore cattura screenshot:', error);
    }
  };

  return (
    <div>
      <iframe
        ref={iframeRef}
        src="/api/epic-proxy/"
        width="100%"
        height="600px"
        style={{ border: '1px solid #ccc' }}
        sandbox="allow-scripts allow-forms allow-popups allow-modals allow-pointer-lock"
        title="Epic Books"
      />
      <button onClick={captureScreenshot}>📸 Cattura Screenshot</button>
    </div>
  );
};

export default EpicExtractor;
