function copyTemplate(templateId, form, product) {
  return DriveApp
          .getFileById(templateId)
          .makeCopy(
            `${form.clientName} - ${product.name} - ${form.date}`,
            DriveApp.getFolderById(product.exportPath)
          )
          .getId()
}