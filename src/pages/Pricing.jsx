import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, X, Crown, Zap, Building2, Sparkles, CreditCard, ArrowRight, ChevronDown, ChevronUp, Globe } from 'lucide-react'
import useStore from '../store'

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1, label: 'USD ($)' },
  { code: 'IDR', symbol: 'Rp', rate: 16200, label: 'IDR (Rp)' },
  { code: 'EUR', symbol: '€', rate: 0.92, label: 'EUR (€)' },
]

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    desc: 'Try FIT-CHECK AI risk-free',
    monthlyUSD: 0,
    yearlyUSD: 0,
    credits: 10,
    icon: Sparkles,
    featured: false,
    dark: false,
    cta: 'Get started free',
    features: [
      { text: '10 product checks', included: true },
      { text: 'Basic Skin DNA scan', included: true },
      { text: 'Color harmony check', included: true },
      { text: 'Virtual Try-On (Apparel)', included: true },
      { text: 'Makeup & Hair preview', included: false },
      { text: 'Alternative suggestions', included: false },
      { text: 'Export reports (PDF)', included: false },
      { text: 'Priority API access', included: false },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    desc: 'For casual shoppers',
    monthlyUSD: 9,
    yearlyUSD: 7,
    credits: 100,
    icon: Zap,
    featured: false,
    dark: false,
    cta: 'Start free trial',
    badge: null,
    features: [
      { text: '100 product checks/mo', included: true },
      { text: 'Full Skin DNA scan (14 markers)', included: true },
      { text: 'Color harmony check', included: true },
      { text: 'Virtual Try-On (Apparel)', included: true },
      { text: 'Makeup & Hair preview', included: true },
      { text: 'Alternative suggestions', included: true },
      { text: 'Export reports (PDF)', included: false },
      { text: 'Priority API access', included: false },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Business',
    desc: 'For power shoppers & influencers',
    monthlyUSD: 29,
    yearlyUSD: 24,
    credits: 500,
    icon: Crown,
    featured: true,
    dark: false,
    cta: 'Start free trial',
    badge: 'MOST POPULAR',
    features: [
      { text: '500 product checks/mo', included: true },
      { text: 'Full Skin DNA scan (14 markers)', included: true },
      { text: 'Color harmony + fabric safety', included: true },
      { text: 'Virtual Try-On (All modes)', included: true },
      { text: 'Makeup & Hair preview', included: true },
      { text: 'Smart alternative suggestions', included: true },
      { text: 'Export reports (PDF)', included: true },
      { text: 'Priority API access', included: true },
      { text: 'Custom integrations', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    desc: 'For brands & e-commerce platforms',
    monthlyUSD: 99,
    yearlyUSD: 79,
    credits: 99999,
    icon: Building2,
    featured: false,
    dark: true,
    cta: 'Contact sales',
    features: [
      { text: 'Unlimited product checks', included: true },
      { text: 'Full Skin DNA scan (14 markers)', included: true },
      { text: 'All analysis modes', included: true },
      { text: 'Virtual Try-On (All modes)', included: true },
      { text: 'Makeup & Hair preview', included: true },
      { text: 'Smart alternative suggestions', included: true },
      { text: 'Export reports (PDF + API)', included: true },
      { text: 'Priority API access', included: true },
      { text: 'Custom integrations + webhooks', included: true },
    ],
  },
]

const COMPARISON_FEATURES = [
  { category: 'Core', items: [
    { name: 'Product checks', free: '10 total', starter: '100/mo', pro: '500/mo', enterprise: 'Unlimited' },
    { name: 'Skin DNA scan', free: 'Basic', starter: 'Full (14)', pro: 'Full (14)', enterprise: 'Full (14)' },
    { name: 'Color harmony', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Fabric safety', free: false, starter: true, pro: true, enterprise: true },
  ]},
  { category: 'Try-On', items: [
    { name: 'Apparel VTO', free: true, starter: true, pro: true, enterprise: true },
    { name: 'Makeup preview', free: false, starter: true, pro: true, enterprise: true },
    { name: 'Hair color preview', free: false, starter: true, pro: true, enterprise: true },
  ]},
  { category: 'Intelligence', items: [
    { name: 'Alternative suggestions', free: false, starter: true, pro: true, enterprise: true },
    { name: 'Trend analysis', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Export (PDF)', free: false, starter: false, pro: true, enterprise: true },
    { name: 'API access', free: false, starter: false, pro: true, enterprise: true },
    { name: 'Webhooks', free: false, starter: false, pro: false, enterprise: true },
  ]},
]

const FAQ = [
  { q: 'What counts as a "product check"?', a: 'Each time you paste a product URL or upload a product photo and receive a verdict (BUY/SKIP), that counts as one check. Re-viewing a past check does not consume credits.' },
  { q: 'Can I change plans later?', a: 'Yes! You can upgrade or downgrade at any time. If you upgrade mid-cycle, we prorate the difference. Downgrades take effect at the next billing cycle.' },
  { q: 'Is my skin data stored securely?', a: 'Your Skin DNA data is stored locally on your device using browser localStorage. We never upload or store your selfie photos on our servers. The analysis runs through YouCam\'s encrypted API pipeline.' },
  { q: 'What stores are supported?', a: 'FIT-CHECK AI works with any online store — Shopee, Tokopedia, Zalora, ZARA, H&M, UNIQLO, SHEIN, TikTok Shop, ASOS, and more. You can also upload product screenshots directly.' },
  { q: 'How accurate is the skin analysis?', a: 'Our skin analysis is powered by YouCam\'s dermatologist-grade AI, which analyzes 14 skin markers including the Fitzpatrick scale, undertone, and individual concerns. Accuracy improves with better photo quality and lighting.' },
]

function formatCurrency(usdAmount, currency) {
  const cur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
  const converted = usdAmount * cur.rate
  if (cur.code === 'IDR') return `Rp ${Math.round(converted).toLocaleString('id-ID')}`
  if (cur.code === 'EUR') return `€${converted.toFixed(2)}`
  return `$${converted.toFixed(2)}`
}

export default function Pricing() {
  const navigate = useNavigate()
  const { setPlan, setCurrency: setStoreCurrency, plan: currentPlan } = useStore()
  const [billing, setBilling] = useState('yearly')
  const [currency, setCurrency] = useState('USD')
  const [openFaq, setOpenFaq] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(null)

  const handleSelectPlan = async (plan) => {
    if (plan.id === 'free') {
      setPlan('free')
      navigate('/scan')
      return
    }

    // Demo Stripe checkout simulation
    setCheckoutLoading(plan.id)
    const cur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0]
    setStoreCurrency(cur.code, cur.rate)

    // Simulate Stripe redirect
    await new Promise(r => setTimeout(r, 2000))
    setPlan(plan.id === 'enterprise' ? 'enterprise' : plan.id === 'pro' ? 'pro' : 'pro')
    setCheckoutLoading(null)

    // Show "success" and redirect
    navigate('/scan')
  }

  const yearSavings = 15

  return (
    <div className="bg-canvas">
      {/* Hero */}
      <section className="bg-canvas pt-section-lg pb-section">
        <div className="container-marketing text-center">
          <div className="badge-tag-yellow mb-6 mx-auto">
            <CreditCard className="w-3.5 h-3.5" /> Simple, transparent pricing
          </div>
          <h1 className="text-h2 sm:text-disp-lg lg:text-h1 text-ink-deep">
            Start free. Upgrade when ready.
          </h1>
          <p className="mt-4 text-subtitle text-slate max-w-lg mx-auto">
            10 free checks — no signup, no credit card. Upgrade for unlimited AI-powered shopping.
          </p>

          {/* Billing toggle + Currency */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Monthly / Yearly toggle */}
            <div className="bg-surface rounded-pill p-[4px] flex">
              <button onClick={() => setBilling('monthly')}
                className={`px-md py-xs rounded-pill text-btn font-medium transition-colors duration-150 ${
                  billing === 'monthly' ? 'bg-ink text-on-dark' : 'text-steel'
                }`}>
                Monthly
              </button>
              <button onClick={() => setBilling('yearly')}
                className={`px-md py-xs rounded-pill text-btn font-medium transition-colors duration-150 flex items-center gap-1 ${
                  billing === 'yearly' ? 'bg-ink text-on-dark' : 'text-steel'
                }`}>
                Annual <span className="badge-discount ml-1">Save {yearSavings}%</span>
              </button>
            </div>

            {/* Currency selector */}
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-stone" />
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value)
                  const cur = CURRENCIES.find(c => c.code === e.target.value)
                  if (cur) setStoreCurrency(cur.code, cur.rate)
                }}
                className="text-input !w-auto !h-auto !py-xs !px-sm !rounded-pill text-caption-bold"
              >
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards — 4-tier row */}
      <section className="container-marketing pb-section">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => {
            const price = billing === 'yearly' ? plan.yearlyUSD : plan.monthlyUSD
            const isCurrentPlan = plan.id === currentPlan
            const cardClass = plan.dark ? 'pricing-card-enterprise' :
                              plan.featured ? 'pricing-card-featured' : 'pricing-card'

            return (
              <div key={plan.id} className={`${cardClass} relative flex flex-col`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="badge-promo">{plan.badge}</span>
                  </div>
                )}

                <div className="mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    plan.dark ? 'bg-brand-yellow' : plan.featured ? 'bg-brand-blue' : 'bg-surface'
                  }`}>
                    <plan.icon className={`w-5 h-5 ${plan.dark ? 'text-ink' : plan.featured ? 'text-on-dark' : 'text-ink'}`} />
                  </div>
                  <h3 className={`text-h4 ${plan.dark ? 'text-on-dark' : 'text-ink-deep'}`}>{plan.name}</h3>
                  <p className={`text-caption mt-1 ${plan.dark ? 'text-on-dark-muted' : 'text-slate'}`}>{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-h1 ${plan.dark ? 'text-on-dark' : 'text-ink-deep'}`}>
                      {price === 0 ? 'Free' : formatCurrency(price, currency)}
                    </span>
                    {price > 0 && <span className={`text-caption ${plan.dark ? 'text-on-dark-muted' : 'text-stone'}`}>/mo</span>}
                  </div>
                  {billing === 'yearly' && price > 0 && (
                    <p className={`text-micro mt-1 ${plan.dark ? 'text-on-dark-muted' : 'text-stone'}`}>
                      Billed annually ({formatCurrency(price * 12, currency)}/yr)
                    </p>
                  )}
                  <p className={`text-caption mt-2 ${plan.dark ? 'text-brand-yellow' : 'text-brand-blue'} font-medium`}>
                    {plan.credits === 99999 ? 'Unlimited checks' : `${plan.credits} checks${price > 0 ? '/mo' : ' total'}`}
                  </p>
                </div>

                <div className="flex-1 mb-6">
                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        {f.included ? (
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.dark ? 'text-brand-yellow' : 'text-success'}`} />
                        ) : (
                          <X className={`w-4 h-4 mt-0.5 shrink-0 ${plan.dark ? 'text-on-dark-muted' : 'text-muted'}`} />
                        )}
                        <span className={`text-body-sm ${
                          f.included
                            ? (plan.dark ? 'text-on-dark' : 'text-charcoal')
                            : (plan.dark ? 'text-on-dark-muted line-through' : 'text-muted line-through')
                        }`}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSelectPlan(plan)}
                  disabled={checkoutLoading === plan.id || isCurrentPlan}
                  className={`w-full py-[12px] font-medium text-btn rounded-pill transition-colors duration-150 flex items-center justify-center gap-2 ${
                    isCurrentPlan ? 'bg-surface text-stone cursor-default' :
                    plan.dark ? 'bg-brand-yellow text-ink active:bg-brand-yellow-deep' :
                    plan.featured ? 'bg-ink text-on-dark active:bg-charcoal' :
                    'bg-canvas text-ink border border-hairline-strong active:bg-surface'
                  }`}
                >
                  {checkoutLoading === plan.id ? (
                    <>Processing... <span className="animate-spin">⏳</span></>
                  ) : isCurrentPlan ? (
                    'Current plan'
                  ) : (
                    <>{plan.cta} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-surface-soft section-md">
        <div className="container-marketing">
          <h2 className="text-h2 text-ink-deep text-center mb-section-sm">Compare plans</h2>
          <div className="overflow-x-auto -mx-xxl px-xxl">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-hairline">
                  <th className="text-left p-md text-micro-up text-stone uppercase tracking-widest w-1/3">Feature</th>
                  {PLANS.map(p => (
                    <th key={p.id} className={`text-center p-md text-body-sm-medium ${p.featured ? 'text-brand-blue' : 'text-ink-deep'}`}>
                      {p.name}
                      {p.featured && <div className="badge-tag-purple text-micro mx-auto mt-1">Popular</div>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_FEATURES.map((cat) => (
                  <>
                    <tr key={cat.category}>
                      <td colSpan={5} className="pt-xl pb-xs px-md text-micro-up text-stone uppercase tracking-widest border-b border-hairline">
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item, j) => (
                      <tr key={j} className="border-b border-hairline-soft">
                        <td className="p-md text-body-sm text-charcoal">{item.name}</td>
                        {['free', 'starter', 'pro', 'enterprise'].map(planId => {
                          const val = item[planId]
                          return (
                            <td key={planId} className="p-md text-center">
                              {typeof val === 'boolean' ? (
                                val ? <Check className="w-4 h-4 text-success mx-auto" /> : <X className="w-4 h-4 text-muted mx-auto" />
                              ) : (
                                <span className="text-body-sm text-ink-deep">{val}</span>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-canvas section-md">
        <div className="container-marketing max-w-3xl">
          <h2 className="text-h2 text-ink-deep text-center mb-section-sm">Frequently asked questions</h2>
          <div className="space-y-0">
            {FAQ.map((faq, i) => (
              <div key={i} className="border-b border-hairline">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-xl text-left active:bg-surface-soft transition-colors duration-150"
                >
                  <span className="text-h5 text-ink-deep pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-stone shrink-0" /> : <ChevronDown className="w-5 h-5 text-stone shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-xl pb-xl">
                    <p className="text-body-md text-charcoal leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-canvas section-sm">
        <div className="container-marketing">
          <div className="bg-ink rounded-feature p-section text-center">
            <h2 className="text-h2 text-on-dark mb-4">Ready to shop smarter?</h2>
            <p className="text-subtitle text-on-dark-muted max-w-md mx-auto mb-8">
              Join thousands of smart shoppers saving money with AI-powered product checks.
            </p>
            <button onClick={() => navigate('/scan')} className="btn-on-dark px-10 py-[14px] text-body-md-medium">
              Get started free <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
