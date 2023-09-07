function getProduct(product) {
  const products = {}

  products["Instructure Learning Platform"] = {
    name:               `Instructure Learning Platform`,
    theName:            `the Instructure Learning Platform`,
    exportPath:         `1hnZnKEH3iFSu62TwLVnK9Km4MrtXgcEk`,
    pdfExportPath:      `13J1OJZellKHZK-YgCqozl3lOe8udgFjS`,
    templateId:         `1xR-q8cAyW1Mh4etLwdTUOELKhzVlj3obOCisDLrseG4`,
    // productOverviewId:  `1XeMj3RDuWgU4ibrf8DR4-Z2AvIRp0Bk7zd4zwjtwvaw`, TODO: Finish transferring this doc.
    productOverviewId:  `13gkC9HrEBfpGpBp2ZOVRrcd-OMxDLiwJ`,
    color:              `#287A9F`,
    linkColor:          `#0097d3`,
    overviewIntro: {
      id: `1dOsPHZnwTCOSejNDylPjCMuVSki-AWm-wJ0orAMbo3g`,
    },
    support: {
      "Basic": {
        name: `Basic`,
        id:   `1hoJQAwJqmqa5ajWncFCHfGvm85O7R_NFgKQfTc311EY`,
        trt: {
          availableTo: `1 admin`,
          email:       `2 business days`,
          chat:        `Unavailable`,
          phone:       `available 6:00 AM to 6:00 PM local time`
        }
      },
      "24x7": {
        name: `24x7`,
        id:   `1Xo-YDnrBciw_JIc_-gZcxM_sq4ZCnxZZQaLj6j2rgQQ`,
        trt: {
          availableTo: `3 admins`,
          email: `12 hours`,
          chat:  `available 24x7`,
          phone: `available 24x7`
        }
      },
      "Faculty Tier 1": {
        name: `Faculty Tier 1`,
        id:   `1s2ViuK3btclMad8YyHCbaAAkKS47sfW3FYXip4bntX0`,
        trt: {
          availableTo: `admins and all faculty`,
          email: `1 hour`,
          chat:  `5 minutes`,
          phone: `5 minutes`
        }
      },
      "Tier 1": {
        name: `Tier 1`,
        id:   `15SempUGnFeenMG0lKOm8x2dwufKlJJgvZ3oEaqhtHXI`,
        trt: {
          availableTo: `admins, faculty, and students`,
          email: `1 hour`,
          chat:  `5 minutes`,
          phone: `5 minutes`
        }
      }
    },
    implementation: {
      "Essential": {
        name: `Essential`,
        id: `1Ni2IkRv9ZhP2nG6j6sUcUQCch4mSQnvM0Btb1vLJm6A`,
      },
      "Standard": {
        name: `Standard`,
        id: `1SESBRaI_iw47NNxCPiDG4z9vCdZrJMraN6gDY1m4VlU`,
      },
      "Premium": {
        name: `Premium`,
        id: `1vSgq6LOHrMcZylkblH8XgADKCQdeGYf-vW1NF8XLwjA`,
      }
    },
    csm: {
      "Yes": {
        id: `1kekFsogo5ETyprcNuLc64ZH3vYsmj3_l-eiQP15_o-U`,
      },
      "No": {
        id: `1tQwuCbFbASfWbLhplHCSHSACcchU_kHSb8mJ8rTWqjI`,
      }

    }
  }

  products["Canvas LMS"] = {}

  return products[product]
}
