import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';

const EPIC_URL = 'https://www.getepic.com';

function EpicExtractor() {
  const iframeRef = useRef(null);
  const [images, setImages] = useState([]);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState(null);

  const handleCapture = () => {
    if (!iframeRef.current) return;

    setError(null);
    setCapturing(true);

    const iframeBody = iframeRef.current.contentWindow.document.body;
    html2canvas(iframeBody, {
      allowTaint: true,
      useCORS: true,
      logging: true,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      setImages(prevImages => [...prevImages, imgData]);
      setCapturing(false);
    }).catch(err => {
      console.error("Failed to capture iframe content:", err);
      setError("Could not capture the content of the iframe. This is likely due to the browser's cross-origin security policy. The website 'getepic.com' does not allow its content to be screenshotted by other websites.");
      setCapturing(false);
    });
  };

  const handleGeneratePdf = () => {
    if (images.length === 0) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    images.forEach((imgData, index) => {
      if (index > 0) {
        pdf.addPage();
      }
      // You might need to adjust the image dimensions to fit the PDF page
      pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
    });

    pdf.save('book.pdf');
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Get Epic Book Extractor
      </Typography>
      <Typography variant="body1" gutterBottom>
        Navigate to the book you want to extract in the iframe below. Use the "Capture Page" button to take a screenshot of the current page. Once you have captured all the pages, click "Generate PDF" to create a downloadable PDF of the book.
      </Typography>
      <Alert severity="warning" sx={{ marginY: 2 }}>
        <strong>Note:</strong> This tool may not work as expected due to browser security restrictions (CORS policy) on `getepic.com`. If you see a blank or incomplete capture, this is the likely cause.
      </Alert>
      {error && <Alert severity="error" sx={{ marginY: 2 }}>{error}</Alert>}
      <Stack direction="row" spacing={2} sx={{ marginY: 2 }}>
        <Button variant="contained" onClick={handleCapture} disabled={capturing}>
          {capturing ? 'Capturing...' : 'Capture Page'}
        </Button>
        <Button variant="contained" color="secondary" onClick={handleGeneratePdf} disabled={images.length === 0}>
          Generate PDF ({images.length} pages)
        </Button>
      </Stack>
      <iframe
        ref={iframeRef}
        src={EPIC_URL}
        style={{ width: '100%', height: '70vh', border: '1px solid #ccc' }}
        title="Get Epic"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>
    </Box>
  );
}

export default EpicExtractor;
