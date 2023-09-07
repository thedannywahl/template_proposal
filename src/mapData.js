function mapData(data) {
  const form = {}
  form.date = data[0].split(" ")[0]
  dlog(`form.date: %s`, form.date)
  form.clientName = data[1]
  dlog(`form.clientName: %s`, form.clientName)
  form.primaryContact = data[2]
  dlog(`form.primaryContact: %s`, form.primaryContact)
  form.rep = {
    name:  data[3],
    title: data[4],
    phone: data[5],
    email: data[6]
  }
  dlog(`form.rep: %s`, form.rep)
  form.orderformId = data[7].split(`=`)[1]
  dlog(`form.orderformId: %s`, form.orderformId)
  form.format = data[8]
  dlog(`form.format: %s`, form.format)
  form.support = data[9]
  dlog(`form.support: %s`, form.support)
  form.implementation = data[10]
  dlog(`form.implementation: %s`, form.implementation)
  form.productOverview = (data[11] === `Attach Product Overview`) ? true : false
  dlog(`form.implementation: %s`, form.implementation)
  form.csm = data[12]
  dlog(`form.csm: %s`, form.csm)
  form.product = `Instructure Learning Platform`
  dlog(`form.product: %s`, form.product)
  form.theproduct = (form.product === 'Instructure Learning Platform') ? `the ${form.product}` : form.product
  dlog(`form.theproduct: %s`, form.theproduct)

  dlog(`Converting PDF Orderform to Google doc.`)
  var docx       = DriveApp.getFileById(form.orderformId)
  var folder     = docx.getParents().next()
  var blob       = docx.getBlob()
  var new_file   = Drive.newFile()
  var google_doc = Drive.Files.insert(new_file, blob, {convert:true})
  DriveApp.getFileById(google_doc.id)
          .setName(docx.getName()
          .replace(/\.docx$/,''))
          .moveTo(folder)
  form.convertedOfId = google_doc.id
  dlog(`form.convertedOfId: %s`, form.convertedOfId)

  return form
}