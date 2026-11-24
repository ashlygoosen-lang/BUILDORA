// Housing Investor Application — single source of truth for fields, conditions and validation.
// Imported by the React wizard (frontend) and by the API (backend), so both enforce the same rules.

export const PROVINCES = {
  Zambia: ['Central', 'Copperbelt', 'Eastern', 'Luapula', 'Lusaka', 'Muchinga', 'Northern', 'North-Western', 'Southern', 'Western'],
  'South Africa': ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape', 'Western Cape'],
}

const EMPY = 'emp=Employed|Both'
const EMPB = 'emp=Self-employed / business owner|Both'
const JOINT = 'tenure=Joint with spouse|Joint with another person'
const opts = (s) => s.split('|')

export const MAX_FILE_BYTES = 10 * 1024 * 1024

export const STEPS = [
  {
    title: 'Eligibility',
    desc: 'Confirm you qualify and choose how you will contribute.',
    fields: [
      { id: 'country', label: 'Country of citizenship', type: 'select', options: opts('Zambia|South Africa|Other'), required: true },
      { id: 'home', label: 'Country of the home you are applying for', type: 'text', readOnly: true, hint: 'You may only apply for a home in the country where you are a citizen.' },
      {
        id: 'type',
        label: 'How will you contribute?',
        type: 'cards',
        required: true,
        options: [
          ['Land', 'Investor – Land (landowner)', 'Contribute land or a plot. You receive one house or apartment equivalent to your current house but improved, on any floor you choose.', 'land'],
          ['Funds', 'Investor – Funds', 'Contribute money or building materials. You receive one house or apartment in the building.', 'building'],
          ['Labour', 'Investor – Labour', 'Contribute labour or volunteer on the building activities. You receive one house or apartment in the building.', 'people'],
        ],
      },
      { id: 'n1', type: 'note', label: 'How it works', items: ['Apply online and upload all documents.', 'The council housing department approves the building plan.', 'You are issued your title deed and building starts.', 'When building is finished, your home is handed over according to the approved plan.'] },
    ],
  },
  {
    title: 'Identity',
    desc: 'Details of the owner. The names you enter will appear on the title deed.',
    fields: [
      { id: 'names', label: 'Full names as they must appear on the title deed', type: 'text', required: true, full: true, hint: 'Write exactly as shown on your ID.' },
      { id: 'oname', label: 'Other names used (maiden name, aliases)', type: 'text' },
      { id: 'idno', label: 'ID number', type: 'text', required: true },
      { id: 'dob', label: 'Date of birth', type: 'date', required: true },
      { id: 'pob', label: 'Place of birth', type: 'text', required: true },
      { id: 'gender', label: 'Gender', type: 'select', options: opts('Female|Male|Other'), required: true },
      { id: 'marital', label: 'Marital status', type: 'select', options: opts('Single|Married|Divorced|Widowed'), required: true },
      { id: 'occ', label: 'Occupation', type: 'text', required: true },
      { id: 'tenure', label: 'How will the title deed be held?', type: 'select', options: opts('Sole owner|Joint with spouse|Joint with another person'), required: true },
      { id: 'coname', label: 'Co-owner full names', type: 'text', required: true, when: JOINT },
      { id: 'coid', label: 'Co-owner ID number', type: 'text', required: true, when: JOINT },
      { id: 'spc', label: 'My spouse knows about and consents to this application', type: 'check', required: true, when: 'marital=Married' },
    ],
  },
  {
    title: 'Contact',
    desc: 'How we reach you, where you live and who is in your household.',
    fields: [
      { id: 'phone', label: 'Mobile number', type: 'tel', required: true },
      { id: 'phone2', label: 'Alternative number', type: 'tel' },
      { id: 'email', label: 'Email address', type: 'email', required: true },
      { id: 'pref', label: 'Preferred contact method', type: 'select', options: opts('Phone call|WhatsApp|Email|SMS'), required: true },
      { id: 'addr', label: 'Current residential address', type: 'area', required: true },
      { id: 'city', label: 'Town / city', type: 'text', required: true },
      { id: 'prov', label: 'Province', type: 'select', options: 'provinces', required: true },
      { id: 'nok', label: 'Next of kin – full names', type: 'text', required: true },
      { id: 'nokr', label: 'Relationship', type: 'text', required: true },
      { id: 'nokp', label: 'Next of kin phone', type: 'tel', required: true },
      { id: 'hh', label: 'Household size', type: 'number', required: true, min: 1 },
      { id: 'dep', label: 'Dependants under 18', type: 'number' },
      { id: 'acc', label: 'Accessibility needs', type: 'select', options: opts('None|Ground floor needed|Wheelchair access|Other'), required: true },
      { id: 'accd', label: 'Describe your accessibility needs', type: 'area', required: true, when: 'acc=Other' },
    ],
  },
  {
    title: 'Contribution',
    desc: 'Details of what you will contribute and the home you want.',
    fields: [
      { id: 'plot', label: 'Plot / stand number', type: 'text', required: true, when: 'type=Land' },
      { id: 'size', label: 'Plot size (m²)', type: 'number', required: true, when: 'type=Land' },
      { id: 'loc', label: 'Town / suburb of the plot', type: 'text', required: true, when: 'type=Land' },
      { id: 'council', label: 'Local council / municipality', type: 'text', required: true, when: 'type=Land' },
      { id: 'ltype', label: 'Land tenure', type: 'select', options: opts('Freehold|Leasehold|Customary tenure'), required: true, when: 'type=Land' },
      { id: 'use', label: 'Current use of the plot', type: 'select', options: opts('Vacant land|Existing house|Other structure'), required: true, when: 'type=Land' },
      { id: 'curdesc', label: 'Describe your current house (bedrooms, bathrooms, floor area, condition)', type: 'area', required: true, when: 'type=Land&use=Existing house|Other structure' },
      { id: 'enc', label: 'Any mortgage, caveat or dispute on the plot?', type: 'select', options: opts('None|Mortgage|Caveat or dispute|Both'), required: true, when: 'type=Land' },
      { id: 'encd', label: 'Give details of the mortgage, caveat or dispute', type: 'area', required: true, when: 'type=Land&enc=Mortgage|Caveat or dispute|Both' },
      { id: 'gps', label: 'GPS coordinates or directions to the plot', type: 'area', when: 'type=Land' },
      { id: 'ftype', label: 'Contribution type', type: 'select', options: opts('Money|Building materials|Both'), required: true, when: 'type=Funds' },
      { id: 'fval', label: 'Estimated value (ZMW / ZAR)', type: 'number', required: true, when: 'type=Funds' },
      { id: 'fsched', label: 'Payment schedule', type: 'select', options: opts('Lump sum|Phased payments'), required: true, when: 'type=Funds' },
      { id: 'fdesc', label: 'Describe what you will contribute (amounts, materials, quantities, timing)', type: 'area', required: true, when: 'type=Funds' },
      {
        id: 'skill',
        label: 'Main skill / trade',
        type: 'select',
        options: opts('Bricklayer / mason|Carpenter / joiner|Plumber|Electrician|Painter|Plasterer / tiler|Welder / steel fixer|Roofer|Concrete / formwork|Machine operator|Architect / engineer / surveyor|Site supervisor / foreman|General labourer|Other'),
        required: true,
        when: 'type=Labour',
      },
      { id: 'level', label: 'Skill level', type: 'select', options: opts('Unskilled / trainee|Semi-skilled|Skilled / qualified|Master / professional'), required: true, when: 'type=Labour' },
      { id: 'exp', label: 'Years of experience', type: 'number', required: true, when: 'type=Labour' },
      { id: 'hrs', label: 'Hours available per week', type: 'number', required: true, when: 'type=Labour' },
      { id: 'start', label: 'Available from', type: 'date', required: true, when: 'type=Labour' },
      { id: 'tools', label: 'Do you own tools?', type: 'select', options: opts('Yes, my own full tool set|Some tools|No tools'), required: true, when: 'type=Labour' },
      { id: 'safe', label: 'Fit for physical site work?', type: 'select', options: opts('Yes, no restrictions|Yes, with some restrictions|Supervisory / light duties only'), required: true, when: 'type=Labour' },
      { id: 'refn', label: 'Reference – name', type: 'text', required: true, when: 'type=Labour' },
      { id: 'refp', label: 'Reference – phone', type: 'tel', required: true, when: 'type=Labour' },
      {
        id: 'skills',
        label: 'Other skills you can offer',
        type: 'multi',
        options: opts('Bricklaying|Plastering|Tiling|Carpentry|Plumbing|Electrical|Painting|Welding|Roofing|Concrete work|Scaffolding|Plant operation|Site security|Site catering|Record keeping|Team supervision'),
        when: 'type=Labour',
      },
      { id: 'days', label: 'Days available', type: 'multi', options: opts('Mon|Tue|Wed|Thu|Fri|Sat|Sun'), when: 'type=Labour' },
      { id: 'ldesc', label: 'Past projects, training, languages', type: 'area', when: 'type=Labour' },
      { id: 'bed', label: 'Preferred number of bedrooms', type: 'select', options: opts('1|2|3|4 or more'), required: true },
      { id: 'floor', label: 'Preferred floor', type: 'select', options: opts('Ground floor|1st floor|2nd floor|3rd floor|Top floor|No preference'), required: true, hint: 'Landowners may choose any floor. Others are allocated subject to availability.' },
    ],
  },
  {
    title: 'Finances',
    desc: 'Employment and income verification. Funds investors must prove the source of their funds.',
    fields: [
      { id: 'emp', label: 'Employment status', type: 'select', options: opts('Employed|Self-employed / business owner|Both|Retired|Unemployed|Student'), required: true, full: true },
      { id: 'empr', label: 'Employer name', type: 'text', required: true, when: EMPY },
      { id: 'job', label: 'Job title', type: 'text', required: true, when: EMPY },
      { id: 'empy', label: 'Years with this employer', type: 'number', required: true, when: EMPY },
      { id: 'inc', label: 'Gross monthly income (ZMW / ZAR)', type: 'number', required: true, when: EMPY },
      { id: 'empph', label: 'Employer phone', type: 'tel', required: true, when: EMPY },
      { id: 'bn', label: 'Business name', type: 'text', required: true, when: EMPB },
      { id: 'brn', label: 'Registration number (PACRA / CIPC)', type: 'text', required: true, when: EMPB },
      { id: 'bsec', label: 'Type of business', type: 'text', required: true, when: EMPB },
      { id: 'byrs', label: 'Years operating', type: 'number', required: true, when: EMPB },
      { id: 'bturn', label: 'Average monthly turnover (ZMW / ZAR)', type: 'number', required: true, when: EMPB },
      { id: 'baddr', label: 'Business address', type: 'text', required: true, when: EMPB },
      { id: 'n2', type: 'note', when: 'type=Funds', label: 'Source of funds', text: 'You must show where the money or materials come from.' },
      { id: 'src', label: 'Main source of funds', type: 'select', options: opts('Salary / savings|Business profits|Sale of property or asset|Inheritance|Loan / bank finance|Pension / retirement payout|Other'), required: true, when: 'type=Funds' },
      { id: 'bank', label: 'Bank name', type: 'text', required: true, when: 'type=Funds' },
      { id: 'tax', label: 'Tax number (TPIN / SARS number)', type: 'text', required: true, when: 'type=Funds' },
      { id: 'srcdesc', label: 'Explain how these funds were obtained', type: 'area', required: true, when: 'type=Funds' },
      { id: 'aml', label: 'I declare these funds come from lawful sources and consent to verification of my employment, business and bank details.', type: 'check', required: true, when: 'type=Funds' },
    ],
  },
  {
    title: 'Documents',
    desc: 'Upload clear copies. PDF, JPG or PNG, up to 10 MB each.',
    fields: [
      { id: 'd_id', label: 'ID document (NRC / SA ID / passport)', type: 'file', required: true },
      { id: 'd_photo', label: 'Passport-size photo', type: 'file', required: true },
      { id: 'd_res', label: 'Proof of residence', type: 'file', required: true },
      { id: 'd_co', label: 'Co-owner or spouse ID document', type: 'file', required: true, when: JOINT },
      { id: 'd_title', label: 'Current title deeds (must be in your name)', type: 'file', required: true, when: 'type=Land' },
      { id: 'd_diag', label: 'Survey diagram or existing building plan (optional)', type: 'file', when: 'type=Land' },
      { id: 'd_rates', label: 'Latest rates or ground rent receipt (optional)', type: 'file', when: 'type=Land' },
      { id: 'd_bank', label: 'Bank statements, last 6 months', type: 'file', required: true, when: 'type=Funds' },
      { id: 'd_funds', label: 'Proof of funds or materials (quotation, invoice, proof of deposit)', type: 'file', required: true, when: 'type=Funds' },
      { id: 'd_pay', label: 'Last 3 payslips', type: 'file', required: true, when: `type=Funds&${EMPY}` },
      { id: 'd_breg', label: 'Business registration certificate', type: 'file', required: true, when: `type=Funds&${EMPB}` },
      { id: 'd_bbank', label: 'Business bank statements, last 6 months', type: 'file', required: true, when: `type=Funds&${EMPB}` },
      { id: 'd_btax', label: 'Tax clearance or tax returns (optional)', type: 'file', when: `type=Funds&${EMPB}` },
      { id: 'd_cert', label: 'Trade certificate (optional)', type: 'file', when: 'type=Labour' },
      { id: 'd_ref', label: 'Reference letter (optional)', type: 'file', when: 'type=Labour' },
    ],
  },
  {
    title: 'Review',
    desc: 'Check everything, then sign and submit. Use Edit to change any section.',
    review: true,
    fields: [
      { id: 'c1', label: 'I confirm that all information and documents are true and that I am a citizen of the country I am applying in.', type: 'check', required: true },
      { id: 'c2', label: 'I understand that the title deed is issued only after the council housing department approves the building plan, and that my home will be handed over on completion according to the approved plan.', type: 'check', required: true },
      { id: 'c3', label: 'I consent to my information being verified with the relevant authorities.', type: 'check', required: true },
      { id: 'sig', label: 'Type your full name as signature', type: 'text', required: true, full: true },
    ],
  },
]

export const FIELDS = {}
STEPS.forEach((s, n) => s.fields.forEach((f) => (FIELDS[f.id] = { ...f, step: n })))
export const FILE_FIELDS = Object.values(FIELDS).filter((f) => f.type === 'file').map((f) => f.id)

/** values: { [id]: string | string[] | boolean }  —  files are represented by their file name. */
export const valueOf = (values, id) => {
  const v = values[id]
  if (Array.isArray(v)) return v.join(', ')
  if (v === true) return 'Yes'
  if (v === false || v == null) return ''
  return String(v).trim()
}

export function isVisible(field, values) {
  if (!field?.when) return true
  return field.when.split('&').every((cond) => {
    const [key, allowed] = cond.split('=')
    return isVisible(FIELDS[key], values) && allowed.split('|').includes(valueOf(values, key))
  })
}

export const idLabel = (country) => (country === 'Zambia' ? 'NRC number' : country === 'South Africa' ? 'South African ID number' : 'ID number')

export function optionsFor(field, values) {
  if (field.options === 'provinces') return PROVINCES[valueOf(values, 'country')] || []
  return field.options || []
}

/**
 * Validate one step. `files` maps file-field id -> { size } (browser File or upload metadata).
 * Returns { [fieldId]: message }.
 */
export function validateStep(n, values, files = {}, today = new Date()) {
  const errors = {}
  for (const f of STEPS[n].fields) {
    if (f.type === 'note' || !isVisible(f, values)) continue
    const v = f.type === 'file' ? (files[f.id] ? 'file' : '') : valueOf(values, f.id)
    if (f.required && !v) {
      errors[f.id] = f.type === 'check' ? 'Please confirm to continue.' : f.type === 'file' ? 'This document is required.' : 'This field is required.'
      continue
    }
    if (!v) continue
    if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) errors[f.id] = 'Enter a valid email address.'
    if (f.type === 'tel' && v.replace(/\D/g, '').length < 9) errors[f.id] = 'Enter a valid phone number.'
    if (f.type === 'number' && (!Number.isFinite(Number(v)) || Number(v) < (f.min ?? 0))) errors[f.id] = 'Enter a valid number.'
    if ((f.type === 'select' || f.type === 'cards') && f.id !== 'country') {
      const allowed = f.type === 'cards' ? f.options.map((o) => o[0]) : optionsFor(f, values)
      if (!allowed.includes(v)) errors[f.id] = 'Choose one of the options.'
    }
    if (f.type === 'multi') {
      const allowed = f.options
      if (!(values[f.id] || []).every((x) => allowed.includes(x))) errors[f.id] = 'Choose from the options.'
    }
    if (f.id === 'country' && !['Zambia', 'South Africa'].includes(v)) errors[f.id] = 'Only citizens of Zambia or South Africa may apply.'
    if (f.type === 'file' && files[f.id].size > MAX_FILE_BYTES) errors[f.id] = 'File is larger than 10 MB.'
    if (f.type === 'date') {
      const d = new Date(v)
      if (Number.isNaN(d.getTime()) || d.getFullYear() < 1900) errors[f.id] = 'Enter a valid date.'
      else if (f.id === 'dob') {
        const adult = new Date(today)
        adult.setFullYear(adult.getFullYear() - 18)
        if (d > adult) errors[f.id] = 'You must be 18 or older.'
      }
    }
    if (typeof v === 'string' && v.length > 5000) errors[f.id] = 'This answer is too long.'
  }
  return errors
}

/** Rows for review screens and admin: [[stepTitle, [[label, value], ...]], ...] (steps 1–6). */
export function summaryRows(values, fileNames = {}) {
  return STEPS.slice(0, 6).map((s) => [
    s.title,
    s.fields
      .filter((f) => f.type !== 'note' && isVisible(f, values))
      .map((f) => [f.id === 'idno' ? idLabel(valueOf(values, 'country')) : f.label, f.type === 'file' ? fileNames[f.id] || '—' : valueOf(values, f.id) || '—']),
  ])
}

export const APPLICATION_STATUSES = [
  'Submitted',
  'Documents verified',
  'Plan approved',
  'Title deed issued',
  'Building in progress',
  'Handed over',
  'More information needed',
  'Declined',
]
