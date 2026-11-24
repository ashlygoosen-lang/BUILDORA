import { useRef, useState } from 'react'
import { api } from '../lib/api'

export function EnquiryForm({ kind = 'General', development }) {
  const [state, setState] = useState({ success: false, error: '', reference: '' })
  const [pending, setPending] = useState(false)
  const [fileName, setFileName] = useState('')
  const form = useRef(null)
  const input =
    'mt-2 block w-full rounded-sm border border-forest/20 bg-white px-4 py-3 text-sm outline-none focus:border-forest'

  async function onSubmit(e) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const file = fd.get('document')
    if (file instanceof File && file.size > 3 * 1024 * 1024)
      return setState({ success: false, error: 'Please upload a land document smaller than 3 MB.' })
    if (file instanceof File && file.size === 0) fd.delete('document')
    setPending(true)
    try {
      const res = await api.post('/api/enquiries', fd)
      setState({ success: true, error: '', reference: res.reference || '' })
    } catch (err) {
      setState({ success: false, error: err.message || 'We could not save your enquiry. Please check the details and try again.' })
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      ref={form}
      data-reveal
      aria-busy={pending}
      onSubmit={onSubmit}
      className="motion-form grid gap-5 rounded bg-[#eeede5] p-6 md:grid-cols-2 md:p-10"
    >
      <h2 className="font-heading text-2xl font-semibold md:col-span-2">
        {kind === 'Landowner' ? 'Tell us about your land.' : 'Let’s start a conversation.'}
      </h2>
      <input type="hidden" name="kind" value={kind} />
      {development && <input type="hidden" name="development" value={development} />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {[
        ['Full name', 'fullName', 'text', 'name'],
        ['Email address', 'email', 'email', 'email'],
        ['Phone number', 'phone', 'tel', 'tel'],
      ].map(([l, n, t, ac]) => (
        <label key={n} className="text-xs">
          {l}
          {n !== 'phone' ? ' *' : ''}
          <input className={input} name={n} type={t} autoComplete={ac} required={n !== 'phone'} maxLength={150} />
        </label>
      ))}
      {kind === 'General' && (
        <label className="text-xs">
          Enquiry type
          <select className={input} name="enquiryType" defaultValue={development ? 'Investor' : 'General'}>
            {['General', 'Landowner', 'Investor', 'Partnership'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      )}
      {kind === 'Landowner' && (
        <>
          {[
            ['Land location', 'location'],
            ['Plot size (include unit)', 'plotSize'],
            ['Number of plots', 'plots'],
          ].map(([l, n]) => (
            <label key={n} className="text-xs">
              {l} *
              <input className={input} name={n} required type={n === 'plots' ? 'number' : 'text'} min="1" maxLength={250} />
            </label>
          ))}
          <label className="text-xs">
            Ownership status
            <select name="ownership" className={input}>
              {['Sole owner', 'Joint owner', 'Authorised representative', 'Other'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-xs">
            Preferred participation arrangement
            <select name="arrangement" className={input}>
              {['Discuss my options', 'Completed residential unit', 'Ownership interest', 'Financial consideration', 'Joint development'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label className="text-xs md:col-span-2">
            Ownership document (optional)
            <span className="mt-2 flex cursor-pointer items-center gap-4 rounded-sm border border-dashed border-forest/30 bg-white px-4 py-4 text-sm transition-colors hover:border-gold">
              <span className="rounded-sm bg-forest px-3 py-1.5 text-[11px] font-medium text-white">Choose file</span>
              <span className="truncate text-muted">{fileName || 'No file selected'}</span>
              <input
                className="sr-only"
                type="file"
                name="document"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
              />
            </span>
            <span className="mt-2 block text-[10px] text-muted">PDF, JPG or PNG, up to 3 MB. Stored privately for assessment only.</span>
          </label>
        </>
      )}
      <label className="text-xs md:col-span-2">
        {kind === 'Investor' ? 'Tell us about your investment interests' : 'How can we help?'}
        <textarea
          name="message"
          className={input}
          rows={4}
          maxLength={5000}
          defaultValue={development ? `I'd like to know more about ${development}.` : undefined}
        />
      </label>
      <label className="flex items-start gap-3 text-[11px] leading-5 text-muted md:col-span-2">
        <input type="checkbox" name="consent" required className="mt-1 accent-forest" />I agree that Buildora may securely store and use my
        details to assess and respond to this enquiry. Documents are accessible only to authorised staff.
      </label>
      <div className="md:col-span-2">
        <button
          disabled={pending || state.success}
          data-magnetic
          className="motion-button inline-flex items-center gap-3 rounded-sm bg-forest px-7 py-4 text-xs font-medium text-white disabled:opacity-60"
        >
          {pending && <span className="motion-spinner" aria-hidden="true" />}
          {pending
            ? 'Submitting…'
            : state.success
              ? 'Enquiry received'
              : kind === 'Landowner'
                ? 'Submit Your Land for Assessment →'
                : 'Send Enquiry →'}
        </button>
        <p role="status" key={`${state.success}-${state.error}`} className={`mt-4 text-sm ${state.success ? 'text-forest' : 'text-red-700'}`}>
          {state.success
            ? `Thank you. Your enquiry has been securely received${state.reference ? ` (reference ${state.reference})` : ''}. Our team will review your details and get in touch.`
            : state.error}
        </p>
      </div>
    </form>
  )
}
