const mongoose = require('mongoose')
const path = require('path')
const env = require('../config/env')
const connectDB = require('../config/db')
const Drug = require('../models/Drug')

async function seed() {
  await connectDB(env.MONGO_URI)

  const items = [
    {
      genericName: 'Paracetamol',
      brandNames: [
        { name: 'Dolo 650', manufacturer: 'Micro Labs', price: 20, availability: true },
        { name: 'Crocin', manufacturer: 'GSK', price: 25, availability: true }
      ],
      drugClass: 'Analgesic/Antipyretic',
      indications: ['Pain', 'Fever'],
      dosageForms: ['Tablet', 'Syrup'],
      strengths: ['325 mg', '500 mg', '650 mg'],
      storage: 'Store below 25°C',
      sideEffects: ['Nausea', 'Rash (rare)', 'Hepatotoxicity in overdose'],
      pregnancy: 'Generally considered safe at recommended doses',
      schedule: 'OTC',
      highRisk: false,
      keywords: ['acetaminophen']
    },
    {
      genericName: 'Warfarin',
      brandNames: [ { name: 'Coumadin', manufacturer: 'BMS', price: 150, availability: true } ],
      drugClass: 'Anticoagulant',
      indications: ['Venous thromboembolism', 'Atrial fibrillation'],
      dosageForms: ['Tablet'],
      strengths: ['1 mg', '2 mg', '5 mg'],
      storage: 'Room temperature',
      sideEffects: ['Bleeding', 'Skin necrosis (rare)'],
      pregnancy: 'Contraindicated in pregnancy',
      schedule: 'Prescription',
      highRisk: true,
      keywords: ['coumarin']
    },
    {
      genericName: 'Insulin (Human)',
      brandNames: [ { name: 'Actrapid', manufacturer: 'Novo Nordisk', price: 300, availability: true } ],
      drugClass: 'Antidiabetic - Insulin',
      indications: ['Diabetes mellitus'],
      dosageForms: ['Injection'],
      strengths: ['100 IU/mL'],
      storage: 'Refrigerate 2°C–8°C',
      sideEffects: ['Hypoglycaemia', 'Injection site reactions'],
      pregnancy: 'Use as indicated under supervision',
      schedule: 'Prescription',
      highRisk: true,
      keywords: ['insulin']
    }
  ]

  for (const it of items) {
    const exists = await Drug.findOne({ genericName: it.genericName })
    if (!exists) {
      await Drug.create(it)
      console.log('Seeded', it.genericName)
    } else {
      console.log('Already exists', it.genericName)
    }
  }

  console.log('Seeding complete')
  process.exit(0)
}

seed().catch(e => { console.error(e); process.exit(1) })
