'use client';

import { useState, useEffect, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useMobile } from '@/hooks/useMobile';
import { captureFeatureAction } from '@/lib/posthogEvents';
import {
  getFXRateComparison,
  generateFXHistory,
  getRateAlerts,
  addRateAlert,
  removeRateAlert,
} from '@/lib/payments';
import {
  CURRENCIES,
  formatPaymentCurrency,
  getFXRate,
  convertAmount,
  getCurrencyInfo,
} from '@/lib/paymentConstants';
import type { FXRate, FXHistoryPoint, RateAlert } from '@/types/payments';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ArrowRightLeft, Bell, Trash2, Plus, TrendingUp } from 'lucide-react';

export default function FXRatesPage() {
  const { isMobile } = useMobile();

  // Converter state
  const [amount, setAmount] = useState('1000');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');

  // Chart state
  const [chartPair, setChartPair] = useState({ from: 'USD', to: 'INR' });
  const [chartDays, setChartDays] = useState(30);
  const [history, setHistory] = useState<FXHistoryPoint[]>([]);

  // Rate alerts
  const [alerts, setAlerts] = useState<RateAlert[]>([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertTarget, setAlertTarget] = useState('');

  // Load data
  useEffect(() => {
    setHistory(generateFXHistory(chartPair.from, chartPair.to, chartDays));
  }, [chartPair, chartDays]);

  useEffect(() => {
    setAlerts(getRateAlerts());
  }, []);

  // Computed
  const numAmount = parseFloat(amount) || 0;
  const rate = getFXRate(fromCurrency, toCurrency);
  const converted = convertAmount(numAmount, fromCurrency, toCurrency);
  const comparison = useMemo(
    () => getFXRateComparison(fromCurrency, toCurrency, numAmount),
    [fromCurrency, toCurrency, numAmount]
  );

  const providers = [
    { name: 'Wise Business', rate: comparison.wiseRate, fee: numAmount * 0.008, color: '#10b981' },
    { name: 'PayPal Business', rate: comparison.paypalRate, fee: numAmount * 0.03, color: '#3b82f6' },
    { name: 'Bank Wire (SWIFT)', rate: comparison.bankRate, fee: 35, color: '#8b5cf6' },
  ];
  // Sort by total cost ascending
  providers.sort((a, b) => {
    const costA = numAmount / a.rate * comparison.midMarket + a.fee;
    const costB = numAmount / b.rate * comparison.midMarket + b.fee;
    return costA - costB;
  });

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleAddAlert = () => {
    if (!alertTarget || parseFloat(alertTarget) <= 0) return;
    const alert: RateAlert = {
      id: `alert-${Date.now()}`,
      from: fromCurrency,
      to: toCurrency,
      targetRate: parseFloat(alertTarget),
      direction: parseFloat(alertTarget) > rate ? 'above' : 'below',
      createdAt: new Date().toISOString(),
      active: true,
    };
    addRateAlert(alert);
    setAlerts(getRateAlerts());
    setAlertTarget('');
    setShowAlertForm(false);
    captureFeatureAction('fx_rates', 'converted', { from: fromCurrency, to: toCurrency });
  };

  const handleRemoveAlert = (id: string) => {
    removeRateAlert(id);
    setAlerts(getRateAlerts());
  };

  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);

  return (
    <AppLayout>
      <div className="page-container">
        <div className="content-header">
          <h1>FX & Currency Tools</h1>
          <p>Compare exchange rates, track trends, and set rate alerts</p>
        </div>

        {/* ─── Currency Converter ──────────────────────────────── */}
        <div className="converter-card">
          <div className="converter-inputs">
            <div className="converter-field">
              <label>Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="1"
              />
            </div>
            <div className="converter-field">
              <label>From</label>
              <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </div>
            <button className="swap-btn" onClick={swapCurrencies}>
              <ArrowRightLeft size={18} />
            </button>
            <div className="converter-field">
              <label>To</label>
              <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="converter-result">
            <span className="result-amount">
              {fromInfo.flag} {formatPaymentCurrency(numAmount, fromCurrency)} = {toInfo.flag} {formatPaymentCurrency(converted, toCurrency)}
            </span>
            <span className="result-rate">Mid-market rate: 1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</span>
          </div>
        </div>

        {/* ─── Rate Comparison ─────────────────────────────────── */}
        <div className="comparison-section">
          <h2 className="section-title">Rate Comparison</h2>
          {numAmount > 0 && fromCurrency !== toCurrency ? (
            isMobile ? (
              /* Mobile: Cards */
              <div className="comparison-cards">
                {providers.map((prov, i) => {
                  const received = numAmount * prov.rate;
                  return (
                    <div key={prov.name} className={`comp-card ${i === 0 ? 'cheapest' : ''}`}>
                      {i === 0 && <span className="cheapest-badge">Best Rate</span>}
                      <span className="comp-name">{prov.name}</span>
                      <div className="comp-details">
                        <span>Rate: {prov.rate.toFixed(4)}</span>
                        <span>Fee: {formatPaymentCurrency(prov.fee, fromCurrency)}</span>
                      </div>
                      <span className="comp-received">
                        Supplier receives: {formatPaymentCurrency(received, toCurrency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Desktop: Table */
              <div className="comparison-table-wrap">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Rate</th>
                      <th>You Send</th>
                      <th>Supplier Receives</th>
                      <th>Fee</th>
                      <th>Total Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {providers.map((prov, i) => {
                      const received = numAmount * prov.rate;
                      const totalCost = numAmount + prov.fee;
                      return (
                        <tr key={prov.name} className={i === 0 ? 'best-row' : ''}>
                          <td>
                            <div className="prov-name">
                              {i === 0 && <span className="best-dot" />}
                              {prov.name}
                            </div>
                          </td>
                          <td>{prov.rate.toFixed(4)}</td>
                          <td>{formatPaymentCurrency(numAmount, fromCurrency)}</td>
                          <td className="received-cell">{formatPaymentCurrency(received, toCurrency)}</td>
                          <td>{formatPaymentCurrency(prov.fee, fromCurrency)}</td>
                          <td className="total-cell">{formatPaymentCurrency(totalCost, fromCurrency)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            <p className="comparison-hint">Enter an amount and select different currencies to compare rates</p>
          )}
        </div>

        {/* ─── Historical Rate Chart ──────────────────────────── */}
        <div className="chart-section">
          <div className="chart-header">
            <h2 className="section-title">
              <TrendingUp size={18} /> Historical Rates
            </h2>
            <div className="chart-controls">
              <select
                value={`${chartPair.from}_${chartPair.to}`}
                onChange={(e) => {
                  const [from, to] = e.target.value.split('_');
                  setChartPair({ from, to });
                }}
              >
                <option value="USD_INR">USD / INR</option>
                <option value="EUR_INR">EUR / INR</option>
                <option value="GBP_INR">GBP / INR</option>
                <option value="AED_INR">AED / INR</option>
                <option value="CNY_INR">CNY / INR</option>
              </select>
              <div className="time-pills">
                {[
                  { days: 30, label: '30D' },
                  { days: 90, label: '90D' },
                  { days: 365, label: '1Y' },
                ].map(opt => (
                  <button
                    key={opt.days}
                    className={`time-pill ${chartDays === opt.days ? 'active' : ''}`}
                    onClick={() => setChartDays(opt.days)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-container">
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 300}>
              <LineChart data={history} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color, #e5e7eb)" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--text-muted, #9ca3af)' }}
                  tickFormatter={(val) => {
                    const d = new Date(val);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                  interval={Math.floor(history.length / (isMobile ? 4 : 8))}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--text-muted, #9ca3af)' }}
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => val.toFixed(2)}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card-bg, #fff)',
                    border: '1px solid var(--border-color, #e5e7eb)',
                    borderRadius: 8,
                    fontSize: '0.82rem',
                  }}
                  formatter={(value: number) => [`${value.toFixed(4)}`, 'Rate']}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: '#f97316' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ─── Rate Alerts ────────────────────────────────────── */}
        <div className="alerts-section">
          <div className="alerts-header">
            <h2 className="section-title"><Bell size={18} /> Rate Alerts</h2>
            <button className="add-alert-btn" onClick={() => setShowAlertForm(!showAlertForm)}>
              <Plus size={16} /> New Alert
            </button>
          </div>

          {showAlertForm && (
            <div className="alert-form">
              <span className="alert-form-label">
                Alert me when 1 {fromCurrency} reaches:
              </span>
              <div className="alert-form-row">
                <input
                  type="number"
                  value={alertTarget}
                  onChange={(e) => setAlertTarget(e.target.value)}
                  placeholder={rate.toFixed(2)}
                  step="0.01"
                />
                <span className="alert-form-currency">{toCurrency}</span>
                <button className="btn-save-alert" onClick={handleAddAlert}>Save</button>
              </div>
            </div>
          )}

          {alerts.length === 0 ? (
            <p className="no-alerts">No rate alerts set. Create one to get notified when rates reach your target.</p>
          ) : (
            <div className="alerts-list">
              {alerts.map(alert => (
                <div key={alert.id} className="alert-item">
                  <div className="alert-info">
                    <span className="alert-pair">{alert.from} / {alert.to}</span>
                    <span className="alert-target">
                      Target: {alert.targetRate.toFixed(4)} ({alert.direction})
                    </span>
                  </div>
                  <button className="alert-remove" onClick={() => handleRemoveAlert(alert.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-container { max-width: 1000px; padding: 20px; }
        .content-header { margin-bottom: 24px; }
        .content-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin: 0 0 6px; }
        .content-header p { font-size: 0.9rem; color: var(--text-secondary); margin: 0; }
        .section-title { font-size: 1.05rem; color: var(--text-primary); font-weight: 600; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }

        /* Converter */
        .converter-card {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 16px; padding: 24px; margin-bottom: 28px;
        }
        .converter-inputs { display: flex; gap: 14px; align-items: flex-end; margin-bottom: 20px; }
        .converter-field { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .converter-field label { font-size: 0.78rem; color: var(--text-secondary); font-weight: 500; }
        .converter-field input, .converter-field select {
          padding: 12px 14px; border: 2px solid var(--border-color); border-radius: 10px;
          font-size: 0.92rem; color: var(--text-primary); background: var(--bg-secondary, #fff);
        }
        .converter-field input:focus, .converter-field select:focus { outline: none; border-color: var(--accent-primary, #f97316); }
        .swap-btn {
          width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--border-color);
          background: var(--bg-secondary, #fff); color: var(--text-secondary); cursor: pointer;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: all 0.15s;
        }
        .swap-btn:hover { border-color: var(--accent-primary, #f97316); color: var(--accent-primary, #f97316); }

        .converter-result { text-align: center; }
        .result-amount { display: block; font-size: 1.4rem; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
        .result-rate { font-size: 0.82rem; color: var(--text-muted); }

        /* Comparison */
        .comparison-section { margin-bottom: 28px; }
        .comparison-hint { color: var(--text-muted); font-size: 0.88rem; }

        /* Table */
        .comparison-table-wrap {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 12px; overflow: hidden;
        }
        .comparison-table { width: 100%; border-collapse: collapse; }
        .comparison-table th {
          text-align: left; padding: 12px 18px; background: var(--bg-tertiary);
          color: var(--text-secondary); font-size: 0.8rem; font-weight: 600;
        }
        .comparison-table td { padding: 14px 18px; border-bottom: 1px solid var(--border-color); font-size: 0.88rem; color: var(--text-primary); }
        .comparison-table tr:last-child td { border-bottom: none; }
        .best-row { background: rgba(16, 185, 129, 0.04); }
        .prov-name { display: flex; align-items: center; gap: 8px; font-weight: 500; }
        .best-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; }
        .received-cell { font-weight: 600; color: var(--text-primary); }
        .total-cell { font-weight: 600; }

        /* Cards (mobile) */
        .comparison-cards { display: flex; flex-direction: column; gap: 12px; }
        .comp-card {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 12px; padding: 16px; position: relative;
        }
        .comp-card.cheapest { border-color: #10b981; }
        .cheapest-badge {
          position: absolute; top: -8px; right: 12px;
          background: #10b981; color: white; font-size: 0.68rem; font-weight: 600;
          padding: 2px 8px; border-radius: 6px;
        }
        .comp-name { font-size: 0.92rem; font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 6px; }
        .comp-details { display: flex; gap: 16px; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px; }
        .comp-received { font-size: 0.88rem; font-weight: 600; color: var(--accent-primary, #f97316); }

        /* Chart */
        .chart-section { margin-bottom: 28px; }
        .chart-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 16px; }
        .chart-controls { display: flex; gap: 10px; align-items: center; }
        .chart-controls select {
          padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 8px;
          background: var(--bg-secondary, #fff); color: var(--text-primary); font-size: 0.84rem;
        }
        .time-pills { display: flex; gap: 4px; }
        .time-pill {
          padding: 6px 14px; border-radius: 8px; border: 1px solid var(--border-color);
          background: var(--bg-secondary, #fff); color: var(--text-secondary);
          font-size: 0.78rem; font-weight: 600; cursor: pointer; transition: all 0.15s;
        }
        .time-pill.active { background: var(--accent-primary, #f97316); color: white; border-color: var(--accent-primary, #f97316); }
        .chart-container {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 12px; padding: 16px;
        }

        /* Alerts */
        .alerts-section {
          background: var(--card-bg, var(--bg-secondary, #fff)); border: 1px solid var(--border-color);
          border-radius: 16px; padding: 24px;
        }
        .alerts-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .add-alert-btn {
          display: flex; align-items: center; gap: 6px;
          background: var(--bg-tertiary); border: none; padding: 8px 16px;
          border-radius: 8px; color: var(--text-primary); cursor: pointer;
          font-size: 0.84rem; font-weight: 500;
        }
        .add-alert-btn:hover { background: var(--accent-primary, #f97316); color: white; }

        .alert-form {
          background: var(--bg-tertiary); border-radius: 10px; padding: 16px; margin-bottom: 16px;
        }
        .alert-form-label { font-size: 0.85rem; color: var(--text-secondary); display: block; margin-bottom: 10px; }
        .alert-form-row { display: flex; gap: 10px; align-items: center; }
        .alert-form-row input {
          flex: 1; padding: 10px 12px; border: 2px solid var(--border-color); border-radius: 8px;
          font-size: 0.9rem; color: var(--text-primary); background: var(--bg-secondary, #fff);
        }
        .alert-form-currency { font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; }
        .btn-save-alert {
          padding: 10px 18px; background: var(--accent-primary, #f97316); color: white;
          border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 0.85rem;
        }

        .no-alerts { color: var(--text-muted); font-size: 0.85rem; }
        .alerts-list { display: flex; flex-direction: column; gap: 8px; }
        .alert-item {
          display: flex; justify-content: space-between; align-items: center;
          padding: 12px 14px; background: var(--bg-tertiary); border-radius: 10px;
        }
        .alert-info { display: flex; flex-direction: column; }
        .alert-pair { font-size: 0.88rem; font-weight: 600; color: var(--text-primary); }
        .alert-target { font-size: 0.78rem; color: var(--text-secondary); }
        .alert-remove {
          background: none; border: none; color: var(--text-muted); cursor: pointer;
          padding: 6px; border-radius: 6px;
        }
        .alert-remove:hover { color: #ef4444; }

        @media (max-width: 768px) {
          .page-container { padding: 14px; padding-bottom: 100px; }
          .content-header h1 { font-size: 1.25rem; }
          .converter-card { padding: 16px; }
          .converter-inputs { flex-direction: column; gap: 8px; }
          .converter-field { width: 100%; }
          .converter-field input, .converter-field select { width: 100%; padding: 12px; font-size: 0.95rem; }
          .swap-btn { align-self: center; width: 38px; height: 38px; margin: 2px 0; }
          .converter-result { margin-top: 4px; }
          .result-amount { font-size: 1.1rem; }
          .result-rate { font-size: 0.78rem; }
          .section-title { font-size: 0.95rem; margin-bottom: 12px; }
          .chart-header { flex-direction: column; align-items: flex-start; gap: 8px; }
          .chart-controls { width: 100%; justify-content: space-between; }
          .chart-controls select { flex: 1; font-size: 0.8rem; padding: 6px 8px; }
          .chart-container { padding: 10px; }
          .alerts-section { padding: 16px; }
          .alerts-header { margin-bottom: 12px; }
          .alert-form { padding: 12px; }
          .alert-form-row { flex-wrap: wrap; }
          .alert-form-row input { min-width: 0; }
          .comparison-section { margin-bottom: 20px; }
          .chart-section { margin-bottom: 20px; }
        }
        @media (max-width: 480px) {
          .page-container { padding: 12px; padding-bottom: 100px; }
          .converter-card { padding: 12px; }
          .converter-field input, .converter-field select { padding: 10px; font-size: 0.9rem; }
          .result-amount { font-size: 1rem; }
          .time-pill { padding: 6px 10px; font-size: 0.72rem; }
          .comp-card { padding: 12px; }
          .add-alert-btn { padding: 6px 12px; font-size: 0.8rem; }
        }
      `}</style>
    </AppLayout>
  );
}
