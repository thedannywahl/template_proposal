async function mergePDF(copyId, form) {
  const setTimeout = function(f, t) {
    Utilities.sleep(t)
    return f()
  }
  const PDFexports = `13J1OJZellKHZK-YgCqozl3lOe8udgFjS`
  dlog(`Saving merged PDFs in folder %s`, PDFexports)
  const data = [copyId, form.orderformId].map((id) => new Uint8Array(DriveApp.getFileById(id).getBlob().getBytes()))
  const cdnjs = "https://cdn.jsdelivr.net/npm/pdf-lib/dist/pdf-lib.min.js";
  eval(UrlFetchApp.fetch(cdnjs).getContentText())
  dlog(`got cdnjs`)
  const pdfDoc = await PDFLib.PDFDocument.create()
  for (let i = 0; i < data.length; i++) {
    dlog(`Getting pages for document %s`, i)
    const pdfData = await PDFLib.PDFDocument.load(data[i])
    const pages = await pdfDoc.copyPages(pdfData, [...Array(pdfData.getPageCount())].map((_, i) => i))
    dlog(`Document has %s pages`, pages.length)
    pages.forEach(page => pdfDoc.addPage(page))
  }
  const bytes = await pdfDoc.save()
  const mergedPDFId = DriveApp.createFile(Utilities.newBlob([...new Int8Array(bytes)],
                                          MimeType.PDF,
                                          `${form.product} proposal for ${form.clientName}`))
                      .getId()
  dlog(`mergedPDFId: %s`, mergedPDFId)
  DriveApp.getFileById(mergedPDFId).moveTo(DriveApp.getFolderById(PDFexports))
  return mergedPDFId
}