'use client';

import { useState, useEffect, useRef, useReducer, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout';
import { useMobile } from '@/hooks/useMobile';
import { useTour } from '@/hooks/useTour';
import { costCalculatorTourSteps, mobileCostCalculatorTourSteps } from '@/lib/tourSteps';
import TourFAB from '@/components/walkthrough/TourFAB';
import {
  Calculator,
  Search,
  Ship,
  Plane,
  Truck,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Check,
  Download,
  RotateCcw,
  Save,
  History,
  Info,
  AlertCircle,
} from 'lucide-react';
import {
  searchHSNCodes,
  getDutyRates,
  getAvailableCurrencies,
} from '@/utils/calculatorUtils';
import { historyStorage } from '@/lib/historyStorage';
import {
  shippingModes,
  commonPorts,
  predefinedCharges,
} from '@/lib/calculatorConstants';
import type { CustomCharge } from '@/lib/calculatorConstants';

// ─── Types ───────────────────────────────────────────────────────

interface CalculatorResults {
  fobValueINR: number;
  freightINR: number;
  insuranceINR: number;
  cifValue: number;
  bcd: number;
  sws: number;
  igst: number;
  totalDuties: number;
  totalAdditional: number;
  totalLandedCost: number;
  costPerUnit: number;
  exchangeRate: number;
  breakdown: { label: string; value: number; color: string; percentage: number }[];
}

interface FormState {
  // Essential
  productName: string;
  hsnCode: string;
  quantity: string;
  unitPrice: string;
  currency: string;
  shippingMode: 'sea' | 'air' | 'road';
  freightCost: string;
  // Duty info from HSN
  dutyRate: number;
  igstRate: number;
  // Advanced
  weight: string;
  weightUnit: string;
  originPort: string;
  destinationPort: string;
  estimatedDays: string;
  insuranceRequired: boolean;
  insuranceRate: string;
  packingCharges: string;
  inlandFreight: string;
  bankCharges: string;
  commissionRate: string;
  customCharges: CustomCharge[];
  // UI
  showAdvanced: boolean;
  isCalculating: boolean;
  saved: boolean;
  savedId: string;
  // Results
  results: CalculatorResults | null;
}

type FormAction =
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SELECT_HSN'; code: string; dutyRate: number; igstRate: number }
  | { type: 'SET_SHIPPING_MODE'; mode: 'sea' | 'air' | 'road' }
  | { type: 'TOGGLE_ADVANCED' }
  | { type: 'TOGGLE_INSURANCE' }
  | { type: 'ADD_CHARGE'; charge: CustomCharge }
  | { type: 'REMOVE_CHARGE'; id: string }
  | { type: 'SET_CALCULATING'; value: boolean }
  | { type: 'SET_RESULTS'; results: CalculatorResults }
  | { type: 'MARK_SAVED'; id: string }
  | { type: 'RESET' };

const initialState: FormState = {
  productName: '',
  hsnCode: '',
  quantity: '',
  unitPrice: '',
  currency: 'USD',
  shippingMode: 'sea',
  freightCost: '',
  dutyRate: 10,
  igstRate: 18,
  weight: '',
  weightUnit: 'kg',
  originPort: '',
  destinationPort: '',
  estimatedDays: '30',
  insuranceRequired: false,
  insuranceRate: '0.5',
  packingCharges: '',
  inlandFreight: '',
  bankCharges: '',
  commissionRate: '',
  customCharges: [],
  showAdvanced: false,
  isCalculating: false,
  saved: false,
  savedId: '',
  results: null,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, saved: false };
    case 'SELECT_HSN':
      return { ...state, hsnCode: action.code, dutyRate: action.dutyRate, igstRate: action.igstRate, saved: false };
    case 'SET_SHIPPING_MODE': {
      const days = action.mode === 'sea' ? '30' : action.mode === 'air' ? '5' : '10';
      return { ...state, shippingMode: action.mode, estimatedDays: days, saved: false };
    }
    case 'TOGGLE_ADVANCED':
      return { ...state, showAdvanced: !state.showAdvanced };
    case 'TOGGLE_INSURANCE':
      return { ...state, insuranceRequired: !state.insuranceRequired, saved: false };
    case 'ADD_CHARGE':
      return { ...state, customCharges: [...state.customCharges, action.charge], saved: false };
    case 'REMOVE_CHARGE':
      return { ...state, customCharges: state.customCharges.filter(c => c.id !== action.id), saved: false };
    case 'SET_CALCULATING':
      return { ...state, isCalculating: action.value };
    case 'SET_RESULTS':
      return { ...state, results: action.results, isCalculating: false };
    case 'MARK_SAVED':
      return { ...state, saved: true, savedId: action.id };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
}

// ─── Exchange rates (to INR) ─────────────────────────────────────

const exchangeRates: Record<string, number> = {
  INR: 1, USD: 83.12, EUR: 90.45, GBP: 105.23,
  CNY: 11.42, JPY: 0.56, AED: 22.64, SGD: 62.15,
};

// ─── Shipping mode icons ─────────────────────────────────────────

const modeIcons: Record<string, typeof Ship> = { sea: Ship, air: Plane, road: Truck };

// ─── Right Panel (desktop only) ─────────────────────────────────

interface RightPanelProps {
  state: FormState;
  fobValue: number;
  fmt: (n: number) => string;
  fmtDetailed: (n: number) => string;
  onSave: () => void;
  onDownloadCSV: () => void;
  onReset: () => void;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function CalculatorRightPanel({ state, fobValue, fmt, fmtDetailed, onSave, onDownloadCSV, onReset }: RightPanelProps) {
  const [recentHistory, setRecentHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!state.results) {
      const all = historyStorage.getAll();
      setRecentHistory(all.slice(0, 6));
    }
  }, [state.results]);

  if (state.results) {
    const r = state.results;
    return (
      <div className="rp">
        <div className="rp-header">
          <Check size={18} className="rp-check" />
          <span>Calculation Complete</span>
        </div>

        {/* Summary Cards */}
        <div className="rp-summary">
          <div className="rp-card rp-card-primary">
            <span className="rp-card-label">Total Landed Cost</span>
            <span className="rp-card-value">{fmt(r.totalLandedCost)}</span>
          </div>
          <div className="rp-card-row">
            <div className="rp-card rp-card-sm">
              <span className="rp-card-label">Per Unit</span>
              <span className="rp-card-value-sm">{fmt(r.costPerUnit)}</span>
            </div>
            <div className="rp-card rp-card-sm">
              <span className="rp-card-label">Duties</span>
              <span className="rp-card-value-sm">{fmt(r.totalDuties)}</span>
            </div>
          </div>
        </div>

        {/* Cost Distribution */}
        <div className="rp-section">
          <h4 className="rp-section-title">Cost Distribution</h4>
          <div className="rp-bars">
            {r.breakdown.filter(b => b.value > 0).map((item, i) => (
              <div key={i} className="rp-bar-row">
                <span className="rp-bar-label">{item.label}</span>
                <div className="rp-bar-track">
                  <div className="rp-bar-fill" style={{ width: `${Math.max(item.percentage, 2)}%`, backgroundColor: item.color }} />
                </div>
                <span className="rp-bar-pct">{item.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="rp-section">
          <h4 className="rp-section-title">Breakdown</h4>
          <div className="rp-breakdown">
            <div className="rp-group">
              <div className="rp-group-title">Base Costs</div>
              <div className="rp-row"><span>FOB ({state.currency}→INR)</span><span>{fmtDetailed(r.fobValueINR)}</span></div>
              <div className="rp-row"><span>Freight</span><span>{fmtDetailed(r.freightINR)}</span></div>
              {r.insuranceINR > 0 && <div className="rp-row"><span>Insurance</span><span>{fmtDetailed(r.insuranceINR)}</span></div>}
              <div className="rp-row rp-subtotal"><span>CIF Value</span><span>{fmtDetailed(r.cifValue)}</span></div>
            </div>
            <div className="rp-group">
              <div className="rp-group-title">Duties & Taxes</div>
              <div className="rp-row"><span>BCD ({state.dutyRate}%)</span><span>{fmtDetailed(r.bcd)}</span></div>
              <div className="rp-row"><span>SWS (10%)</span><span>{fmtDetailed(r.sws)}</span></div>
              <div className="rp-row"><span>IGST ({state.igstRate}%)</span><span>{fmtDetailed(r.igst)}</span></div>
              <div className="rp-row rp-subtotal"><span>Total Duties</span><span>{fmtDetailed(r.totalDuties)}</span></div>
            </div>
            {r.totalAdditional > 0 && (
              <div className="rp-group">
                <div className="rp-group-title">Additional</div>
                <div className="rp-row rp-subtotal"><span>Total Additional</span><span>{fmtDetailed(r.totalAdditional)}</span></div>
              </div>
            )}
            <div className="rp-total">
              <span>TOTAL</span>
              <span>{fmtDetailed(r.totalLandedCost)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="rp-actions">
          <button
            type="button"
            className={`rp-btn rp-btn-save ${state.saved ? 'rp-btn-saved' : ''}`}
            onClick={onSave}
            disabled={state.saved}
          >
            {state.saved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save</>}
          </button>
          <button type="button" className="rp-btn rp-btn-dl" onClick={onDownloadCSV}>
            <Download size={16} /> CSV
          </button>
          <button type="button" className="rp-btn rp-btn-reset" onClick={onReset}>
            <RotateCcw size={16} />
          </button>
        </div>

        <style jsx>{`
          .rp { padding: 0; }
          .rp-header {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            font-size: 0.95rem;
            font-weight: 600;
            color: #059669;
            margin-bottom: 0.75rem;
          }
          .rp-header :global(.rp-check) {
            background: #ecfdf5;
            border-radius: 50%;
            padding: 2px;
          }
          .rp-summary {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1rem;
          }
          .rp-card {
            background: var(--color-surface, #fff);
            border: 1px solid var(--color-border, #e5e7eb);
            border-radius: 10px;
            padding: 0.75rem;
            text-align: center;
          }
          .rp-card-primary {
            background: linear-gradient(135deg, #f97316, #ea580c);
            border: none;
            color: #fff;
            padding: 1rem;
          }
          .rp-card-primary .rp-card-label { color: rgba(255,255,255,0.8); }
          .rp-card-primary .rp-card-value { color: #fff; font-size: 1.35rem; }
          .rp-card-label {
            display: block;
            font-size: 0.7rem;
            font-weight: 500;
            color: var(--color-text-secondary, #6b7280);
            margin-bottom: 0.15rem;
          }
          .rp-card-value {
            display: block;
            font-size: 1.1rem;
            font-weight: 700;
            color: var(--color-text, #111827);
          }
          .rp-card-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .rp-card-sm { padding: 0.6rem 0.5rem; }
          .rp-card-value-sm {
            display: block;
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--color-text, #111827);
          }
          .rp-section {
            margin-bottom: 0.75rem;
          }
          .rp-section-title {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--color-text, #111827);
            margin: 0 0 0.5rem 0;
          }
          .rp-bars {
            display: flex;
            flex-direction: column;
            gap: 0.35rem;
          }
          .rp-bar-row {
            display: grid;
            grid-template-columns: 75px 1fr 38px;
            align-items: center;
            gap: 0.35rem;
          }
          .rp-bar-label {
            font-size: 0.7rem;
            font-weight: 500;
            color: var(--color-text-secondary, #6b7280);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .rp-bar-track {
            height: 16px;
            background: var(--bg-secondary, #f3f4f6);
            border-radius: 4px;
            overflow: hidden;
          }
          .rp-bar-fill {
            height: 100%;
            border-radius: 4px;
            transition: width 0.5s ease-out;
          }
          .rp-bar-pct {
            text-align: right;
            font-size: 0.68rem;
            font-weight: 600;
            color: var(--color-text-secondary, #374151);
          }
          .rp-breakdown {
            display: flex;
            flex-direction: column;
          }
          .rp-group {
            padding-bottom: 0.4rem;
            margin-bottom: 0.4rem;
            border-bottom: 1px solid #f3f4f6;
          }
          .rp-group-title {
            font-size: 0.65rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            color: var(--color-text-secondary, #9ca3af);
            margin-bottom: 0.25rem;
          }
          .rp-row {
            display: flex;
            justify-content: space-between;
            padding: 0.2rem 0;
            font-size: 0.75rem;
            color: var(--color-text, #374151);
          }
          .rp-subtotal {
            font-weight: 600;
            border-top: 1px dashed #e5e7eb;
            padding-top: 0.25rem;
            margin-top: 0.15rem;
            color: var(--color-text, #111827);
          }
          .rp-total {
            display: flex;
            justify-content: space-between;
            padding: 0.6rem 0 0.25rem;
            font-size: 0.875rem;
            font-weight: 700;
            color: var(--color-text, #111827);
            border-top: 2px solid var(--color-text, #111827);
          }
          .rp-actions {
            display: flex;
            gap: 0.4rem;
            margin-top: 0.75rem;
          }
          .rp-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.3rem;
            padding: 0.5rem 0.65rem;
            border-radius: 8px;
            font-size: 0.78rem;
            font-weight: 500;
            cursor: pointer;
            border: none;
            transition: all 0.15s;
            min-height: 36px;
          }
          .rp-btn-save {
            flex: 1;
            background: #059669;
            color: #fff;
          }
          .rp-btn-save:hover { background: #047857; }
          .rp-btn-saved {
            background: #ecfdf5;
            color: #059669;
            cursor: default;
          }
          .rp-btn-dl {
            background: var(--color-surface, #fff);
            color: var(--color-text, #374151);
            border: 1px solid var(--color-border, #d1d5db);
          }
          .rp-btn-dl:hover { background: #f9fafb; }
          .rp-btn-reset {
            background: none;
            color: var(--color-text-secondary, #6b7280);
            padding: 0.5rem;
          }
          .rp-btn-reset:hover { background: #f3f4f6; }
        `}</style>
      </div>
    );
  }

  // No results — show recent history or empty state
  return (
    <div className="rp-empty">
      <div className="rp-empty-header">
        <Calculator size={20} />
        <span>Results</span>
      </div>

      {recentHistory.length > 0 ? (
        <>
          <p className="rp-empty-hint">Fill in the form to see results here. Recent calculations:</p>
          <div className="rp-history">
            {recentHistory.map((rec: any) => (
              <div key={rec.id} className="rp-hist-card">
                <div className="rp-hist-top">
                  <span className="rp-hist-name">{rec.input.productName}</span>
                  <span className="rp-hist-hsn">{rec.input.hsnCode}</span>
                </div>
                <div className="rp-hist-bottom">
                  <span className="rp-hist-cost">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(rec.result.totalLandedCost)}</span>
                  <span className="rp-hist-time">{timeAgo(rec.metadata.calculatedAt)}</span>
                </div>
              </div>
            ))}
          </div>
          <Link href="/cost-calculator/history" className="rp-hist-link">
            <History size={14} />
            View all history
          </Link>
        </>
      ) : (
        <div className="rp-empty-body">
          <div className="rp-empty-icon">
            <Calculator size={32} />
          </div>
          <p className="rp-empty-text">Your calculation results will appear here once you fill in the form and calculate.</p>
        </div>
      )}

      <style jsx>{`
        .rp-empty { padding: 0; }
        .rp-empty-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text, #111827);
          margin-bottom: 0.75rem;
        }
        .rp-empty-header :global(svg) {
          color: #f97316;
        }
        .rp-empty-hint {
          font-size: 0.78rem;
          color: var(--color-text-secondary, #6b7280);
          margin: 0 0 0.75rem 0;
          line-height: 1.4;
        }
        .rp-history {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          margin-bottom: 0.75rem;
        }
        .rp-hist-card {
          padding: 0.6rem 0.75rem;
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 8px;
          cursor: default;
          transition: border-color 0.15s;
        }
        .rp-hist-card:hover {
          border-color: #fed7aa;
        }
        .rp-hist-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-bottom: 0.25rem;
        }
        .rp-hist-name {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text, #111827);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }
        .rp-hist-hsn {
          font-size: 0.68rem;
          font-weight: 500;
          background: #fff7ed;
          color: #ea580c;
          padding: 0.1rem 0.4rem;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .rp-hist-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .rp-hist-cost {
          font-size: 0.82rem;
          font-weight: 700;
          color: #ea580c;
        }
        .rp-hist-time {
          font-size: 0.68rem;
          color: var(--color-text-secondary, #9ca3af);
        }
        .rp-empty :global(.rp-hist-link) {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.78rem;
          font-weight: 500;
          color: #f97316;
          text-decoration: none;
        }
        .rp-empty :global(.rp-hist-link:hover) {
          text-decoration: underline;
        }
        .rp-empty-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2rem 1rem;
        }
        .rp-empty-icon {
          width: 64px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff7ed;
          border-radius: 50%;
          margin-bottom: 1rem;
        }
        .rp-empty-icon :global(svg) {
          color: #f97316;
        }
        .rp-empty-text {
          font-size: 0.82rem;
          color: var(--color-text-secondary, #6b7280);
          line-height: 1.5;
          margin: 0;
        }
      `}</style>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────

function CostCalculatorContent() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { isMobile, isDesktop } = useMobile();
  const tourSteps = isMobile ? mobileCostCalculatorTourSteps : costCalculatorTourSteps;
  const { startTour, isActive: tourActive } = useTour({ tourId: 'cost-calculator', steps: tourSteps });

  // HSN search
  const [hsnSuggestions, setHsnSuggestions] = useState<any[]>([]);
  const [showHsnDropdown, setShowHsnDropdown] = useState(false);
  const hsnRef = useRef<HTMLDivElement>(null);

  // Port dropdowns
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');

  // Custom charge form
  const [showAddCharge, setShowAddCharge] = useState(false);
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState('');
  const [newChargeType, setNewChargeType] = useState<'fixed' | 'percentage'>('fixed');

  const currencies = getAvailableCurrencies();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (hsnRef.current && !hsnRef.current.contains(e.target as Node)) {
        setShowHsnDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Update duty rates when HSN changes
  useEffect(() => {
    if (state.hsnCode && state.hsnCode.length >= 2) {
      const rates = getDutyRates(state.hsnCode);
      dispatch({ type: 'SET_FIELD', field: 'dutyRate', value: rates.bcd });
      dispatch({ type: 'SET_FIELD', field: 'igstRate', value: rates.igst });
    }
  }, [state.hsnCode]);

  // Scroll to results when they appear (mobile/tablet only — desktop shows in right panel)
  useEffect(() => {
    if (!isDesktop && state.results && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.results, isDesktop]);

  // ── Computed values ──
  const fobValue = (parseFloat(state.quantity) || 0) * (parseFloat(state.unitPrice) || 0);

  // ── HSN search handler ──
  const handleHsnSearch = (value: string) => {
    dispatch({ type: 'SET_FIELD', field: 'hsnCode', value });
    if (value.length >= 2) {
      const suggestions = searchHSNCodes(value);
      setHsnSuggestions(suggestions);
      setShowHsnDropdown(suggestions.length > 0);
    } else {
      setShowHsnDropdown(false);
    }
  };

  const selectHsnCode = (item: any) => {
    dispatch({ type: 'SELECT_HSN', code: item.code, dutyRate: item.dutyRate, igstRate: item.igstRate });
    setShowHsnDropdown(false);
  };

  // ── Port selection ──
  const selectOriginPort = (port: typeof commonPorts.origin[0]) => {
    dispatch({ type: 'SET_FIELD', field: 'originPort', value: `${port.code} - ${port.name}` });
    setOriginSearch(port.name);
    setShowOriginDropdown(false);
  };

  const selectDestPort = (port: typeof commonPorts.destination[0]) => {
    dispatch({ type: 'SET_FIELD', field: 'destinationPort', value: `${port.code} - ${port.name}` });
    setDestSearch(port.name);
    setShowDestDropdown(false);
  };

  // ── Add custom charge ──
  const handleAddCustomCharge = () => {
    if (!newChargeName || !newChargeAmount) return;
    dispatch({
      type: 'ADD_CHARGE',
      charge: { id: Date.now().toString(), name: newChargeName, amount: newChargeAmount, type: newChargeType },
    });
    setNewChargeName('');
    setNewChargeAmount('');
    setNewChargeType('fixed');
    setShowAddCharge(false);
  };

  // ── Validate ──
  const canCalculate = !!(
    state.productName &&
    state.hsnCode &&
    state.quantity &&
    state.unitPrice &&
    fobValue > 0 &&
    state.freightCost
  );

  // ── Calculate ──
  const handleCalculate = useCallback(() => {
    if (!canCalculate) return;
    dispatch({ type: 'SET_CALCULATING', value: true });

    // Convert FOB to INR
    const rate = exchangeRates[state.currency] || exchangeRates.USD;
    const fobINR = fobValue * rate;
    const freightCost = parseFloat(state.freightCost) || 0;
    const freightINR = freightCost * rate;

    // Insurance
    let insuranceINR = 0;
    if (state.insuranceRequired) {
      const insRate = parseFloat(state.insuranceRate) || 0.5;
      insuranceINR = (fobINR + freightINR) * 1.1 * (insRate / 100);
    }

    // CIF
    const cifValue = fobINR + freightINR + insuranceINR;

    // Duties
    const bcd = cifValue * (state.dutyRate / 100);
    const sws = bcd * 0.10;
    const igst = (cifValue + bcd + sws) * (state.igstRate / 100);
    const totalDuties = bcd + sws + igst;

    // Additional costs (in original currency, converted to INR)
    const packing = (parseFloat(state.packingCharges) || 0) * rate;
    const inland = (parseFloat(state.inlandFreight) || 0) * rate;
    const bankChg = fobINR * ((parseFloat(state.bankCharges) || 0) / 100);
    const commission = fobINR * ((parseFloat(state.commissionRate) || 0) / 100);
    let customTotal = 0;
    state.customCharges.forEach(c => {
      if (c.type === 'fixed') {
        customTotal += (parseFloat(c.amount) || 0) * rate;
      } else {
        customTotal += fobINR * ((parseFloat(c.amount) || 0) / 100);
      }
    });
    const totalAdditional = packing + inland + bankChg + commission + customTotal;

    // Total
    const totalLandedCost = cifValue + totalDuties + totalAdditional;
    const qty = parseFloat(state.quantity) || 1;
    const costPerUnit = totalLandedCost / qty;

    // Breakdown for chart
    const items = [
      { label: 'FOB Value', value: fobINR, color: '#3b82f6' },
      { label: 'Freight', value: freightINR, color: '#10b981' },
      { label: 'Insurance', value: insuranceINR, color: '#f59e0b' },
      { label: 'Customs Duty', value: bcd + sws, color: '#ef4444' },
      { label: 'IGST', value: igst, color: '#8b5cf6' },
      { label: 'Additional', value: totalAdditional, color: '#ec4899' },
    ];
    const breakdown = items.map(i => ({
      ...i,
      percentage: totalLandedCost > 0 ? (i.value / totalLandedCost) * 100 : 0,
    }));

    setTimeout(() => {
      dispatch({
        type: 'SET_RESULTS',
        results: {
          fobValueINR: fobINR, freightINR, insuranceINR, cifValue,
          bcd, sws, igst, totalDuties, totalAdditional,
          totalLandedCost, costPerUnit, exchangeRate: rate, breakdown,
        },
      });
    }, 600);
  }, [canCalculate, state, fobValue]);

  // ── Save to history ──
  const handleSave = () => {
    if (!state.results) return;
    const record = historyStorage.save({
      input: {
        productName: state.productName,
        hsnCode: state.hsnCode,
        fobValue: fobValue.toString(),
        currency: state.currency,
        weight: state.weight || undefined,
        quantity: parseFloat(state.quantity) || undefined,
        unitPrice: parseFloat(state.unitPrice) || undefined,
        dutyRate: state.dutyRate.toString(),
        shippingMode: state.shippingMode,
        originPort: state.originPort || '',
        destinationPort: state.destinationPort || '',
        estimatedDays: state.estimatedDays || undefined,
        freightCost: state.freightCost,
        insuranceRequired: state.insuranceRequired,
        insuranceRate: state.insuranceRate,
        insuranceAmount: state.results.insuranceINR.toString(),
        packingCharges: state.packingCharges || undefined,
        inlandFreight: state.inlandFreight || undefined,
        bankCharges: state.bankCharges || undefined,
        commissionRate: state.commissionRate || undefined,
        customCharges: state.customCharges,
        totalAdditionalCosts: state.results.totalAdditional.toString(),
      },
      result: {
        cifValue: state.results.cifValue,
        customsDuty: state.results.bcd,
        gst: state.results.igst,
        totalLandedCost: state.results.totalLandedCost,
        breakdownPercentages: {
          fob: state.results.breakdown[0]?.percentage || 0,
          freight: state.results.breakdown[1]?.percentage || 0,
          insurance: state.results.breakdown[2]?.percentage || 0,
          duty: state.results.breakdown[3]?.percentage || 0,
          gst: state.results.breakdown[4]?.percentage || 0,
          additional: state.results.breakdown[5]?.percentage || 0,
        },
      },
      metadata: {
        calculatedAt: new Date().toISOString(),
        isFavorite: false,
        tags: [],
      },
    });
    dispatch({ type: 'MARK_SAVED', id: record.id });
  };

  // ── Download CSV ──
  const handleDownloadCSV = () => {
    if (!state.results) return;
    const r = state.results;
    const rows = [
      ['Landed Cost Calculator - Calculation Report'],
      [''],
      ['Product Details'],
      ['Product Name', state.productName],
      ['HSN Code', state.hsnCode],
      ['Quantity', state.quantity],
      ['Unit Price', `${state.currency} ${state.unitPrice}`],
      ['FOB Value', `${state.currency} ${fobValue.toFixed(2)}`],
      [''],
      ['Cost Breakdown (INR)'],
      ['FOB Value', r.fobValueINR.toFixed(2)],
      ['Freight', r.freightINR.toFixed(2)],
      ['Insurance', r.insuranceINR.toFixed(2)],
      ['CIF Value', r.cifValue.toFixed(2)],
      ['Basic Customs Duty', r.bcd.toFixed(2)],
      ['Social Welfare Surcharge', r.sws.toFixed(2)],
      ['IGST', r.igst.toFixed(2)],
      ['Total Duties', r.totalDuties.toFixed(2)],
      ['Additional Costs', r.totalAdditional.toFixed(2)],
      [''],
      ['TOTAL LANDED COST', r.totalLandedCost.toFixed(2)],
      ['Cost Per Unit', r.costPerUnit.toFixed(2)],
    ];
    const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landed-cost-${state.productName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Format currency ──
  const fmt = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fmtDetailed = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AppLayout rightPanel={isDesktop ? <CalculatorRightPanel state={state} fobValue={fobValue} fmt={fmt} fmtDetailed={fmtDetailed} onSave={handleSave} onDownloadCSV={handleDownloadCSV} onReset={() => dispatch({ type: 'RESET' })} /> : undefined}>
      <div className="calc-page">
        {/* Header */}
        <div id="calc-header" className="page-header">
          <div className="header-left">
            <Calculator size={28} />
            <div>
              <h1>Landed Cost Calculator</h1>
              <p className="header-sub">Calculate your total import cost quickly</p>
            </div>
          </div>          <Link href="/cost-calculator/history" className="history-link">
            <History size={18} />
            <span>View History</span>
          </Link>
        </div>

        {/* ─── FORM ─── */}
        <div id="calc-form" className="form-card">

          {/* Product Name */}
          <div className="form-group">
            <label className="label">Product Name <span className="req">*</span></label>
            <input
              type="text"
              className="input"
              value={state.productName}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'productName', value: e.target.value })}
              placeholder="e.g., LED Bulbs, Solar Panels"
            />
          </div>

          {/* HSN Code */}
          <div className="form-group" ref={hsnRef}>
            <label className="label">
              HSN Code <span className="req">*</span>
              {state.hsnCode.length >= 2 && (
                <span className="duty-badge">BCD: {state.dutyRate}% | IGST: {state.igstRate}%</span>
              )}
            </label>
            <div className="input-with-icon">
              <input
                type="text"
                className="input"
                value={state.hsnCode}
                onChange={e => handleHsnSearch(e.target.value)}
                onFocus={() => { if (state.hsnCode.length >= 2) setShowHsnDropdown(true); }}
                placeholder="Type to search HSN codes..."
              />
              <Search size={16} className="input-icon" />
            </div>
            {showHsnDropdown && hsnSuggestions.length > 0 && (
              <div className="dropdown">
                {hsnSuggestions.map((item, i) => (
                  <button key={i} type="button" className="dropdown-item" onClick={() => selectHsnCode(item)}>
                    <span className="hsn-code">{item.code}</span>
                    <span className="hsn-desc">{item.description}</span>
                    <span className="hsn-rates">BCD: {item.dutyRate}% | IGST: {item.igstRate}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quantity, Unit Price, Currency */}
          <div className="form-row-3">
            <div className="form-group">
              <label className="label">Quantity <span className="req">*</span></label>
              <input
                type="number"
                className="input"
                value={state.quantity}
                onChange={e => dispatch({ type: 'SET_FIELD', field: 'quantity', value: e.target.value })}
                placeholder="0"
                min="1"
              />
            </div>
            <div className="form-group">
              <label className="label">Unit Price <span className="req">*</span></label>
              <input
                type="number"
                className="input"
                value={state.unitPrice}
                onChange={e => dispatch({ type: 'SET_FIELD', field: 'unitPrice', value: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="label">Currency</label>
              <select
                className="input"
                value={state.currency}
                onChange={e => dispatch({ type: 'SET_FIELD', field: 'currency', value: e.target.value })}
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
          </div>

          {/* FOB Value */}
          {fobValue > 0 && (
            <div className="fob-display">
              <span className="fob-label">FOB Value</span>
              <span className="fob-value">{state.currency} {fobValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          )}

          {/* Shipping Mode */}
          <div id="calc-shipping-mode" className="form-group">
            <label className="label">Shipping Mode <span className="req">*</span></label>
            <div className="mode-grid">
              {shippingModes.map(mode => {
                const Icon = modeIcons[mode.id];
                return (
                  <button
                    key={mode.id}
                    type="button"
                    className={`mode-btn ${state.shippingMode === mode.id ? 'mode-active' : ''}`}
                    onClick={() => dispatch({ type: 'SET_SHIPPING_MODE', mode: mode.id })}
                  >
                    <Icon size={20} />
                    <span className="mode-name">{mode.shortName}</span>
                    <span className="mode-desc">{mode.description}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Freight Cost */}
          <div className="form-group">
            <label className="label">Freight Cost ({state.currency}) <span className="req">*</span></label>
            <input
              type="number"
              className="input"
              value={state.freightCost}
              onChange={e => dispatch({ type: 'SET_FIELD', field: 'freightCost', value: e.target.value })}
              placeholder="Enter freight charges"
              step="0.01"
              min="0"
            />
          </div>

          {/* ─── ADVANCED OPTIONS ─── */}
          <button
            type="button"
            className="advanced-toggle"
            onClick={() => dispatch({ type: 'TOGGLE_ADVANCED' })}
          >
            {state.showAdvanced ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            <span>Advanced Options</span>
            <span className="advanced-hint">Weight, ports, insurance, additional costs</span>
          </button>

          {state.showAdvanced && (
            <div className="advanced-section">
              {/* Weight */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label">Weight</label>
                  <input
                    type="number"
                    className="input"
                    value={state.weight}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'weight', value: e.target.value })}
                    placeholder="0"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Unit</label>
                  <select
                    className="input"
                    value={state.weightUnit}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'weightUnit', value: e.target.value })}
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="mt">MT</option>
                  </select>
                </div>
              </div>

              {/* Ports */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label">Origin Port</label>
                  <div className="port-wrapper">
                    <input
                      type="text"
                      className="input"
                      value={originSearch}
                      onChange={e => { setOriginSearch(e.target.value); setShowOriginDropdown(true); }}
                      onFocus={() => setShowOriginDropdown(true)}
                      placeholder="Select origin port"
                    />
                    {showOriginDropdown && (
                      <div className="dropdown">
                        {commonPorts.origin
                          .filter(p => p.name.toLowerCase().includes(originSearch.toLowerCase()) || p.code.toLowerCase().includes(originSearch.toLowerCase()))
                          .map(port => (
                            <button key={port.code} type="button" className="dropdown-item" onClick={() => selectOriginPort(port)}>
                              <span className="port-code">{port.code}</span>
                              <span>{port.name}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="label">Destination Port</label>
                  <div className="port-wrapper">
                    <input
                      type="text"
                      className="input"
                      value={destSearch}
                      onChange={e => { setDestSearch(e.target.value); setShowDestDropdown(true); }}
                      onFocus={() => setShowDestDropdown(true)}
                      placeholder="Select destination port"
                    />
                    {showDestDropdown && (
                      <div className="dropdown">
                        {commonPorts.destination
                          .filter(p => p.name.toLowerCase().includes(destSearch.toLowerCase()) || p.code.toLowerCase().includes(destSearch.toLowerCase()))
                          .map(port => (
                            <button key={port.code} type="button" className="dropdown-item" onClick={() => selectDestPort(port)}>
                              <span className="port-code">{port.code}</span>
                              <span>{port.name}</span>
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Transit Days */}
              <div className="form-group">
                <label className="label">Transit Days</label>
                <input
                  type="number"
                  className="input inline-short"
                  value={state.estimatedDays}
                  onChange={e => dispatch({ type: 'SET_FIELD', field: 'estimatedDays', value: e.target.value })}
                  placeholder="30"
                />
              </div>

              {/* Insurance */}
              <div className="insurance-row">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={state.insuranceRequired}
                    onChange={() => dispatch({ type: 'TOGGLE_INSURANCE' })}
                  />
                  <span>Marine Insurance</span>
                </label>
                {state.insuranceRequired && (
                  <div className="insurance-rate">
                    <label className="label">Rate (%)</label>
                    <input
                      type="number"
                      className="input inline-short"
                      value={state.insuranceRate}
                      onChange={e => dispatch({ type: 'SET_FIELD', field: 'insuranceRate', value: e.target.value })}
                      step="0.01"
                      min="0"
                      max="5"
                    />
                  </div>
                )}
              </div>

              {/* Packing + Inland Freight */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label">Packing Charges ({state.currency})</label>
                  <input
                    type="number"
                    className="input"
                    value={state.packingCharges}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'packingCharges', value: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Inland Freight ({state.currency})</label>
                  <input
                    type="number"
                    className="input"
                    value={state.inlandFreight}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'inlandFreight', value: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Bank Charges + Commission */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="label">Bank Charges (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={state.bankCharges}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'bankCharges', value: e.target.value })}
                    placeholder="0.5"
                    step="0.01"
                    min="0"
                    max="5"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Commission (%)</label>
                  <input
                    type="number"
                    className="input"
                    value={state.commissionRate}
                    onChange={e => dispatch({ type: 'SET_FIELD', field: 'commissionRate', value: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max="10"
                  />
                </div>
              </div>

              {/* Custom Charges */}
              <div className="custom-charges-section">
                <label className="label">Custom Charges</label>
                <div className="quick-add-row">
                  {predefinedCharges.slice(0, 4).map(charge => (
                    <button
                      key={charge.name}
                      type="button"
                      className="quick-add-btn"
                      onClick={() => dispatch({
                        type: 'ADD_CHARGE',
                        charge: { id: Date.now().toString() + charge.name, name: charge.name, amount: charge.amount, type: charge.type },
                      })}
                    >
                      <Plus size={12} /> {charge.name}
                    </button>
                  ))}
                </div>

                {state.customCharges.length > 0 && (
                  <div className="charges-list">
                    {state.customCharges.map(charge => (
                      <div key={charge.id} className="charge-item">
                        <span className="charge-name">{charge.name}</span>
                        <span className="charge-amount">
                          {charge.type === 'percentage' ? `${charge.amount}%` : `$${charge.amount}`}
                        </span>
                        <button type="button" className="charge-remove" onClick={() => dispatch({ type: 'REMOVE_CHARGE', id: charge.id })}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {!showAddCharge ? (
                  <button type="button" className="add-custom-btn" onClick={() => setShowAddCharge(true)}>
                    <Plus size={14} /> Add Custom Charge
                  </button>
                ) : (
                  <div className="add-charge-form">
                    <input
                      type="text"
                      className="input"
                      value={newChargeName}
                      onChange={e => setNewChargeName(e.target.value)}
                      placeholder="Charge name"
                    />
                    <div className="add-charge-row">
                      <select
                        className="input"
                        value={newChargeType}
                        onChange={e => setNewChargeType(e.target.value as 'fixed' | 'percentage')}
                      >
                        <option value="fixed">Fixed ($)</option>
                        <option value="percentage">% of FOB</option>
                      </select>
                      <input
                        type="number"
                        className="input"
                        value={newChargeAmount}
                        onChange={e => setNewChargeAmount(e.target.value)}
                        placeholder="Amount"
                        step="0.01"
                      />
                    </div>
                    <div className="add-charge-actions">
                      <button type="button" className="btn-sm btn-primary" onClick={handleAddCustomCharge}>Add</button>
                      <button type="button" className="btn-sm btn-ghost" onClick={() => { setShowAddCharge(false); setNewChargeName(''); setNewChargeAmount(''); }}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <button
            id="calc-submit-btn"
            type="button"
            className={`calc-btn ${!canCalculate ? 'calc-btn-disabled' : ''}`}
            onClick={handleCalculate}
            disabled={!canCalculate || state.isCalculating}
          >
            {state.isCalculating ? (
              <span className="calc-btn-loading">Calculating...</span>
            ) : (
              <>
                <Calculator size={20} />
                Calculate Landed Cost
              </>
            )}
          </button>

          {!canCalculate && (state.productName || state.hsnCode || state.quantity) && (
            <div className="validation-hint">
              <AlertCircle size={14} />
              Fill in product name, HSN code, quantity, unit price, and freight cost to calculate
            </div>
          )}
        </div>

        {/* ─── RESULTS (mobile/tablet only — desktop shows in right panel) ─── */}
        {!isDesktop && state.results && (
          <div className="results-section" ref={resultsRef}>
            <div className="results-header">
              <Check size={22} className="results-check" />
              <span>Calculation Complete</span>
            </div>

            {/* Summary Cards */}
            <div className="summary-grid">
              <div className="summary-card summary-primary">
                <span className="summary-label">Total Landed Cost</span>
                <span className="summary-value">{fmt(state.results.totalLandedCost)}</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Cost Per Unit</span>
                <span className="summary-value">{fmt(state.results.costPerUnit)}</span>
                <span className="summary-sub">{state.quantity} units</span>
              </div>
              <div className="summary-card">
                <span className="summary-label">Duties & Taxes</span>
                <span className="summary-value">{fmt(state.results.totalDuties)}</span>
                <span className="summary-sub">
                  {((state.results.totalDuties / state.results.totalLandedCost) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>

            {/* Cost Distribution Bar Chart */}
            <div className="chart-card">
              <h3 className="section-title">Cost Distribution</h3>
              <div className="bar-chart">
                {state.results.breakdown.filter(b => b.value > 0).map((item, i) => (
                  <div key={i} className="bar-row">
                    <span className="bar-label">{item.label}</span>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${Math.max(item.percentage, 1)}%`, backgroundColor: item.color }} />
                    </div>
                    <span className="bar-pct">{item.percentage.toFixed(1)}%</span>
                    <span className="bar-amt">{fmt(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="breakdown-card">
              <h3 className="section-title">Detailed Breakdown</h3>
              <div className="breakdown-table">
                <div className="breakdown-group">
                  <div className="breakdown-group-title">Base Costs</div>
                  <div className="breakdown-row">
                    <span>FOB Value ({state.currency} → INR)</span>
                    <span>{fmtDetailed(state.results.fobValueINR)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Freight Cost</span>
                    <span>{fmtDetailed(state.results.freightINR)}</span>
                  </div>
                  {state.results.insuranceINR > 0 && (
                    <div className="breakdown-row">
                      <span>Marine Insurance</span>
                      <span>{fmtDetailed(state.results.insuranceINR)}</span>
                    </div>
                  )}
                  <div className="breakdown-row breakdown-subtotal">
                    <span>CIF Value</span>
                    <span>{fmtDetailed(state.results.cifValue)}</span>
                  </div>
                </div>

                <div className="breakdown-group">
                  <div className="breakdown-group-title">Duties & Taxes</div>
                  <div className="breakdown-row">
                    <span>Basic Customs Duty ({state.dutyRate}%)</span>
                    <span>{fmtDetailed(state.results.bcd)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>Social Welfare Surcharge (10% of BCD)</span>
                    <span>{fmtDetailed(state.results.sws)}</span>
                  </div>
                  <div className="breakdown-row">
                    <span>IGST ({state.igstRate}%)</span>
                    <span>{fmtDetailed(state.results.igst)}</span>
                  </div>
                  <div className="breakdown-row breakdown-subtotal">
                    <span>Total Duties</span>
                    <span>{fmtDetailed(state.results.totalDuties)}</span>
                  </div>
                </div>

                {state.results.totalAdditional > 0 && (
                  <div className="breakdown-group">
                    <div className="breakdown-group-title">Additional Costs</div>
                    {parseFloat(state.packingCharges) > 0 && (
                      <div className="breakdown-row">
                        <span>Packing Charges</span>
                        <span>{fmtDetailed(parseFloat(state.packingCharges) * state.results.exchangeRate)}</span>
                      </div>
                    )}
                    {parseFloat(state.inlandFreight) > 0 && (
                      <div className="breakdown-row">
                        <span>Inland Freight</span>
                        <span>{fmtDetailed(parseFloat(state.inlandFreight) * state.results.exchangeRate)}</span>
                      </div>
                    )}
                    {parseFloat(state.bankCharges) > 0 && (
                      <div className="breakdown-row">
                        <span>Bank Charges ({state.bankCharges}%)</span>
                        <span>{fmtDetailed(state.results.fobValueINR * (parseFloat(state.bankCharges) / 100))}</span>
                      </div>
                    )}
                    {parseFloat(state.commissionRate) > 0 && (
                      <div className="breakdown-row">
                        <span>Commission ({state.commissionRate}%)</span>
                        <span>{fmtDetailed(state.results.fobValueINR * (parseFloat(state.commissionRate) / 100))}</span>
                      </div>
                    )}
                    {state.customCharges.map(c => (
                      <div key={c.id} className="breakdown-row">
                        <span>{c.name}</span>
                        <span>
                          {c.type === 'fixed'
                            ? fmtDetailed(parseFloat(c.amount) * state.results!.exchangeRate)
                            : fmtDetailed(state.results!.fobValueINR * (parseFloat(c.amount) / 100))
                          }
                        </span>
                      </div>
                    ))}
                    <div className="breakdown-row breakdown-subtotal">
                      <span>Total Additional</span>
                      <span>{fmtDetailed(state.results.totalAdditional)}</span>
                    </div>
                  </div>
                )}

                <div className="breakdown-total">
                  <span>TOTAL LANDED COST</span>
                  <span>{fmtDetailed(state.results.totalLandedCost)}</span>
                </div>
              </div>

              <div className="disclaimer">
                <Info size={14} />
                <span>This is an estimate. Actual costs may vary due to exchange rate fluctuations, regulatory changes, and other factors.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="results-actions">
              <button
                type="button"
                className={`action-btn action-primary ${state.saved ? 'action-saved' : ''}`}
                onClick={handleSave}
                disabled={state.saved}
              >
                {state.saved ? <><Check size={18} /> Saved</> : <><Save size={18} /> Save to History</>}
              </button>
              <button type="button" className="action-btn action-secondary" onClick={handleDownloadCSV}>
                <Download size={18} /> Download CSV
              </button>
              <button type="button" className="action-btn action-ghost" onClick={() => dispatch({ type: 'RESET' })}>
                <RotateCcw size={18} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .calc-page {
          max-width: 960px;
          padding: 1.5rem;
          padding-bottom: 2rem;
        }

        /* ── Header ── */
        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #f97316;
        }
        .header-left h1 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text, #111827);
          margin: 0;
        }
        .header-sub {
          font-size: 0.85rem;
          color: var(--color-text-secondary, #6b7280);
          margin: 0;
        }
        :global(.history-link) {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #f97316;
          background: #fff7ed;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.15s;
        }
        :global(.history-link:hover) {
          background: #ffedd5;
        }

        /* ── Form Card ── */
        .form-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
        }
        .form-group {
          margin-bottom: 1rem;
          position: relative;
        }
        .label {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-text-secondary, #374151);
          margin-bottom: 0.35rem;
          flex-wrap: wrap;
        }
        .req { color: #ef4444; }
        .duty-badge {
          font-size: 0.7rem;
          font-weight: 500;
          background: #ecfdf5;
          color: #059669;
          padding: 0.15rem 0.5rem;
          border-radius: 4px;
          margin-left: 0.5rem;
        }
        .input {
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: 1.5px solid var(--color-border, #d1d5db);
          border-radius: 8px;
          font-size: 0.875rem;
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
          transition: border-color 0.15s, box-shadow 0.15s;
          outline: none;
          box-sizing: border-box;
          min-height: 42px;
          font-family: inherit;
        }
        .input:focus {
          border-color: var(--color-primary, #f97316);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .input::placeholder {
          color: #9ca3af;
        }
        .inline-short {
          max-width: 120px;
        }

        /* Input with icon */
        .input-with-icon {
          position: relative;
        }
        .input-with-icon .input {
          padding-right: 2.5rem;
        }
        .input-with-icon :global(.input-icon) {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          pointer-events: none;
        }

        /* Dropdowns */
        .dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #d1d5db);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 50;
          max-height: 220px;
          overflow-y: auto;
          margin-top: 4px;
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: none;
          background: none;
          text-align: left;
          font-size: 0.8125rem;
          color: var(--color-text, #111827);
          cursor: pointer;
          transition: background 0.1s;
        }
        .dropdown-item:hover {
          background: var(--color-primary-light, #fff7ed);
        }
        .hsn-code, .port-code {
          font-weight: 600;
          color: var(--color-primary, #f97316);
          min-width: 60px;
        }
        .hsn-desc { flex: 1; color: var(--color-text-secondary, #6b7280); }
        .hsn-rates { font-size: 0.7rem; color: #059669; white-space: nowrap; }

        .port-wrapper { position: relative; }

        /* Form rows */
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 0;
        }
        .form-row-3 {
          display: grid;
          grid-template-columns: 1fr 1fr auto;
          gap: 1rem;
          margin-bottom: 0;
        }
        .form-row-3 .form-group:last-child {
          min-width: 100px;
        }

        /* FOB Display */
        .fob-display {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background: #fff7ed;
          border: 1.5px solid #fed7aa;
          border-radius: 8px;
          margin-bottom: 1rem;
        }
        .fob-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #9a3412;
        }
        .fob-value {
          font-size: 1rem;
          font-weight: 700;
          color: #ea580c;
        }

        /* Shipping Mode */
        .mode-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        .mode-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 0.75rem 0.5rem;
          border: 2px solid var(--color-border, #e5e7eb);
          border-radius: 10px;
          background: var(--color-surface, #fff);
          cursor: pointer;
          transition: all 0.15s;
          color: var(--color-text-secondary, #6b7280);
        }
        .mode-btn:hover {
          border-color: var(--color-primary, #f97316);
          background: var(--color-primary-light, #fff7ed);
        }
        .mode-active {
          border-color: #f97316;
          background: #fff7ed;
          color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }
        .mode-name {
          font-size: 0.8125rem;
          font-weight: 600;
        }
        .mode-desc {
          font-size: 0.7rem;
          opacity: 0.7;
        }

        /* Advanced Toggle */
        .advanced-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 0;
          border: none;
          border-top: 1px solid var(--color-border, #e5e7eb);
          background: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text-secondary, #374151);
          margin-top: 0.5rem;
          transition: color 0.15s;
        }
        .advanced-toggle:hover {
          color: var(--color-primary, #f97316);
        }
        .advanced-hint {
          font-weight: 400;
          font-size: 0.75rem;
          color: #9ca3af;
          margin-left: auto;
        }

        /* Advanced Section */
        .advanced-section {
          padding-top: 0.5rem;
          border-top: 1px solid var(--color-border, #f3f4f6);
        }

        /* Insurance */
        .insurance-row {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text, #111827);
          cursor: pointer;
        }
        .checkbox-label input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: var(--color-primary, #f97316);
        }
        .insurance-rate {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .insurance-rate .label {
          margin-bottom: 0;
        }
        .insurance-rate .input {
          width: 80px;
        }

        /* Custom Charges */
        .custom-charges-section {
          margin-bottom: 1rem;
        }
        .quick-add-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.5rem;
        }
        .quick-add-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.3rem 0.6rem;
          border: 1px solid var(--color-border, #d1d5db);
          border-radius: 6px;
          background: var(--color-surface, #fff);
          font-size: 0.7rem;
          color: var(--color-text-secondary, #6b7280);
          cursor: pointer;
          transition: all 0.1s;
        }
        .quick-add-btn:hover {
          border-color: var(--color-primary, #f97316);
          color: var(--color-primary, #f97316);
          background: var(--color-primary-light, #fff7ed);
        }
        .charges-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .charge-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.6rem;
          background: #f9fafb;
          border-radius: 6px;
          font-size: 0.8125rem;
        }
        .charge-name { flex: 1; color: var(--color-text, #111827); }
        .charge-amount { font-weight: 600; color: var(--color-text-secondary, #374151); }
        .charge-remove {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.2rem;
          border: none;
          background: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.1s;
        }
        .charge-remove:hover { color: #ef4444; background: #fef2f2; }

        .add-custom-btn {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0;
          border: none;
          background: none;
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-primary, #f97316);
          cursor: pointer;
        }
        .add-custom-btn:hover { text-decoration: underline; }

        .add-charge-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
        }
        .add-charge-row {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0.5rem;
        }
        .add-charge-actions {
          display: flex;
          gap: 0.5rem;
        }
        .btn-sm {
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.1s;
        }
        .btn-primary {
          background: #f97316;
          color: #fff;
        }
        .btn-primary:hover { background: #ea580c; }
        .btn-ghost {
          background: none;
          color: var(--color-text-secondary, #6b7280);
          border: 1px solid var(--color-border, #d1d5db);
        }
        .btn-ghost:hover { background: #f3f4f6; }

        /* Calculate Button */
        .calc-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.85rem;
          margin-top: 1rem;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          min-height: 48px;
        }
        .calc-btn:hover:not(.calc-btn-disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(249, 115, 22, 0.35);
        }
        .calc-btn-disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .calc-btn-loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .validation-hint {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          margin-top: 0.5rem;
          font-size: 0.75rem;
          color: #f59e0b;
        }

        /* ── RESULTS ── */
        .results-section {
          margin-top: 1.5rem;
        }
        .results-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 600;
          color: #059669;
        }
        .results-header :global(.results-check) {
          background: #ecfdf5;
          border-radius: 50%;
          padding: 2px;
        }

        /* Summary Cards */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .summary-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .summary-primary {
          background: linear-gradient(135deg, #f97316, #ea580c);
          border: none;
          color: #fff;
          box-shadow: 0 4px 16px rgba(249, 115, 22, 0.25);
        }
        .summary-primary .summary-label { color: rgba(255,255,255,0.8); }
        .summary-primary .summary-value { color: #fff; }
        .summary-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--color-text-secondary, #6b7280);
          margin-bottom: 0.25rem;
        }
        .summary-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-text, #111827);
        }
        .summary-sub {
          display: block;
          font-size: 0.7rem;
          color: var(--color-text-secondary, #9ca3af);
          margin-top: 0.15rem;
        }
        .summary-primary .summary-sub { color: rgba(255,255,255,0.6); }

        /* Bar Chart */
        .chart-card, .breakdown-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 12px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .section-title {
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-text, #111827);
          margin: 0 0 0.75rem 0;
        }
        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .bar-row {
          display: grid;
          grid-template-columns: 100px 1fr 50px 100px;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
        }
        .bar-label {
          color: var(--color-text-secondary, #6b7280);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .bar-track {
          height: 22px;
          background: var(--bg-secondary, #f3f4f6);
          border-radius: 6px;
          overflow: hidden;
        }
        .bar-fill {
          height: 100%;
          border-radius: 6px;
          transition: width 0.6s ease-out;
        }
        .bar-pct {
          text-align: right;
          font-weight: 600;
          color: var(--color-text-secondary, #374151);
          font-size: 0.75rem;
        }
        .bar-amt {
          text-align: right;
          font-weight: 500;
          color: var(--color-text, #111827);
          font-size: 0.75rem;
          white-space: nowrap;
        }

        /* Breakdown Table */
        .breakdown-table {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .breakdown-group {
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
          border-bottom: 1px solid #f3f4f6;
        }
        .breakdown-group-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          color: var(--color-text-secondary, #9ca3af);
          margin-bottom: 0.35rem;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          padding: 0.3rem 0;
          font-size: 0.8125rem;
          color: var(--color-text, #374151);
        }
        .breakdown-subtotal {
          font-weight: 600;
          border-top: 1px dashed #e5e7eb;
          padding-top: 0.35rem;
          margin-top: 0.2rem;
          color: var(--color-text, #111827);
        }
        .breakdown-total {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0 0.25rem;
          font-size: 1rem;
          font-weight: 700;
          color: var(--color-text, #111827);
          border-top: 2px solid var(--color-text, #111827);
        }

        .disclaimer {
          display: flex;
          align-items: flex-start;
          gap: 0.4rem;
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          background: #fffbeb;
          border-radius: 6px;
          font-size: 0.7rem;
          color: #92400e;
          line-height: 1.4;
        }

        /* Action Buttons */
        .results-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.6rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.15s;
          flex: 1;
          min-height: 44px;
        }
        .action-primary {
          background: #059669;
          color: #fff;
        }
        .action-primary:hover { background: #047857; box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25); }
        .action-saved {
          background: #ecfdf5;
          color: #059669;
          cursor: default;
        }
        .action-secondary {
          background: var(--color-surface, #fff);
          color: var(--color-text, #374151);
          border: 1px solid var(--color-border, #d1d5db);
        }
        .action-secondary:hover { background: #f9fafb; }
        .action-ghost {
          background: none;
          color: var(--color-text-secondary, #6b7280);
        }
        .action-ghost:hover { background: #f3f4f6; }

        /* ── RESPONSIVE ── */

        @media (max-width: 1024px) {
          .calc-page {
            max-width: 100%;
            padding: 1rem;
          }
        }

        @media (max-width: 768px) {
          .calc-page {
            padding: 1rem;
            padding-bottom: 100px;
          }
          .page-header {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          .header-left {
            gap: 0.5rem;
          }
          .header-left h1 {
            font-size: 1.2rem;
          }
          .header-sub {
            display: none;
          }
          :global(.history-link) {
            padding: 0.4rem 0.75rem;
            font-size: 0.8rem;
          }
          .form-card {
            padding: 1rem;
            border-radius: 12px;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
          .form-row-3 {
            grid-template-columns: 1fr 1fr;
          }
          .form-row-3 .form-group:last-child {
            grid-column: span 2;
          }
          .mode-desc {
            display: none;
          }
          .mode-btn {
            padding: 0.65rem 0.4rem;
            min-height: 56px;
          }
          .advanced-hint {
            display: none;
          }
          .insurance-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .summary-grid {
            grid-template-columns: 1fr;
          }
          .summary-primary {
            order: -1;
          }
          .bar-row {
            grid-template-columns: 80px 1fr 45px;
            gap: 0.35rem;
          }
          .bar-amt {
            display: none;
          }
          .results-actions {
            flex-direction: column;
          }
          .action-btn {
            flex: unset;
          }
          .chart-card, .breakdown-card {
            padding: 1rem;
          }
          .quick-add-row {
            gap: 0.25rem;
          }
          .quick-add-btn {
            font-size: 0.68rem;
            padding: 0.3rem 0.5rem;
            min-height: 28px;
          }
        }

        @media (max-width: 480px) {
          .calc-page {
            padding: 0.75rem;
            padding-bottom: 100px;
          }
          .header-left h1 {
            font-size: 1.05rem;
          }
          .form-card {
            padding: 0.75rem;
            border-radius: 10px;
          }
          .form-row-3 {
            grid-template-columns: 1fr;
          }
          .form-row-3 .form-group:last-child {
            grid-column: span 1;
          }
          .input {
            min-height: 44px;
            font-size: 1rem;
          }
          .fob-display {
            padding: 0.55rem 0.7rem;
          }
          .fob-value {
            font-size: 0.9rem;
          }
          .summary-value {
            font-size: 1.1rem;
          }
          .bar-row {
            grid-template-columns: 70px 1fr 40px;
          }
          .bar-label {
            font-size: 0.7rem;
          }
          .breakdown-row {
            font-size: 0.75rem;
          }
          .breakdown-total {
            font-size: 0.875rem;
          }
          .calc-btn {
            min-height: 50px;
            font-size: 0.95rem;
          }
        }
      `}</style>
      {!tourActive && <TourFAB onStart={startTour} />}
    </AppLayout>
  );
}

export default function CostCalculatorPage() {
  return (
    <Suspense fallback={null}>
      <CostCalculatorContent />
    </Suspense>
  );
}
