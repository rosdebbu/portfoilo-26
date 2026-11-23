import { useEffect, useState, type FormEvent } from 'react';
import { Check, Copy, Loader2, Mail, Send, X } from 'lucide-react';
import { PROFILE } from '../data/portfolioData';

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

const TOPICS = ['Internship / Hiring', 'Full-Stack & AI', 'CFD / WebGL', 'Say Hello'];

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('sending');
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${PROFILE.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          _subject: `[Portfolio · ${topic}] Message from ${name.trim()}`,
          topic,
          message: message.trim(),
        }),
      });

      if (res.ok) {
        setStatus('sent');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[95] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Get in touch with Debjit Das"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#12141B] p-6 text-white shadow-2xl sm:p-8"
      >
        {/* Top bar */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={PROFILE.photo}
              alt={PROFILE.name}
              className="h-11 w-11 rounded-full object-cover object-[center_20%] ring-2 ring-[#455CE9]/60"
            />
            <div>
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#60A5FA] uppercase">Direct Message</p>
              <h3 className="font-display text-2xl font-medium tracking-tight text-white">Let’s work together</h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close contact dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {status === 'sent' ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
              <Check className="h-7 w-7" />
            </div>
            <h4 className="font-display text-2xl font-medium text-white">Message Sent!</h4>
            <p className="mx-auto mt-2 max-w-xs text-sm text-white/65">
              Thanks for reaching out — your message has been delivered straight to Debjit’s inbox.
            </p>
            <button
              type="button"
              onClick={() => {
                setStatus('idle');
                onClose();
              }}
              className="mt-6 rounded-full bg-[#455CE9] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#334BD3]"
            >
              Back to Portfolio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Topic selector */}
            <div>
              <label className="mb-2 block font-mono text-[10px] tracking-widest text-white/55 uppercase">
                What’s this about?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopic(t)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      topic === t
                        ? 'bg-[#455CE9] text-white shadow-md shadow-[#455CE9]/30'
                        : 'bg-white/6 text-white/70 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs text-white/70">
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#455CE9]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs text-white/70">
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#455CE9]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs text-white/70">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about the role, project, or CFD / AI idea..."
                className="w-full resize-none rounded-xl border border-white/12 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#455CE9]"
              />
            </div>

            {status === 'error' && (
              <p className="text-xs text-rose-400">
                Couldn’t send automatically right now — you can copy my email below or try again.
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#455CE9] py-3 text-sm font-medium text-white shadow-lg shadow-[#455CE9]/30 transition-all hover:bg-[#334BD3] disabled:opacity-60"
            >
              {status === 'sending' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending directly to inbox…</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>

            {/* Quick copy email footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 pt-4 text-xs text-white/55">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-[#60A5FA]" />
                {PROFILE.email}
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/8 px-3 py-1 text-[11px] font-medium text-white/85 transition-colors hover:bg-white/15"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied!' : 'Copy Email'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
