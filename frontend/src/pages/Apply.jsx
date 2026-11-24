import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eyebrow, Icon, SplitWords, Button } from '../components/brand'
import { usePageMeta } from '../lib/api'
import { reducedMotion } from '../lib/transition'
import {
  STEPS,
  FIELDS,
  MAX_FILE_BYTES,
  isVisible,
  idLabel,
  optionsFor,
  validateStep,
  valueOf,
  summaryRows,
} from '../../../shared/application.js'

const DRAFT_KEY = 'buildora-application-draft'
const LAST = STEPS.length - 1
const input =
  'mt-2 block w-full rounded-sm border border-forest/20 bg-white px-4 py-3 text-sm outline-none transition-[border-color,box-shadow] focus:border-forest focus:shadow-[0_0_0_3px_#d1a66b25] [&[readonly]]:bg-[#f1efe7] [&[readonly]]:text-muted'
const fmtSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`)

function readDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export default function Apply() {
  usePageMeta('Apply for a home', 'Housing investor application for citizens of Zambia and South Africa — contribute land, funds or labour.')
  const [params] = useSearchParams()
  const [values, setValues] = useState(() => {
    const t = params.get('type')
    return ['Land', 'Funds', 'Labour'].includes(t) ? { type: t } : {}
  })
  const [files, setFiles] = useState({})
  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [errors, setErrors] = useState({})
  const [draft, setDraft] = useState(() => readDraft())
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [formError, setFormError] = useState('')
  const [done, setDone] = useState(null)
  const top = useRef(null)

  const country = valueOf(values, 'country')
  const derived = useMemo(() => ({ ...values, home: ['Zambia', 'South Africa'].includes(country) ? country : '' }), [values, country])

  // Reset province when the country changes and the old province no longer applies
  useEffect(() => {
    if (values.prov && !optionsFor(FIELDS.prov, values).includes(values.prov)) setValues((v) => ({ ...v, prov: '' }))
  }, [country]) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (id, v) => {
    setValues((prev) => ({ ...prev, [id]: v }))
    if (errors[id]) setErrors((e) => ({ ...e, [id]: undefined }))
  }
  const setFile = (id, file) => {
    setFiles((prev) => {
      const next = { ...prev }
      if (file) next[id] = file
      else delete next[id]
      return next
    })
    setErrors((e) => ({ ...e, [id]: file && file.size > MAX_FILE_BYTES ? 'File is larger than 10 MB.' : undefined }))
  }

  const scrollTop = () => top.current?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
  const go = (n) => {
    setDir(n >= step ? 1 : -1)
    setStep(n)
    setMaxStep((m) => Math.max(m, n))
    setNote('')
    setFormError('')
    requestAnimationFrame(scrollTop)
  }
  const focusFirstError = (errs) => {
    const first = Object.keys(errs)[0]
    if (!first) return
    requestAnimationFrame(() => {
      const el = document.querySelector(`[data-field="${first}"]`)
      el?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
      el?.querySelector('input,select,textarea')?.focus({ preventScroll: true })
    })
  }
  const check = (n) => {
    const errs = validateStep(n, derived, files)
    setErrors(errs)
    focusFirstError(errs)
    return Object.keys(errs).length === 0
  }

  const next = () => {
    if (!check(step)) return
    if (step < LAST) go(step + 1)
    else submit()
  }

  function saveDraft() {
    try {
      const keep = {}
      for (const [id, v] of Object.entries(values)) {
        const f = FIELDS[id]
        if (!f || f.type === 'file' || f.step === LAST) continue
        keep[id] = v
      }
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: keep, step, savedAt: new Date().toISOString() }))
      setNote('Draft saved on this device. Re-attach documents when you return.')
    } catch {
      setNote('Could not save a draft in this browser.')
    }
  }
  function restoreDraft() {
    if (!draft) return
    setValues(draft.values || {})
    setMaxStep(draft.step || 0)
    go(Math.min(draft.step || 0, LAST))
    setDraft(null)
  }
  function discardDraft() {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      /* ignore */
    }
    setDraft(null)
  }

  function submit() {
    for (let n = 0; n < LAST; n++) {
      const errs = validateStep(n, derived, files)
      if (Object.keys(errs).length) {
        go(n)
        setErrors(errs)
        focusFirstError(errs)
        return
      }
    }
    if (valueOf(values, 'sig').toLowerCase() !== valueOf(values, 'names').toLowerCase()) {
      const errs = { sig: 'Type your full names exactly as entered in step 2.' }
      setErrors(errs)
      focusFirstError(errs)
      return
    }
    const fd = new FormData()
    fd.append('data', JSON.stringify(values))
    for (const [id, file] of Object.entries(files)) if (isVisible(FIELDS[id], derived)) fd.append(id, file)

    setSubmitting(true)
    setProgress(0)
    setFormError('')
    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/applications')
    xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100))
    xhr.onload = () => {
      setSubmitting(false)
      let data = {}
      try {
        data = JSON.parse(xhr.responseText)
      } catch {
        /* ignore */
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          localStorage.removeItem(DRAFT_KEY)
        } catch {
          /* ignore */
        }
        setDone({ reference: data.reference, at: new Date() })
        requestAnimationFrame(scrollTop)
        return
      }
      setFormError(data.error || 'We could not submit your application. Please try again.')
      if (Number.isInteger(data.step) && data.errors) {
        go(data.step)
        setErrors(data.errors)
        focusFirstError(data.errors)
      }
    }
    xhr.onerror = () => {
      setSubmitting(false)
      setFormError('Network problem — your application was not sent. Check your connection and try again.')
    }
    xhr.send(fd)
  }

  if (done) return <Success reference={done.reference} values={derived} files={files} at={done.at} />

  const S = STEPS[step]
  const fileNames = Object.fromEntries(Object.entries(files).map(([k, f]) => [k, f.name]))

  return (
    <main className="apply-page">
      <section className="page-intro mx-auto max-w-[1240px] px-6 pb-10 pt-16 md:pt-20">
        <Eyebrow>Housing investor application</Eyebrow>
        <h1 className="font-heading max-w-3xl text-4xl leading-[1.15] font-semibold tracking-[-2px] md:text-[56px]">
          <SplitWords>Apply for a home. Build it together.</SplitWords>
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">
          For citizens of Zambia and South Africa applying for a home in their own country. Contribute land, funds or labour, and
          receive a home in the completed building. Complete the 7 steps below — it takes about 15 minutes.
        </p>
      </section>

      <div ref={top} className="mx-auto grid max-w-[1240px] scroll-mt-24 gap-8 px-6 pb-24 lg:grid-cols-[260px_1fr]">
        {/* Step navigator */}
        <aside className="min-w-0 lg:sticky lg:top-24 lg:h-fit">
          <ol className="apply-stepper flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0" aria-label="Application progress">
            {STEPS.map((s, i) => {
              const state = i === step ? 'current' : i < step || i < maxStep ? 'done' : 'todo'
              return (
                <li key={s.title} className="shrink-0">
                  <button
                    type="button"
                    disabled={i > maxStep || submitting}
                    onClick={() => go(i)}
                    aria-current={i === step ? 'step' : undefined}
                    data-state={state}
                    className="apply-step-btn group flex w-full items-center gap-3 rounded-full border border-forest/15 bg-white/60 py-2 pl-2 pr-4 text-left text-xs transition-colors disabled:cursor-default disabled:opacity-45 lg:rounded-md lg:border-transparent lg:bg-transparent lg:py-2.5"
                  >
                    <span className="apply-step-num flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-forest/20 text-[11px] font-semibold">
                      {state === 'done' ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className={`${i === step ? 'inline' : 'hidden'} font-medium sm:inline`}>{s.title}</span>
                  </button>
                </li>
              )
            })}
          </ol>
          <div className="mt-6 hidden rounded bg-forest p-6 text-white lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[2px] text-gold">Need help?</p>
            <p className="mt-3 text-xs leading-6 text-white/70">
              Have your ID, proof of residence and the documents for your contribution type ready before you start. You can save a draft
              at any step.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          {draft && (
            <div className="mb-5 flex flex-wrap items-center gap-4 rounded bg-gold/15 px-5 py-4 text-sm">
              <span>A saved draft was found on this device.</span>
              <button type="button" onClick={restoreDraft} className="rounded-sm bg-forest px-4 py-2 text-xs font-medium text-white">
                Restore draft
              </button>
              <button type="button" onClick={discardDraft} className="text-xs underline">
                Discard
              </button>
            </div>
          )}

          <div className="mb-6 h-[3px] overflow-hidden rounded bg-forest/10" role="progressbar" aria-valuemin={1} aria-valuemax={7} aria-valuenow={step + 1}>
            <span className="apply-progress block h-full bg-gold" style={{ '--p': (step + 1) / STEPS.length }} />
          </div>

          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault()
              next()
            }}
          >
            <section key={step} data-dir={dir} className="apply-panel rounded bg-white p-6 shadow-[0_30px_60px_-40px_#183b3540] md:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#8e7857]">
                Step {step + 1} of {STEPS.length}
              </p>
              <h2 className="font-heading mt-2 text-[28px] font-semibold tracking-[-1px]">{S.title}</h2>
              <p className="mt-1 text-sm text-muted">{S.desc}</p>

              {S.review && <Review values={derived} fileNames={fileNames} onEdit={go} />}

              <div className="mt-4 grid gap-x-5 md:grid-cols-2">
                {S.fields.map((f) =>
                  isVisible(f, derived) ? (
                    <Field
                      key={f.id}
                      f={f}
                      values={derived}
                      error={errors[f.id]}
                      file={files[f.id]}
                      onChange={(v) => set(f.id, v)}
                      onFile={(file) => setFile(f.id, file)}
                    />
                  ) : null,
                )}
              </div>
            </section>

            {formError && (
              <p role="alert" className="mt-4 rounded border border-red-700/20 bg-red-50 px-4 py-3 text-sm text-red-800">
                {formError}
              </p>
            )}
            {submitting && (
              <div className="mt-4" aria-live="polite">
                <div className="h-1.5 overflow-hidden rounded bg-forest/10">
                  <span className="block h-full bg-forest transition-[width] duration-300" style={{ width: `${progress}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted">Uploading your application and documents… {progress}%</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => go(step - 1)}
                className={`rounded-sm border border-forest/25 px-6 py-3.5 text-xs font-semibold transition-colors hover:bg-forest/5 ${step ? '' : 'invisible'}`}
                disabled={submitting}
              >
                ← Back
              </button>
              <div className="flex flex-1 flex-col items-center gap-1 text-center">
                <button type="button" onClick={saveDraft} className="text-xs font-semibold text-forest underline decoration-gold underline-offset-4" disabled={submitting}>
                  Save draft
                </button>
                <span className="min-h-4 text-[11px] text-muted" aria-live="polite">
                  {note}
                </span>
              </div>
              <button
                type="submit"
                data-magnetic
                disabled={submitting}
                className="motion-button inline-flex items-center gap-3 rounded-sm bg-forest px-7 py-3.5 text-xs font-semibold text-white disabled:opacity-60"
              >
                {submitting && <span className="motion-spinner" aria-hidden="true" />}
                {step === LAST ? 'Submit application' : step === LAST - 1 ? 'Review' : 'Continue'}
                {!submitting && <Icon className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

function Field({ f, values, error, file, onChange, onFile }) {
  const full = ['cards', 'multi', 'check', 'area', 'file', 'note'].includes(f.type) || f.full
  const label = f.id === 'idno' ? idLabel(valueOf(values, 'country')) : f.label
  const v = values[f.id]
  const wrap = `apply-field ${full ? 'md:col-span-2' : ''} mt-5`
  const err = error ? (
    <p className="mt-1.5 text-xs text-red-700" id={`${f.id}-err`}>
      {error}
    </p>
  ) : null
  const req = f.required ? <span className="text-red-700"> *</span> : null
  const aria = { 'aria-invalid': !!error || undefined, 'aria-describedby': error ? `${f.id}-err` : undefined }
  const bad = error ? '!border-red-700' : ''

  if (f.type === 'note')
    return (
      <div className={`${wrap} rounded border-l-2 border-gold bg-[#f6f3ec] px-5 py-4 text-sm`}>
        <p className="font-heading font-semibold">{f.label}</p>
        {f.items ? (
          <ol className="mt-3 grid gap-2 sm:grid-cols-2">
            {f.items.map((t, i) => (
              <li key={t} className="flex gap-3 text-xs leading-5 text-muted">
                <span className="font-heading text-sm font-semibold text-gold">0{i + 1}</span>
                {t}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-1 text-xs text-muted">{f.text}</p>
        )}
      </div>
    )

  if (f.type === 'cards')
    return (
      <fieldset className={wrap} data-field={f.id}>
        <legend className="text-xs font-medium">
          {label}
          {req}
        </legend>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {f.options.map(([val, title, desc, icon]) => (
            <label
              key={val}
              data-on={v === val}
              className={`apply-card relative flex cursor-pointer flex-col rounded border bg-[#f6f3ec] p-5 ${v === val ? 'border-forest' : 'border-forest/15'} ${bad}`}
            >
              <input type="radio" name={f.id} value={val} checked={v === val} onChange={() => onChange(val)} className="sr-only" {...aria} />
              <span className="mb-4 flex items-center justify-between">
                <span className="apply-card-icon flex h-11 w-11 items-center justify-center rounded-full bg-white text-forest">
                  <Icon name={icon} className="h-5 w-5" />
                </span>
                <span className="apply-card-tick flex h-5 w-5 items-center justify-center rounded-full border border-forest/30">
                  <Icon name="check" className="h-3 w-3" />
                </span>
              </span>
              <span className="font-heading text-[15px] font-semibold">{title}</span>
              <span className="mt-2 text-xs leading-5 text-muted">{desc}</span>
            </label>
          ))}
        </div>
        {err}
      </fieldset>
    )

  if (f.type === 'multi') {
    const list = Array.isArray(v) ? v : []
    return (
      <fieldset className={wrap} data-field={f.id}>
        <legend className="text-xs font-medium">{label}</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {f.options.map((o) => {
            const on = list.includes(o)
            return (
              <label key={o} className={`apply-chip cursor-pointer rounded-full border px-4 py-2 text-xs ${on ? 'border-forest bg-forest text-white' : 'border-forest/20 bg-white hover:bg-forest/5'}`}>
                <input type="checkbox" className="sr-only" checked={on} onChange={() => onChange(on ? list.filter((x) => x !== o) : [...list, o])} />
                {o}
              </label>
            )
          })}
        </div>
        {err}
      </fieldset>
    )
  }

  if (f.type === 'check')
    return (
      <div className={wrap} data-field={f.id}>
        <label className={`flex cursor-pointer items-start gap-3 rounded border p-4 text-[13px] leading-6 ${v ? 'border-forest/40 bg-forest/[0.03]' : 'border-forest/15'} ${bad}`}>
          <input type="checkbox" checked={!!v} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-forest" {...aria} />
          <span>
            {label}
            {req}
          </span>
        </label>
        {err}
      </div>
    )

  if (f.type === 'file')
    return (
      <div className={wrap} data-field={f.id}>
        <span className="text-xs font-medium">
          {label}
          {req}
        </span>
        <div className={`mt-2 flex flex-wrap items-center gap-4 rounded-sm border border-dashed bg-[#f6f3ec] px-4 py-4 transition-colors ${file ? 'border-forest/50' : 'border-forest/25 hover:border-gold'} ${bad}`}>
          <span className={`flex h-10 w-10 items-center justify-center rounded-full ${file ? 'bg-forest text-gold' : 'bg-white text-forest/60'}`}>
            <Icon name={file ? 'check' : 'doc'} className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1 text-sm">
            {file ? (
              <>
                <span className="block truncate font-medium">{file.name}</span>
                <span className="text-[11px] text-muted">{fmtSize(file.size)}</span>
              </>
            ) : (
              <span className="text-muted">PDF, JPG or PNG · up to 10 MB</span>
            )}
          </span>
          <label className="cursor-pointer rounded-sm bg-forest px-4 py-2 text-[11px] font-medium text-white transition-colors hover:bg-[#28574d]">
            {file ? 'Replace' : 'Choose file'}
            <input type="file" className="sr-only" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onFile(e.target.files?.[0] || null)} {...aria} />
          </label>
          {file && (
            <button type="button" onClick={() => onFile(null)} className="text-[11px] text-muted underline">
              Remove
            </button>
          )}
        </div>
        {err}
      </div>
    )

  const common = { id: f.id, name: f.id, className: `${input} ${bad}`, ...aria }
  let control
  if (f.type === 'select')
    control = (
      <select {...common} value={v || ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">{f.options === 'provinces' && !optionsFor(f, values).length ? 'Choose your country first' : 'Select…'}</option>
        {optionsFor(f, values).map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    )
  else if (f.type === 'area') control = <textarea {...common} rows={3} maxLength={5000} value={v || ''} onChange={(e) => onChange(e.target.value)} />
  else
    control = (
      <input
        {...common}
        type={{ text: 'text', number: 'number', date: 'date', tel: 'tel', email: 'email' }[f.type]}
        min={f.type === 'number' ? (f.min ?? 0) : undefined}
        inputMode={f.type === 'number' ? 'decimal' : undefined}
        readOnly={f.readOnly}
        maxLength={f.type === 'text' ? 300 : undefined}
        autoComplete={{ names: 'name', email: 'email', phone: 'tel', addr: 'street-address', city: 'address-level2' }[f.id]}
        value={v || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    )
  return (
    <div className={wrap} data-field={f.id}>
      <label htmlFor={f.id} className="text-xs font-medium">
        {label}
        {req}
      </label>
      {control}
      {f.hint && <p className="mt-1.5 text-[11px] text-muted">{f.hint}</p>}
      {err}
    </div>
  )
}

function Review({ values, fileNames, onEdit }) {
  return (
    <div className="mt-6 grid gap-4">
      {summaryRows(values, fileNames).map(([title, rows], s) => (
        <div key={title} className="overflow-hidden rounded border border-forest/12">
          <div className="flex items-center justify-between bg-[#f6f3ec] px-4 py-3">
            <span className="font-heading text-sm font-semibold">
              {s + 1}. {title}
            </span>
            <button type="button" onClick={() => onEdit(s)} className="text-xs font-semibold text-forest underline decoration-gold underline-offset-4">
              Edit
            </button>
          </div>
          <dl>
            {rows.map(([k, v]) => (
              <div key={k} className="grid gap-1 border-t border-forest/8 px-4 py-2.5 text-xs sm:grid-cols-[1fr_1.2fr] sm:gap-4">
                <dt className="text-muted">{k}</dt>
                <dd className="break-words font-medium sm:text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  )
}

function Success({ reference, values, files, at }) {
  const fileNames = Object.fromEntries(Object.entries(files).map(([k, f]) => [k, f.name]))
  const summary = [
    `Buildora — Housing Investor Application`,
    `Reference: ${reference}`,
    `Submitted: ${at.toLocaleString('en-ZA')}`,
    '',
    ...summaryRows(values, fileNames).flatMap(([t, rows], i) => [`== ${i + 1}. ${t} ==`, ...rows.map(([k, v]) => `${k}: ${v}`), '']),
    `Signed: ${valueOf(values, 'sig')}`,
  ].join('\n')
  const [copied, setCopied] = useState(false)
  return (
    <main className="page-intro mx-auto max-w-[900px] px-6 pb-24 pt-16 md:pt-24">
      <div className="apply-success rounded bg-white p-8 shadow-[0_30px_60px_-40px_#183b3540] md:p-12">
        <span className="apply-success-mark mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest text-gold">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#8e7857]">Application received</p>
        <h1 className="font-heading mt-2 text-4xl font-semibold tracking-[-1.5px]">Thank you, {valueOf(values, 'names').split(' ')[0]}.</h1>
        <p className="mt-4 text-sm leading-7 text-muted">
          Your application and documents have been securely submitted. Keep your reference number — you will need it whenever you contact
          us about your application.
        </p>
        <p className="mt-6 inline-flex flex-wrap items-center gap-3 rounded bg-[#f6f3ec] px-5 py-3 text-sm">
          Reference <b className="font-heading text-lg tracking-wide">{reference}</b>
        </p>

        <h2 className="font-heading mt-10 text-lg font-semibold">What happens next</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2">
          {[
            ['Verification', 'Your details and documents are verified.'],
            ['Plan approval', 'The council housing department approves the building plan.'],
            ['Title deed & building', 'Your title deed is issued and building starts.'],
            ['Handover', 'Your home is handed over on completion according to the approved plan.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4 border-t border-forest/15 pt-4">
              <span className="font-heading text-2xl text-gold">0{i + 1}</span>
              <span>
                <span className="font-heading block font-semibold">{t}</span>
                <span className="mt-1 block text-xs leading-5 text-muted">{d}</span>
              </span>
            </li>
          ))}
        </ol>

        <details className="mt-10 rounded border border-forest/12">
          <summary className="cursor-pointer px-5 py-4 text-sm font-semibold">View your application summary</summary>
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words border-t border-forest/10 bg-[#f6f3ec] px-5 py-4 font-mono text-[11px] leading-5">{summary}</pre>
        </details>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary)
                setCopied(true)
              } catch {
                setCopied(false)
              }
            }}
            className="motion-button rounded-sm bg-forest px-6 py-3.5 text-xs font-semibold text-white"
          >
            {copied ? 'Copied ✓' : 'Copy summary'}
          </button>
          <button type="button" onClick={() => window.print()} className="rounded-sm border border-forest/25 px-6 py-3.5 text-xs font-semibold hover:bg-forest/5">
            Print / save as PDF
          </button>
          <Button href="/" secondary>
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  )
}
