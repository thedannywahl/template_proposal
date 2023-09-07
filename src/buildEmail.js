async function buildEmail(id, form, product) {
  let body, htmlTemplate
  let inlineImages = {}
  let replyAddress = `rfps@instructure.com`
  let fromName = `Instructure Proposal Team`

  dlog(`form.format: %s`, form.format)
  switch(form.format) {
    case 'Email':
      htmlTemplate = `emailBody`
      dlog(`Calling emailBody(form, product)`)
      body = emailBody(form, product)
      inlineImages = {
        logo: DriveApp.getFileById(`13KSdIDdZa6lwY40QmMDXLhD8OrhdpZoN`).setName(`Instructure`),
        hero: DriveApp.getFileById(`13KyHE1F96I7x7hQv7JT14xUQD2v0ZgWY`).setName(`Hero`),
        fb:   DriveApp.getFileById(`13LrsqeL6-vK-cary9X4686BY33QeOI_b`).setName(`Facebook`),
        x:    DriveApp.getFileById(`13MKFDBc1I812MmU9ZguVmQsYpcSBr1ry`).setName(`X`),
        li:   DriveApp.getFileById(`13MqBdGfHQgtXvPtTPSCXqxb84asSQUjI`).setName(`LinkedIn`),
        yt:   DriveApp.getFileById(`13MAMRxu7xPusdW8Xs3EM5ABv4qoV45lh`).setName(`YouTube`)
      }
      replyAddress = form.rep.email
      fromName = form.rep.name
      break;
    case 'PDF':
      htmlTemplate = `pdfBody`
      dlog(`calling pdfBody(form, product)`)
      body = pdfBody(form, product)
      break;
    case 'Word':
      htmlTemplate = `wordBody`
      dlog(`Calling wordBody(id, form, product)`)
      body = wordBody(id, form, product)
      break;
    case 'Google':
      htmlTemplate = `googleBody`
      dlog(`Calling googleBody(id, form, product)`)
      body = googleBody(id, form, product)
      dlog(`Adding user ${form.rep.email} to Google Doc.`)
      Drive.Permissions.insert(
        {role:  `writer`, type:  `user`, value: form.rep.email},
        id,
        {sendNotificationEmails: false}
      )
      break;
  }
  const html = HtmlService.createTemplateFromFile(htmlTemplate)
  html.form = form
  html.product = product
  html.id = id
  const htmlBody = html.evaluate().getContent()
  dlog(`html: %s`, html)
  dlog(`htmlBody: %s`, htmlBody)
  
  const attachments = []
  dlog(`form.orderformId: %s`, form.orderformId)
  if(form.format === 'PDF' || form.format === 'Email') {
    dlog(`Merging with Order Form`)
    let attachmentId = await mergePDF(id, form)
    dlog(`attachmentId: %s`, attachmentId)
    attachments.push(DriveApp.getFileById(attachmentId).getAs(MimeType.PDF))
      dlog(`attachments: %s`, attachments)
  } else {
    attachments.push(DriveApp.getFileById(form.orderformId).getAs(MimeType.PDF))
  }
  if (form.productOverview) {
    dlog(`Attaching Product Overview`)
    attachments.push(DriveApp.getFileById(product.productOverviewId).getAs(MimeType.PDF))
  }
  dlog(`attachments: %s`, attachments)
  dlog(`Calling sendEmail(form, body {htmlBody, attachments, replyAddress, fromName, inlineImages})`)
  sendEmail(
    form,
    body,
    {
      htmlBody: htmlBody,
      attachments: attachments,
      replyAddress: replyAddress,
      fromName: fromName,
      inlineImages: inlineImages
    }
  )
  dlog(`Email sent`)
}

function sendEmail(form,
                   body,
                   {
                     htmlBody,
                     inlineImages = {},
                     attachments = [],
                     subject = `${form.product} Proposal for ${form.clientName}`,
                     replyAddress = `rfps@instructure.com`,
                     fromName = `Instructure Proposal Team`,
                     bcc = `rfps+customproposal@instructure.com`
                   } = {}) {
  dlog(`Calling GmailApp.sendEmail(form.rep.email, subject, body, {attachments, replyTo, name, htmlBody, inlineImages, bcc})`)
  GmailApp.sendEmail(
    form.rep.email,
    subject,
    body,
    {
      attachments: attachments,
      replyTo: replyAddress,
      name: fromName,
      htmlBody: htmlBody,
      inlineImages: inlineImages,
      bcc: bcc
  })
}

function emailBody(form, product) {
return `Hi ${form.primaryContact},

Your ${product.name} proposal from Instructure is attached.
Please don't hesitate to reach out to me if you need anything.

Sincerely,

${form.rep.name}
${form.rep.title}
${form.rep.email}
${form.rep.phone}`
}

function pdfBody(form, product) {
  return `Hi ${form.rep.name},

Your ${product.name} proposal for ${form.clientName} is attached.
If you need any additional support, please ask in #proposal-writers.

Thanks,

Instructure Proposal Team
rfps@instructure.com`
}

function wordBody(id, form, product) {
  return `Hi ${form.rep.name},
  
Your ${product.name} proposal for ${form.clientName} is ready for download: https://docs.google.com/document/d/${id}/export?format=docx
If you need any additional support, please ask in #proposal-writers

Thanks,

Instructure Proposal Team
rfps@instructure.com`
}

function googleBody(id, form, product) {
  return `Hi ${form.rep.name},
  
Your ${product.name} proposal for ${form.clientName} is ready: https://docs.google.com/document/d/${id}/view
If you need any additional support, please ask in #proposal-writers

Thanks,

Instructure Proposal Team
rfps@instructure.com`
}