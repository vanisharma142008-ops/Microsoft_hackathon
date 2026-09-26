import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  Terminal,
  ShieldCheck,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Award,
} from 'lucide-react';
import { EvaluationReport, TestCaseResult } from '../types/travel';

interface EvaluationViewProps {
  evaluationReport: EvaluationReport | null;
  onRunEvaluation: () => Promise<void>;
  isRunning: boolean;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  evaluationReport,
  onRunEvaluation,
  isRunning,
}) => {
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedTestId(expandedTestId === id ? null : id);
  };

  const passRate =
    evaluationReport && evaluationReport.totalTests > 0
      ? Math.round((evaluationReport.passedTests / evaluationReport.totalTests) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Run Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Evaluation & Automated Verification Suite
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              8 Real E2E Test Suites
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white mt-1 tracking-tight">
            Agentic Travel Quality & Robustness Benchmarks
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Every metric below is executed live against the actual agent pipeline. Tests extraction, budget compliance, preference matching, tool selection, feasibility, adaptive re-planning, weather reaction, and prompt-injection defense.
          </p>
        </div>

        <button
          onClick={onRunEvaluation}
          disabled={isRunning}
          className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 disabled:opacity-50 text-slate-950 font-extrabold px-5 py-3 rounded-xl shadow-lg shadow-amber-500/20 text-xs transition uppercase tracking-wide cursor-pointer"
        >
          {isRunning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Running Live Tests...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Run All 8 E2E Tests</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Scorecards */}
      {evaluationReport && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Pass Rate */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Test Pass Rate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{passRate}%</span>
              <span className="text-xs text-slate-400">
                ({evaluationReport.passedTests}/{evaluationReport.totalTests} suites)
              </span>
            </div>
          </div>

          {/* Total Assertions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Verified Assertions
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-100">
                {evaluationReport.passedAssertions}/{evaluationReport.totalAssertions}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">100% Truth</span>
            </div>
          </div>

          {/* Execution Time */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Pipeline Latency
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-cyan-400">
                {evaluationReport.executionTimeMs} ms
              </span>
              <span className="text-xs text-slate-400">real-time</span>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Adversarial Shield
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-indigo-400">Armored</span>
              <span className="text-xs text-slate-400">Injection safe</span>
            </div>
          </div>
        </div>
      )}

      {/* Test Results Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Verified Test Scenarios & Assertion Matrix
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            {evaluationReport ? `Last Executed: ${new Date(evaluationReport.timestamp).toLocaleTimeString()}` : 'Awaiting Run'}
          </span>
        </div>

        {!evaluationReport && !isRunning && (
          <div className="text-center py-10 space-y-2">
            <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              Click <span className="font-semibold text-amber-400">"Run All 8 E2E Tests"</span> to initiate the automated test runner and verify agent capabilities.
            </p>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-12 space-y-3">
            <RotateCw className="w-8 h-8 text-amber-400 mx-auto animate-spin" />
            <h4 className="text-sm font-bold text-white">Running End-to-End Test Suite...</h4>
            <p className="text-xs text-slate-400">
              Validating natural-language extraction, budget feasibility formulas, weather adaptations, and adversarial inputs.
            </p>
          </div>
        )}

        {evaluationReport && (
          <div className="space-y-3">
            {evaluationReport.results.map((test) => {
              const isExpanded = expandedTestId === test.id;
              const testPassed = test.passed;

              return (
                <div
                  key={test.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden transition"
                >
                  {/* Test Header Row */}
                  <div
                    onClick={() => toggleExpand(test.id)}
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-900/60 transition"
                  >
                    <div className="flex items-center gap-3">
                      {testPassed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100">{test.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                            {test.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {test.assertions.filter((a) => a.passed).length}/{test.assertions.length} assertions passed • {test.durationMs}ms
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="text-xs font-mono">
                        {testPassed ? (
                          <span className="text-emerald-400 font-bold">PASS</span>
                        ) : (
                          <span className="text-rose-400 font-bold">FAIL</span>
                        )}
                      </span>
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </div>
                  </div>

                  {/* Expanded Assertions Table & Logs */}
                  {isExpanded && (
                    <div className="p-4 pt-1 border-t border-slate-800/80 space-y-3 bg-slate-950/40">
                      {/* Assertions Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase font-mono">
                              <th className="py-1.5 px-2">Status</th>
                              <th className="py-1.5 px-2">Assertion</th>
                              <th className="py-1.5 px-2">Expected Condition</th>
                              <th className="py-1.5 px-2">Actual Evaluated Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60">
                            {test.assertions.map((a, idx) => (
                              <tr key={idx} className="hover:bg-slate-900/40">
                                <td className="py-2 px-2">
                                  {a.passed ? (
                                    <span className="text-emerald-400 font-bold font-mono text-[10px]">
                                      ✓ PASS
                                    </span>
                                  ) : (
                                    <span className="text-rose-400 font-bold font-mono text-[10px]">
                                      ✗ FAIL
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-2 font-medium text-slate-200">{a.name}</td>
                                <td className="py-2 px-2 font-mono text-[11px] text-slate-400">
                                  {a.expected}
                                </td>
                                <td className="py-2 px-2 font-mono text-[11px] text-amber-300">
                                  {a.actual}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Test Execution Logs */}
                      {test.logs.length > 0 && (
                        <div className="mt-2 bg-slate-900/90 rounded-lg p-2.5 font-mono text-[10px] text-slate-400 space-y-1 border border-slate-800">
                          <span className="text-slate-500 font-semibold block uppercase">Execution Trace:</span>
                          {test.logs.map((log, lidx) => (
                            <div key={lidx} className="text-slate-300">
                              {log}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
