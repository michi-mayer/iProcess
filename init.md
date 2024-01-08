mutation MyMutation {
  createGrouping(input: {latitude: "52°26'10.0N", longitude: "10°46'31.9E", siteAdressCity: "Wolfsburg", siteAdressCountry: "Deutschland", siteAdressPostalCode: "38440", siteAdressState: "Niedersachsen", siteAdressStreet: "Berliner Ring 2", groupingLongText: "Presswerk PWP", groupingName: "PWP", groupingType: "Fertigung"})
}
--> b6f6413d-de43-41f7-bb58-a6bfcec2ff4d


mutation MyMutation {
  createUnit(input: {description: "Presswerk Laserschneideanlage 611", name: "Laseranlage 611", type: "Laserzelle", shortName: "L611", unitGoupingId: "b6f6413d-de43-41f7-bb58-a6bfcec2ff4d"}) {
    id
  }
}
--> b78d4ed4-8191-4ff8-8460-374a18c84b9f


mutation MyMutation {
  createPart(input: {name: "A Säule", partNumber: "11A 802 125/126"}) {
    id
  }
}
--> 13759a54-f43d-43b4-8d97-75b14ae22a10

mutation MyMutation {
  createProductionOrder(input: {productionOrder: "A Säule", productionOrderPartsId: "13759a54-f43d-43b4-8d97-75b14ae22a10", quota: 2100}) {
    id
  }
}
--> 84c7a069-09a8-4ea1-b883-d8fda5ad7d11


mutation MyMutation {
  createProductionorderUnit(input: {productionorderUnitProductionOrderId: "84c7a069-09a8-4ea1-b883-d8fda5ad7d11", productionorderUnitUnitId: "b78d4ed4-8191-4ff8-8460-374a18c84b9f"}) {
    id
  }
}
-->
2ee0f8cd-e9e2-46dc-9b6d-61c0216b1e5c

mutation MyMutation {
  createSchedule(input: {hoursEnd: "08:30:00.000", hoursStart: "07:30:00.000", numberOfWorkers: 1, partScheduleId: "13759a54-f43d-43b4-8d97-75b14ae22a10", quota: 100, quotaWithReplacement: 100, type: morningShift, manufacturedPart: "A Säule"}) {
    id
  }
}






mutation MyMutation {
  createUnit(input: {description: "Presswerk Laserschneideanlage 612", name: "Laseranlage 612", type: "Laserzelle", shortName: "L612",unitGroupingId: "b6f6413d-de43-41f7-bb58-a6bfcec2ff4d"}) {
    id
  }
}
-->
acdf5d06-aeb9-41cd-a6fc-7d5f1fdea176


mutation MyMutation {
  createPart(input: {name: "A Säule", partNumber: "11A 802 125/126"}) {
    id
  }
}
-->
a2d3bbe8-cc76-4722-a6d7-e7e1b0b1f1fa

mutation MyMutation {
  createProductionOrder(input: {productionOrder: "A Säule", productionOrderPartsId: "a2d3bbe8-cc76-4722-a6d7-e7e1b0b1f1fa", quota: 2100}) {
    id
  }
}
-->
df2dcd5a-9018-43ee-aafe-917c9439491d


mutation MyMutation {
  createProductionorderUnit(input: {productionorderUnitProductionOrderId: "df2dcd5a-9018-43ee-aafe-917c9439491d", productionorderUnitUnitId: "b78d4ed4-8191-4ff8-8460-374a18c84b9f"}) {
    id
  }
}
-->
68bdeaf1-d1e6-49a2-95a3-e148933205a6

mutation MyMutation {
  createSchedule(input: {hoursEnd: "08:30:00.000", hoursStart: "07:30:00.000", numberOfWorkers: 1, partScheduleId: "13759a54-f43d-43b4-8d97-75b14ae22a10", quota: 100, quotaWithReplacement: 100, type: morningShift, manufacturedPart: "A Säule"}) {
    id
  }
}
