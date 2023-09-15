async function populateCopy(id, form, product) {

  const copy = DocumentApp.openById(id)
  const copyBody = copy.getBody()
  const copyFooter = copy.getFooter()

  dlog(`Importing Product Overview Intro Text`)
  await importTemplate(copyBody, product.overviewIntro.id, `\\[overviewIntro.text\\]`)
  dlog(`Importing Support Text`)
  await importTemplate(copyBody, product.support[form.support].id, `\\[support.text\\]`)
  dlog(`Importing Implementation Text`)
  await importTemplate(copyBody, product.implementation[form.implementation].id, `\\[implementation.text\\]`)
  dlog(`Importing CSM text`)
  await importTemplate(copyBody, product.csm[form.csm].id, `\\[csm.text\\]`)

  dlog(`Importing Pricing`)
  await importPricing(copyBody, form.convertedOfId, `\\[pricing.text\\]`)

  dlog(`Replacing text snippets`)
  copyBody
    .replaceText(`\\[trt.availableTo\\]`, product.support[form.support].trt.availableTo)
    .replaceText(`\\[trt.email\\]`, product.support[form.support].trt.email)
    .replaceText(`\\[trt.chat\\]`, product.support[form.support].trt.chat)
    .replaceText(`\\[trt.phone\\]`, product.support[form.support].trt.phone)
    .replaceText(`\\[support\\]`, form.support)
    .replaceText(`\\[implementation\\]`, form.implementation)
    .replaceText(`\\[primarycontact\\]`, form.primaryContact)
    .replaceText(`\\[clientname\\]`, form.clientName)
    .replaceText(`\\[rep\\.name\\]`, form.rep.name)
    .replaceText(`\\[rep\\.title\\]`, form.rep.title)
    .replaceText(`\\[rep\\.phone\\]`, form.rep.phone)
    .findText(`\\[rep.email\\]`)
      .getElement()
      .setText(form.rep.email)
      .setLinkUrl(`mailto:${form.rep.email}`)
      .setForegroundColor(product.linkColor)

  copyFooter
    .replaceText(`\\[date\\]`, form.date)
    .replaceText(`\\[clientname\\]`, form.clientName)

  copy.saveAndClose()
}

async function importTemplate(docBody, templateId, text) {
  const textLocation = docBody.findText(text).getElement().getParent()
  let j = docBody.getChildIndex(textLocation)
  const templateBody = DocumentApp.openById(templateId).getBody()
  let els = templateBody.getNumChildren()
  dlog(`Template has %s elements`, els)
  for (let i = 0; i < els; i++) {
    dlog(`Inspecting element %s`, i)
    const e = templateBody.getChild(i).copy()
    const t = e.getType()
    dlog(`Element is: %s`, t)
    switch(t) {
      case DocumentApp.ElementType.PARAGRAPH:
        dlog(`Inserting Paragraph`)
        docBody.insertParagraph(j, e)
        break;
      case DocumentApp.ElementType.TABLE:
        dlog(`Inserting Table`)
        docBody.insertTable(j, e)
        break;
      case DocumentApp.ElementType.LIST_ITEM:
        dlog(`Inserting List Item`)
        docBody.insertListItem(j, e)
        break;
      case DocumentApp.ElementType.INLINE_IMAGE:
        dlog(`Inserting Image`)
        docBody.insertImage(j, e)
        break;
      case DocumentApp.ElementType.PAGE_BREAK:
        dlog(`Inserting Page Break`)
        docBody.insertPageBreak(j, e)
        break;
      default:
        log(`Failed to add type: %s`, t)
    }
    j++
  }
  docBody.removeChild(textLocation)
}

async function importPricing(docBody, ofId, text) {

  const thead = {}
  thead[DocumentApp.Attribute.FOREGROUND_COLOR] = `#ffffff`
  thead[DocumentApp.Attribute.FONT_SIZE] = 11
  thead[DocumentApp.Attribute.BOLD] = true

  const tbody = {}
  tbody[DocumentApp.Attribute.FONT_FAMILY] = `Proxima Nova`
  tbody[DocumentApp.Attribute.FOREGROUND_COLOR] = `#143d50`
  tbody[DocumentApp.Attribute.FONT_SIZE] = 8
  tbody[DocumentApp.Attribute.LINE_SPACING] = 0
  tbody[DocumentApp.Attribute.BORDER_COLOR] = `#143d50`

  const textLocation = docBody.findText(text).getElement().getParent()
  let j = docBody.getChildIndex(textLocation)
  const templateBody = DocumentApp.openById(ofId).getBody()
  const y1 = templateBody.findText(`Year 1`).getElement().getParent()
  const start = templateBody.getChildIndex(y1)
  dlog(`Pricing Table starts at element %s`, start)
  const gt = templateBody.findText(`Grand Total`).getElement().getParent().getParent().getParent().getParent()
  const end = templateBody.getChildIndex(gt) + 1
  dlog(`Pricing Table ends at element %s`, end)
  let prevText = ``
  let prevTable = {}

  for (let i = start; i < end; i++) {
    dlog(`Inspecting element %s`, i)
    const e = templateBody.getChild(i).copy()
    const t = e.getType()
    dlog(`Element is: %s`, t)
    switch(t) {
      case DocumentApp.ElementType.PARAGRAPH:
        let txt = e.getText()
        if( txt.startsWith(`Year`) ) {
          dlog(`Inserting Header %s`, txt)
          docBody.insertParagraph(j, txt).setHeading(DocumentApp.ParagraphHeading.HEADING4)
          j++
        }
        dlog(`Skipping paragraph.`)
        prevText = txt
        break;
      case DocumentApp.ElementType.TABLE:
        dlog(`Inserting Table`)
        let insertTable = true
        e.setColumnWidth(0, (1.562 * 72))
        let header = e.getRow(0)
        let columns = header.getNumCells()
        e.setColumnWidth((columns - 1), (1 * 72))
        e.setAttributes(tbody)
        if (prevText.startsWith(`Year`)) {
          dlog(`Table follows Header, styling row 1`)
          header.setAttributes(thead)
          for(let c = 0; c < columns; c++) {
            header.getCell(c).setBackgroundColor(`#143d50`)
          }
          prevTable = e
        } else {
          dlog(`Table does not follow Header, deleting row 1.`)
          e.removeRow(0)
          insertTable = false
        }
        dlog(`Highlight Subtotals`)
        let rows = e.getNumRows()
        for(let k = 0; k < rows; k++) {
          let row = e.getRow(k)
          if(row.getCell(0).getText().includes('Sub-Total') || row.getCell(0).getText().match(/Year \d Total/)) {
            dlog(`Highlighting row`)
            for(let c = 0; c < columns; c++) {
              row.getCell(c).setBackgroundColor(`#F2F8FA`)
            }
          } else if (row.getCell(0).getText().includes('Grand Total')) {
            dlog(`Highlighting Grand Total`)
            for(let c = 0; c < columns; c++) {
              row.getCell(c).setBackgroundColor(`#CCDCE4`)
            }
          } else {
            dlog(`Skipping row highlight`)
          }
          if (!insertTable) {
            dlog(`Appending row to previous table`)
            prevTable.appendTableRow(row.copy())
          }
        }
        if (insertTable) {
          dlog(`Inserting new table`)
          docBody.insertTable(j, e)
          j++
        }
        prevText = ``
        break;
      case DocumentApp.ElementType.LIST_ITEM:
        dlog(`Inserting List`)
        docBody.insertListItem(j, e)
        j++;
      default:
        log(`Failed to add type: %s`, t)
    }
  }
  dlog(`Removing snippet text placeholder`)
  docBody.removeChild(textLocation)
}