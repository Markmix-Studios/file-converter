async function convertFile() {
  const fileName = document.getElementById('fileName').value;
  const fileContent = document.getElementById('fileContent').value;
  const format = document.getElementById('format').value;

  if (!fileName || !fileContent) {
    alert("Please fill in all fields!");
    return;
  }

  const convertedFileName = `${fileName}.${format}`;
  let blob;

  if (['txt', 'html', 'css', 'js', 'py', 'json'].includes(format)) {
    // Plain text-based formats
    const mimeType = {
      txt: 'text/plain',
      html: 'text/html',
      css: 'text/css',
      js: 'application/javascript',
      py: 'text/x-python',
      json: 'application/json',
    }[format];
    blob = new Blob([fileContent], { type: mimeType });

  } else if (format === 'docx') {
    // DOCX file using JSZip
    const zip = new JSZip();
    zip.file(`${fileName}.txt`, fileContent);
    blob = await zip.generateAsync({ type: 'blob' });

  } else if (format === 'pdf') {
    // PDF file using jsPDF
    const { jsPDF } = window.jspdf;
    const pdfDoc = new jsPDF();
    pdfDoc.text(fileContent, 10, 10);
    blob = pdfDoc.output('blob');

  } else if (format === 'zip') {
    // ZIP file using JSZip
    const zip = new JSZip();
    zip.file(`${fileName}.txt`, fileContent); // Add content as a .txt file in the ZIP
    blob = await zip.generateAsync({ type: 'blob' });

  } else {
    alert("Unsupported format selected!");
    return;
  }

  // Display results and enable download
  document.getElementById('convertedFile').textContent = convertedFileName;
  document.getElementById('result').style.display = 'block';

  const link = document.getElementById('downloadLink');
  link.href = URL.createObjectURL(blob);
  link.download = convertedFileName;
}
