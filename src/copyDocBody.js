function copyDocBody(id) {
  let content = DocumentApp
          .openById(id)
          .getBody()
  dlog(`content: %s`, content)
  return content
}