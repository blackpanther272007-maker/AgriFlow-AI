/**
 * AgriFlow AI - Standalone Demo Dataset
 * Realistic preloaded agricultural data for South Indian farming context.
 * All figures are represented in Indian Rupees (₹) and acres/kg.
 */

export const INITIAL_DEMO_DATA = {
  farms: [
    {
      _id: "farm_demo_001",
      name: "Green Valley Organics",
      location: "Coimbatore, Tamil Nadu",
      total_area: 25.0,
      area_unit: "acres",
      soil_type: "Red Sandy Loam",
      description: "Integrated organic farm focusing on groundnut, sweet corn, fodder, and dairy cattle.",
      created_at: "2026-01-15T08:00:00.000Z"
    },
    {
      _id: "farm_demo_002",
      name: "Cauvery Delta Agro",
      location: "Thanjavur, Tamil Nadu",
      total_area: 18.5,
      area_unit: "acres",
      soil_type: "Alluvial Clay Loam",
      description: "Specialized wetland paddy cultivation and commercial Grand Naine banana plantation.",
      created_at: "2026-02-01T09:30:00.000Z"
    },
    {
      _id: "farm_demo_003",
      name: "Vanniar Highlands Agro",
      location: "Dindigul, Tamil Nadu",
      total_area: 12.0,
      area_unit: "acres",
      soil_type: "Red Gravelly Loam",
      description: "Horticultural vegetable crops, hybrid tomatoes, and pedigree goat rearing.",
      created_at: "2026-03-10T10:15:00.000Z"
    }
  ],

  fields: [
    {
      _id: "field_demo_001",
      farm_id: "farm_demo_001",
      name: "North Plot A (Cereals & Pulses)",
      area: 10.0,
      area_unit: "acres",
      soil_type: "Red Sandy Loam",
      irrigation_type: "Drip",
      description: "Equipped with automated drip fertigation lines.",
      created_at: "2026-01-20T08:00:00.000Z"
    },
    {
      _id: "field_demo_002",
      farm_id: "farm_demo_001",
      name: "South Meadow B (Sugarcane)",
      area: 8.0,
      area_unit: "acres",
      soil_type: "Clay Loam",
      irrigation_type: "Sprinkler",
      description: "Borewell-fed sprinkler network for high-moisture crops.",
      created_at: "2026-01-22T09:00:00.000Z"
    },
    {
      _id: "field_demo_003",
      farm_id: "farm_demo_001",
      name: "Pasture Block C (Fodder Grass)",
      area: 7.0,
      area_unit: "acres",
      soil_type: "Red Soil",
      irrigation_type: "Rainfed",
      description: "Perennial hybrid Napier grass and legume grazing plot.",
      created_at: "2026-01-25T11:00:00.000Z"
    },
    {
      _id: "field_demo_004",
      farm_id: "farm_demo_002",
      name: "River Basin Wetland 1",
      area: 12.0,
      area_unit: "acres",
      soil_type: "Alluvial Clay",
      irrigation_type: "Canal",
      description: "Direct canal water feeding with laser-levelled bunds.",
      created_at: "2026-02-05T08:30:00.000Z"
    },
    {
      _id: "field_demo_005",
      farm_id: "farm_demo_002",
      name: "Delta Grove Block 2",
      area: 6.5,
      area_unit: "acres",
      soil_type: "Alluvial Loam",
      irrigation_type: "Drip",
      description: "Windbreak boundary with subsurface drip for bananas.",
      created_at: "2026-02-10T10:00:00.000Z"
    },
    {
      _id: "field_demo_006",
      farm_id: "farm_demo_003",
      name: "Hill Crest Plot 1",
      area: 6.0,
      area_unit: "acres",
      soil_type: "Red Gravelly",
      irrigation_type: "Borewell Drip",
      description: "Trellised vegetable plot with shade netting.",
      created_at: "2026-03-12T07:45:00.000Z"
    },
    {
      _id: "field_demo_007",
      farm_id: "farm_demo_003",
      name: "Terrace Field 2",
      area: 6.0,
      area_unit: "acres",
      soil_type: "Red Loam",
      irrigation_type: "Sprinkler",
      description: "Terraced cultivation for pulses and intercrops.",
      created_at: "2026-03-15T09:15:00.000Z"
    }
  ],

  crops: [
    {
      _id: "crop_demo_001",
      farm_id: "farm_demo_002",
      field_id: "field_demo_004",
      name: "Rice",
      variety: "Ponni Traditional",
      status: "ready_for_harvest",
      planting_date: "2026-06-15T00:00:00.000Z",
      expected_harvest_date: "2026-10-18T00:00:00.000Z",
      actual_harvest_date: null,
      area: 12.0,
      area_unit: "acres",
      expected_yield: 28000,
      yield_unit: "kg",
      actual_yield: null,
      notes: "Golden panicles turning mature; drainage started for harvest machinery.",
      created_at: "2026-06-10T08:00:00.000Z"
    },
    {
      _id: "crop_demo_002",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      name: "Tomato",
      variety: "Shivam F1 Hybrid",
      status: "ready_for_harvest",
      planting_date: "2026-07-20T00:00:00.000Z",
      expected_harvest_date: "2026-10-10T00:00:00.000Z",
      actual_harvest_date: null,
      area: 4.0,
      area_unit: "acres",
      expected_yield: 18000,
      yield_unit: "kg",
      actual_yield: 7500,
      notes: "High market demand. Second harvesting wave underway.",
      created_at: "2026-07-15T09:00:00.000Z"
    },
    {
      _id: "crop_demo_003",
      farm_id: "farm_demo_002",
      field_id: "field_demo_005",
      name: "Banana",
      variety: "Grand Naine (G9)",
      status: "growing",
      planting_date: "2026-03-01T00:00:00.000Z",
      expected_harvest_date: "2026-12-20T00:00:00.000Z",
      actual_harvest_date: null,
      area: 6.5,
      area_unit: "acres",
      expected_yield: 42000,
      yield_unit: "kg",
      actual_yield: null,
      notes: "Bunch covers applied. Bunch development progressing with optimal girth.",
      created_at: "2026-02-25T11:00:00.000Z"
    },
    {
      _id: "crop_demo_004",
      farm_id: "farm_demo_001",
      field_id: "field_demo_001",
      name: "Groundnut",
      variety: "Kadiri-6",
      status: "growing",
      planting_date: "2026-08-05T00:00:00.000Z",
      expected_harvest_date: "2026-11-20T00:00:00.000Z",
      actual_harvest_date: null,
      area: 6.0,
      area_unit: "acres",
      expected_yield: 8500,
      yield_unit: "kg",
      actual_yield: null,
      notes: "Peg formation stage healthy; gypsum applied 10 days ago.",
      created_at: "2026-08-01T08:30:00.000Z"
    },
    {
      _id: "crop_demo_005",
      farm_id: "farm_demo_001",
      field_id: "field_demo_002",
      name: "Sugarcane",
      variety: "Co 86032",
      status: "planted",
      planting_date: "2026-09-10T00:00:00.000Z",
      expected_harvest_date: "2027-07-25T00:00:00.000Z",
      actual_harvest_date: null,
      area: 8.0,
      area_unit: "acres",
      expected_yield: 260000,
      yield_unit: "kg",
      actual_yield: null,
      notes: "Single bud sett planting; germination count exceeds 88%.",
      created_at: "2026-09-05T10:00:00.000Z"
    },
    {
      _id: "crop_demo_006",
      farm_id: "farm_demo_003",
      field_id: "field_demo_007",
      name: "Black Gram (Urad)",
      variety: "VBN-8",
      status: "planned",
      planting_date: "2026-10-25T00:00:00.000Z",
      expected_harvest_date: "2027-01-20T00:00:00.000Z",
      actual_harvest_date: null,
      area: 6.0,
      area_unit: "acres",
      expected_yield: 3600,
      yield_unit: "kg",
      actual_yield: null,
      notes: "Post-monsoon pulse planting plan for soil nitrogen rejuvenation.",
      created_at: "2026-09-20T09:00:00.000Z"
    },
    {
      _id: "crop_demo_007",
      farm_id: "farm_demo_001",
      field_id: "field_demo_001",
      name: "Sweet Corn",
      variety: "Sugar 75",
      status: "harvested",
      planting_date: "2026-04-10T00:00:00.000Z",
      expected_harvest_date: "2026-07-15T00:00:00.000Z",
      actual_harvest_date: "2026-07-18T00:00:00.000Z",
      area: 4.0,
      area_unit: "acres",
      expected_yield: 12000,
      yield_unit: "kg",
      actual_yield: 12800,
      notes: "Successful summer harvest with premium cob grade quality.",
      created_at: "2026-04-05T08:00:00.000Z"
    }
  ],

  livestock: [
    {
      _id: "ls_demo_001",
      farm_id: "farm_demo_001",
      animal_id: "COW-001",
      animal_type: "Cow",
      breed: "Gir Indigenous",
      gender: "Female",
      birth_date: "2022-04-10T00:00:00.000Z",
      status: "Active",
      purchase_cost: 65000.0,
      purchase_date: "2023-01-15T00:00:00.000Z",
      notes: "Registered pedigree Gir cow. Produces high fat A2 organic milk.",
      created_at: "2023-01-15T00:00:00.000Z"
    },
    {
      _id: "ls_demo_002",
      farm_id: "farm_demo_001",
      animal_id: "COW-002",
      animal_type: "Cow",
      breed: "Sahiwal Dairy",
      gender: "Female",
      birth_date: "2023-01-20T00:00:00.000Z",
      status: "Active",
      purchase_cost: 58000.0,
      purchase_date: "2023-06-10T00:00:00.000Z",
      notes: "Steady 14L/day milker, gentle temperament.",
      created_at: "2023-06-10T00:00:00.000Z"
    },
    {
      _id: "ls_demo_003",
      farm_id: "farm_demo_003",
      animal_id: "GOA-001",
      animal_type: "Goat",
      breed: "Jamnapari Dual Purpose",
      gender: "Female",
      birth_date: "2024-02-14T00:00:00.000Z",
      status: "Active",
      purchase_cost: 14000.0,
      purchase_date: "2024-05-12T00:00:00.000Z",
      notes: "Healthy breeding doe with twin birth history.",
      created_at: "2024-05-12T00:00:00.000Z"
    },
    {
      _id: "ls_demo_004",
      farm_id: "farm_demo_003",
      animal_id: "GOA-002",
      animal_type: "Goat",
      breed: "Beetal Stud",
      gender: "Male",
      birth_date: "2023-11-05T00:00:00.000Z",
      status: "Active",
      purchase_cost: 18000.0,
      purchase_date: "2024-03-01T00:00:00.000Z",
      notes: "Pedigree buck used for herd genetics improvement.",
      created_at: "2024-03-01T00:00:00.000Z"
    },
    {
      _id: "ls_demo_005",
      farm_id: "farm_demo_001",
      animal_id: "CHI-001",
      animal_type: "Chicken",
      breed: "Aseel Cross Free Range (Flock of 50)",
      gender: "Female",
      birth_date: "2025-01-10T00:00:00.000Z",
      status: "Active",
      purchase_cost: 12500.0,
      purchase_date: "2025-03-01T00:00:00.000Z",
      notes: "Naturally scavenged organic country brown eggs.",
      created_at: "2025-03-01T00:00:00.000Z"
    }
  ],

  feed_records: [
    {
      _id: "feed_demo_001",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      feed_type: "Green Fodder (Co-4 & Hybrid Napier)",
      quantity: 30.0,
      unit: "kg",
      cost: 180.0,
      feed_date: "2026-10-01T00:00:00.000Z",
      notes: "Fresh morning harvested green silage.",
      created_at: "2026-10-01T08:00:00.000Z"
    },
    {
      _id: "feed_demo_002",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      feed_type: "Compound Cattle Feed Pellets",
      quantity: 6.0,
      unit: "kg",
      cost: 240.0,
      feed_date: "2026-10-02T00:00:00.000Z",
      notes: "Enriched with 22% bypass protein.",
      created_at: "2026-10-02T08:00:00.000Z"
    },
    {
      _id: "feed_demo_003",
      livestock_id: "ls_demo_002",
      farm_id: "farm_demo_001",
      feed_type: "Dry Fodder & Mineral Mixture",
      quantity: 25.0,
      unit: "kg",
      cost: 210.0,
      feed_date: "2026-10-02T00:00:00.000Z",
      notes: "Paddy straw with chelated mineral salts.",
      created_at: "2026-10-02T09:00:00.000Z"
    },
    {
      _id: "feed_demo_004",
      livestock_id: "ls_demo_003",
      farm_id: "farm_demo_003",
      feed_type: "Subabul & Tree Loppings",
      quantity: 8.0,
      unit: "kg",
      cost: 70.0,
      feed_date: "2026-10-03T00:00:00.000Z",
      notes: "High calcium protein forage.",
      created_at: "2026-10-03T07:30:00.000Z"
    },
    {
      _id: "feed_demo_005",
      livestock_id: "ls_demo_005",
      farm_id: "farm_demo_001",
      feed_type: "Poultry Layer Mash & Crushed Grains",
      quantity: 15.0,
      unit: "kg",
      cost: 450.0,
      feed_date: "2026-10-03T00:00:00.000Z",
      notes: "Balanced corn, soy and calcium shell grit.",
      created_at: "2026-10-03T08:15:00.000Z"
    }
  ],

  medical_records: [
    {
      _id: "med_demo_001",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      diagnosis: "Routine Post-Partum Health Check & Vitamin Tonic",
      treatment: "Multivitamin injection & Calcium Drench",
      treatment_date: "2026-08-14T00:00:00.000Z",
      cost: 850.0,
      vet_name: "Dr. K. Swaminathan, B.V.Sc",
      notes: "Cow in excellent physical condition.",
      created_at: "2026-08-14T10:00:00.000Z"
    },
    {
      _id: "med_demo_002",
      livestock_id: "ls_demo_003",
      farm_id: "farm_demo_003",
      diagnosis: "Preventative Broad-spectrum Deworming",
      treatment: "Albendazole Oral Suspension",
      treatment_date: "2026-09-05T00:00:00.000Z",
      cost: 250.0,
      vet_name: "Dr. Priya Mohan, Dindigul Vet Dispensary",
      notes: "Administered as bi-annual schedule.",
      created_at: "2026-09-05T11:00:00.000Z"
    },
    {
      _id: "med_demo_003",
      livestock_id: "ls_demo_002",
      farm_id: "farm_demo_001",
      diagnosis: "Minor Hoof Bruise & Cleansing",
      treatment: "Antiseptic dressing & zinc oxide spray",
      treatment_date: "2026-09-22T00:00:00.000Z",
      cost: 450.0,
      vet_name: "Dr. K. Swaminathan, B.V.Sc",
      notes: "Fully healed within 4 days.",
      created_at: "2026-09-22T14:00:00.000Z"
    }
  ],

  vaccination_records: [
    {
      _id: "vac_demo_001",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      vaccine_name: "Foot & Mouth Disease (FMD) Booster",
      vaccination_date: "2026-04-12T00:00:00.000Z",
      next_due_date: "2026-10-14T00:00:00.000Z",
      cost: 150.0,
      batch_number: "FMD-TN-2026-04",
      administered_by: "Govt Veterinary Center",
      notes: "Regular 6-month national booster protocol.",
      created_at: "2026-04-12T09:00:00.000Z"
    },
    {
      _id: "vac_demo_002",
      livestock_id: "ls_demo_002",
      farm_id: "farm_demo_001",
      vaccine_name: "Hemorrhagic Septicemia (HS)",
      vaccination_date: "2026-05-18T00:00:00.000Z",
      next_due_date: "2026-11-18T00:00:00.000Z",
      cost: 120.0,
      batch_number: "HS-SER-881",
      administered_by: "Dr. K. Swaminathan",
      notes: "Immunity valid through winter monsoon.",
      created_at: "2026-05-18T09:30:00.000Z"
    },
    {
      _id: "vac_demo_003",
      livestock_id: "ls_demo_003",
      farm_id: "farm_demo_003",
      vaccine_name: "Enterotoxemia (ET)",
      vaccination_date: "2026-04-20T00:00:00.000Z",
      next_due_date: "2026-10-22T00:00:00.000Z",
      cost: 90.0,
      batch_number: "ET-CAP-331",
      administered_by: "Dindigul Animal Husbandry",
      notes: "Annual pulpy kidney vaccination.",
      created_at: "2026-04-20T10:00:00.000Z"
    },
    {
      _id: "vac_demo_004",
      livestock_id: "ls_demo_005",
      farm_id: "farm_demo_001",
      vaccine_name: "Ranikhet Disease Vaccine (Lasota)",
      vaccination_date: "2026-08-01T00:00:00.000Z",
      next_due_date: "2026-11-01T00:00:00.000Z",
      cost: 200.0,
      batch_number: "RDV-POULT-09",
      administered_by: "Farm Supervisor",
      notes: "Administered via drinking water to whole flock.",
      created_at: "2026-08-01T08:00:00.000Z"
    }
  ],

  production_records: [
    {
      _id: "prod_demo_001",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      production_type: "Milk",
      quantity: 15.0,
      unit: "Liters",
      selling_price: 52.0,
      income: 780.0,
      production_date: "2026-10-01T00:00:00.000Z",
      notes: "Morning 9L, Evening 6L",
      created_at: "2026-10-01T18:00:00.000Z"
    },
    {
      _id: "prod_demo_002",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      production_type: "Milk",
      quantity: 15.5,
      unit: "Liters",
      selling_price: 52.0,
      income: 806.0,
      production_date: "2026-10-02T00:00:00.000Z",
      notes: "Premium organic milk collected",
      created_at: "2026-10-02T18:00:00.000Z"
    },
    {
      _id: "prod_demo_003",
      livestock_id: "ls_demo_002",
      farm_id: "farm_demo_001",
      production_type: "Milk",
      quantity: 13.0,
      unit: "Liters",
      selling_price: 55.0,
      income: 715.0,
      production_date: "2026-10-02T00:00:00.000Z",
      notes: "High fat content batch",
      created_at: "2026-10-02T18:15:00.000Z"
    },
    {
      _id: "prod_demo_004",
      livestock_id: "ls_demo_005",
      farm_id: "farm_demo_001",
      production_type: "Eggs",
      quantity: 42.0,
      unit: "Pieces",
      selling_price: 9.0,
      income: 378.0,
      production_date: "2026-10-03T00:00:00.000Z",
      notes: "Country chicken eggs collected",
      created_at: "2026-10-03T16:00:00.000Z"
    },
    {
      _id: "prod_demo_005",
      livestock_id: "ls_demo_001",
      farm_id: "farm_demo_001",
      production_type: "Milk",
      quantity: 15.2,
      unit: "Liters",
      selling_price: 52.0,
      income: 790.4,
      production_date: "2026-10-04T00:00:00.000Z",
      notes: "Fresh dairy collection",
      created_at: "2026-10-04T18:00:00.000Z"
    }
  ],

  activities: [
    {
      _id: "act_demo_001",
      farm_id: "farm_demo_002",
      field_id: "field_demo_004",
      crop_id: "crop_demo_001",
      activity_type: "Land Preparation",
      activity_date: "2026-06-08T00:00:00.000Z",
      description: "Paddy puddling and tractor rotavator leveling.",
      labour_count: 4,
      labour_cost: 3200.0,
      equipment_cost: 4500.0,
      other_cost: 300.0,
      total_cost: 8000.0,
      created_at: "2026-06-08T16:00:00.000Z"
    },
    {
      _id: "act_demo_002",
      farm_id: "farm_demo_002",
      field_id: "field_demo_004",
      crop_id: "crop_demo_001",
      activity_type: "Planting / Sowing",
      activity_date: "2026-06-15T00:00:00.000Z",
      description: "Paddy mat nursery transplanting across 12 acres.",
      labour_count: 18,
      labour_cost: 14400.0,
      equipment_cost: 1200.0,
      other_cost: 400.0,
      total_cost: 16000.0,
      created_at: "2026-06-15T17:00:00.000Z"
    },
    {
      _id: "act_demo_003",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      activity_type: "Fertilizer Application",
      activity_date: "2026-08-10T00:00:00.000Z",
      description: "Foliar spray of micronutrients and seaweed extract.",
      labour_count: 2,
      labour_cost: 1600.0,
      equipment_cost: 600.0,
      other_cost: 2200.0,
      total_cost: 4400.0,
      created_at: "2026-08-10T12:00:00.000Z"
    },
    {
      _id: "act_demo_004",
      farm_id: "farm_demo_001",
      field_id: "field_demo_001",
      crop_id: "crop_demo_004",
      activity_type: "Weeding",
      activity_date: "2026-08-28T00:00:00.000Z",
      description: "Manual hand weeding and earthing up for groundnut pegs.",
      labour_count: 6,
      labour_cost: 4200.0,
      equipment_cost: 0.0,
      other_cost: 200.0,
      total_cost: 4400.0,
      created_at: "2026-08-28T15:00:00.000Z"
    },
    {
      _id: "act_demo_005",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      activity_type: "Harvesting",
      activity_date: "2026-10-04T00:00:00.000Z",
      description: "Plucking and crate packing for Dindigul market.",
      labour_count: 8,
      labour_cost: 5600.0,
      equipment_cost: 400.0,
      other_cost: 800.0,
      total_cost: 6800.0,
      created_at: "2026-10-04T17:30:00.000Z"
    }
  ],

  expenses: [
    {
      _id: "exp_demo_001",
      farm_id: "farm_demo_002",
      field_id: "field_demo_004",
      crop_id: "crop_demo_001",
      category: "Seeds",
      amount: 14500.0,
      expense_date: "2026-06-12T00:00:00.000Z",
      description: "Certified Ponni Paddy seed bags (60 kg) from TNAU depot",
      payment_mode: "UPI",
      created_at: "2026-06-12T10:00:00.000Z"
    },
    {
      _id: "exp_demo_002",
      farm_id: "farm_demo_002",
      field_id: "field_demo_004",
      crop_id: "crop_demo_001",
      category: "Fertilizer",
      amount: 22000.0,
      expense_date: "2026-07-08T00:00:00.000Z",
      description: "Urea, DAP, and Potash complex application",
      payment_mode: "Cash",
      created_at: "2026-07-08T11:30:00.000Z"
    },
    {
      _id: "exp_demo_003",
      farm_id: "farm_demo_002",
      field_id: "field_demo_004",
      crop_id: "crop_demo_001",
      category: "Labour",
      amount: 28500.0,
      expense_date: "2026-07-22T00:00:00.000Z",
      description: "Paddy transplantation labour (22 farm workers)",
      payment_mode: "Bank Transfer",
      created_at: "2026-07-22T17:00:00.000Z"
    },
    {
      _id: "exp_demo_004",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      category: "Seeds",
      amount: 8400.0,
      expense_date: "2026-07-15T00:00:00.000Z",
      description: "Hybrid tomato nursery seedlings (10,000 saplings)",
      payment_mode: "UPI",
      created_at: "2026-07-15T09:15:00.000Z"
    },
    {
      _id: "exp_demo_005",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      category: "Equipment",
      amount: 12000.0,
      expense_date: "2026-07-28T00:00:00.000Z",
      description: "Trellising bamboo stakes & wire support",
      payment_mode: "Cash",
      created_at: "2026-07-28T14:00:00.000Z"
    },
    {
      _id: "exp_demo_006",
      farm_id: "farm_demo_001",
      field_id: "field_demo_001",
      crop_id: "crop_demo_004",
      category: "Seeds",
      amount: 16800.0,
      expense_date: "2026-08-01T00:00:00.000Z",
      description: "Groundnut pod seeds (120 kg)",
      payment_mode: "UPI",
      created_at: "2026-08-01T10:30:00.000Z"
    },
    {
      _id: "exp_demo_007",
      farm_id: "farm_demo_001",
      field_id: "field_demo_001",
      crop_id: "crop_demo_004",
      category: "Fertilizer",
      amount: 9500.0,
      expense_date: "2026-08-20T00:00:00.000Z",
      description: "Gypsum & bio-fertilizer rhizobium inoculation",
      payment_mode: "UPI",
      created_at: "2026-08-20T12:00:00.000Z"
    },
    {
      _id: "exp_demo_008",
      farm_id: "farm_demo_001",
      field_id: null,
      crop_id: null,
      category: "Feed",
      amount: 18500.0,
      expense_date: "2026-09-05T00:00:00.000Z",
      description: "Bulk cattle feed concentrate bags (20 bags)",
      payment_mode: "Bank Transfer",
      created_at: "2026-09-05T15:00:00.000Z"
    },
    {
      _id: "exp_demo_009",
      farm_id: "farm_demo_002",
      field_id: "field_demo_005",
      crop_id: "crop_demo_003",
      category: "Labour",
      amount: 15000.0,
      expense_date: "2026-09-15T00:00:00.000Z",
      description: "Banana de-suckering and trench weeding labour",
      payment_mode: "Cash",
      created_at: "2026-09-15T16:30:00.000Z"
    },
    {
      _id: "exp_demo_010",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      category: "Transportation",
      amount: 6500.0,
      expense_date: "2026-10-02T00:00:00.000Z",
      description: "Tempo transport crates to Dindigul wholesale mandi",
      payment_mode: "UPI",
      created_at: "2026-10-02T06:00:00.000Z"
    }
  ],

  income: [
    {
      _id: "inc_demo_001",
      farm_id: "farm_demo_001",
      field_id: "field_demo_001",
      crop_id: "crop_demo_007",
      source: "Crop Sales",
      amount: 96000.0,
      income_date: "2026-07-25T00:00:00.000Z",
      description: "Sweet Corn commercial harvest bulk buyer contract",
      payment_mode: "Bank Transfer",
      created_at: "2026-07-25T14:00:00.000Z"
    },
    {
      _id: "inc_demo_002",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      source: "Crop Sales",
      amount: 142000.0,
      income_date: "2026-09-28T00:00:00.000Z",
      description: "First harvest tomato crates sale at market mandi",
      payment_mode: "UPI",
      created_at: "2026-09-28T16:00:00.000Z"
    },
    {
      _id: "inc_demo_003",
      farm_id: "farm_demo_001",
      field_id: null,
      crop_id: null,
      source: "Milk Sales",
      amount: 38400.0,
      income_date: "2026-09-30T00:00:00.000Z",
      description: "Monthly dairy cooperative bulk milk delivery settlement",
      payment_mode: "Bank Transfer",
      created_at: "2026-09-30T18:00:00.000Z"
    },
    {
      _id: "inc_demo_004",
      farm_id: "farm_demo_003",
      field_id: "field_demo_006",
      crop_id: "crop_demo_002",
      source: "Crop Sales",
      amount: 68000.0,
      income_date: "2026-10-04T00:00:00.000Z",
      description: "Second picking tomato market sale (120 crates)",
      payment_mode: "UPI",
      created_at: "2026-10-04T12:00:00.000Z"
    },
    {
      _id: "inc_demo_005",
      farm_id: "farm_demo_001",
      field_id: null,
      crop_id: null,
      source: "Livestock Sales",
      amount: 24000.0,
      income_date: "2026-08-20T00:00:00.000Z",
      description: "Sale of 2 young male Jamnapari goat kids",
      payment_mode: "Cash",
      created_at: "2026-08-20T11:00:00.000Z"
    },
    {
      _id: "inc_demo_006",
      farm_id: "farm_demo_001",
      field_id: null,
      crop_id: null,
      source: "Milk Sales",
      amount: 41200.0,
      income_date: "2026-08-31T00:00:00.000Z",
      description: "August dairy milk collection billing settlement",
      payment_mode: "Bank Transfer",
      created_at: "2026-08-31T17:00:00.000Z"
    }
  ],

  notifications: [
    {
      _id: "notif_demo_001",
      title: "Tomato Crop Ready for Harvest",
      message: "Field 'Hill Crest Plot 1' has 4.0 acres of Shivam Tomato ready for optimal picking. Current mandi price is ₹34/kg.",
      type: "crop_reminder",
      priority: "high",
      is_read: false,
      created_at: "2026-10-05T06:30:00.000Z"
    },
    {
      _id: "notif_demo_002",
      title: "Vaccination Due: Gir Cow (COW-001)",
      message: "Foot & Mouth Disease (FMD) booster dose is due on Oct 14, 2026. Schedule vet visit with Dr. Swaminathan.",
      type: "livestock_alert",
      priority: "high",
      is_read: false,
      created_at: "2026-10-04T08:00:00.000Z"
    },
    {
      _id: "notif_demo_003",
      title: "Paddy Harvest Approaching",
      message: "Ponni Traditional Rice in 'River Basin Wetland' (Thanjavur) reaches full maturity in 13 days. Plan combine harvester booking.",
      type: "crop_reminder",
      priority: "medium",
      is_read: false,
      created_at: "2026-10-03T11:00:00.000Z"
    },
    {
      _id: "notif_demo_004",
      title: "Quarterly Financial Profit Milestone",
      message: "Your farms generated a net profit of ₹2,20,000+ over the past 3 months. View your detailed financial report.",
      type: "finance_alert",
      priority: "low",
      is_read: true,
      created_at: "2026-10-01T15:20:00.000Z"
    }
  ],

  conversations: [
    {
      id: "conv_demo_001",
      title: "Farm & Crop Overview",
      title_source: "auto",
      created_at: "2026-10-05T08:00:00.000Z",
      updated_at: "2026-10-05T08:05:00.000Z"
    }
  ],

  messages: [
    {
      id: "msg_demo_001",
      conversation_id: "conv_demo_001",
      role: "user",
      content: "What farms and crops do I currently have?",
      created_at: "2026-10-05T08:00:00.000Z"
    },
    {
      id: "msg_demo_002",
      conversation_id: "conv_demo_001",
      role: "assistant",
      content: "Hello! Here is an overview of your farms and active crops:\n\n**1. Green Valley Organics (Coimbatore - 25.0 Acres)**\n- Groundnut (Kadiri-6) - 6.0 acres, Growing stage\n- Sugarcane (Co 86032) - 8.0 acres, Planted stage\n- Dairy Herd (Gir & Sahiwal cows)\n\n**2. Cauvery Delta Agro (Thanjavur - 18.5 Acres)**\n- Rice (Ponni Traditional) - 12.0 acres, **Ready for harvest**\n- Banana (Grand Naine) - 6.5 acres, Growing stage\n\n**3. Vanniar Highlands Agro (Dindigul - 12.0 Acres)**\n- Tomato (Shivam F1 Hybrid) - 4.0 acres, **Ready for harvest**\n- Black Gram - 6.0 acres planned\n\nTwo crops are ready for harvest right now: **Rice** and **Tomato**.",
      created_at: "2026-10-05T08:01:00.000Z"
    }
  ],

  settings: {
    currency: "INR",
    currency_symbol: "₹",
    locale: "en-IN",
    user: {
      _id: "user_demo_001",
      name: "Ramesh Kumar",
      email: "ramesh.farmer@agriflow.demo",
      role: "Farmer"
    }
  }
};
