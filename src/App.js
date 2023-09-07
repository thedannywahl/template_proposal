const debug = false
function dlog(msg, obj) { if (debug) { Logger.log(msg, obj) } }
function log(msg, obj) { Logger.log(msg, obj) }

dlog(`DEBUGGING MODE`)

async function onFormSubmit(e) {
  dlog(`Called onFormSubmit(e)`)

  const debugData = [
    Intl.DateTimeFormat("en-US", {year: "numeric", month: "2-digit", day: "2-digit"}).format(new Date()),
    `Shelbyville High`,
    `Mr. Snrub`,
    `Danny Wahl`,
    `Director, GTM`,
    `800 203-6755`,
    `danny@instructure.com`,
    `https://drive.google.com/open?id=1DYJe5oMzs7roj96AutfvZmT1xV4D3A_J`,
    `PDF`,
    `Basic`,
    `Essential`,
    `Attach Product Overview`,
    //``,
    `Yes`
  ]

  let form
  if (debug || typeof e === 'undefined') {
    dlog(`Calling mapData(debugData)`)
    dlog(`debugData: %s`, debugData)
    log(`Calling mapData(debugData)`)
    form = mapData(debugData)
  } else {
    log(`Calling mapData(e.values)`)
    dlog(`e.values: %s`, e.values)
    log(`Calling mapData(e.values)`)
    form = mapData(e.values)
  }
  
  log(`Calling getProduct(form.product)`)
  dlog(`form.product: %s`, form.product)
  const product = getProduct(form.product)

  log(`Calling copyTemplate(product.templateId, form, product)`)
  dlog(`product.templateId: %s`, product.templateId)
  const id = copyTemplate(product.templateId, form, product)

  dlog(`id: %s`, id)
  dlog(`form: %s`, form)
  dlog(`product: %s`, product)
 
  log(`Calling populateCopy(id, form, product)`)
  await populateCopy(id, form, product).then(() => {
    log(`Calling buildEmail(id, form, product)`)
    buildEmail(id, form, product)}
  )
  dlog(`Exit`)
}