import React, { useState } from 'react';
import { ArrowRight, Lock, BrainCircuit } from 'lucide-react';

// Mock data for 5 decision sandbox opportunities
const DECISION_SANDBOX_OPPORTUNITIES = [
  {
    id: 1,
    question: "What is the real impact of DeepSeek's algorithmic breakthroughs on NVIDIA's compute moat?",
    mostLikelyOutcome: "Efficiency gains mostly 'compress costs' without reducing total compute demand",
    participants: 1247,
    userSimulationResult: null, // null if user hasn't simulated, otherwise the result
    scenarios: [
      {
        id: 'A',
        title: "Efficiency gains mostly 'compress costs' without reducing total compute demand",
        probability: "High probability",
        reasoningSteps: [
          {
            step: 1,
            title: "DeepSeek-like advances make training/inference more compute-efficient, lowering per-token cost",
            forks: 23
          },
          {
            step: 2,
            title: "Demand-side 'Jevons effect': lower cost -> higher usage / more applications -> total compute demand does not fall and may rise",
            forks: 15
          },
          {
            step: 3,
            title: "Enterprises shift from 'training-only' to 'scaled inference + multimodal + agents,' making inference throughput the long-term battleground",
            forks: 8
          },
          {
            step: 4,
            title: "Purchasing shifts from 'one-off large training clusters' to 'continuous inference capacity expansion,' where NVIDIA benefits from ecosystem and software-stack lock-in",
            forks: 12
          }
        ],
        outcomes: [
          "Short term: markets fear 'compute becomes cheap,' NVDA valuation becomes volatile, but orders are not meaningfully revised down",
          "Medium term: as inference scales, demand grows for the full stack (GPU + networking + software), and the moat looks more platform-like than purely performance-based"
        ]
      },
      {
        id: 'B',
        title: "Efficiency gains shift marginal demand down from top-end GPUs, but supply constraints and new workloads offset",
        probability: "Medium probability",
        reasoningSteps: [
          {
            step: 1,
            title: "Some workloads 'downshift' from H100/H200-class setups to cheaper GPUs or fewer GPUs",
            forks: 19
          },
          {
            step: 2,
            title: "Meanwhile, true bottlenecks move to memory capacity, bandwidth, interconnect (NVLink/InfiniBand), software optimization, and reliability",
            forks: 11
          },
          {
            step: 3,
            title: "New workloads (long context, video, real-time agents, enterprise RAG) re-absorb the 'saved' compute",
            forks: 7
          }
        ],
        outcomes: [
          "Short term: top-end GPU ASP expectations face pressure; markets reprice the growth curve",
          "Medium term: NVIDIA maintains pricing power via product cadence and system-level solutions (rack-scale, networking, software)"
        ]
      },
      {
        id: 'C',
        title: "Breakthroughs + competitive supply (AMD / in-house / cloud silicon) materially weaken NVIDIA's pricing power",
        probability: "Medium-low probability",
        reasoningSteps: [
          {
            step: 1,
            title: "Compute savings + viable substitutes -> buyers become more willing to multi-source",
            forks: 5
          },
          {
            step: 2,
            title: "Hyperscalers reduce CUDA lock-in via higher-layer software abstraction",
            forks: 3
          },
          {
            step: 3,
            title: "NVIDIA margins/ASP decline; growth shifts from 'price + volume' to 'volume-led'",
            forks: 2
          }
        ],
        outcomes: [
          "Stock: valuation de-rates from 'monopoly premium' toward 'cyclical hardware leader'"
        ]
      },
      {
        id: 'D',
        title: "Markets over-interpret the breakthrough; real impact is limited",
        probability: "Low probability but common",
        reasoningSteps: [
          {
            step: 1,
            title: "Efficiency gains from a single model/team may not generalize across workloads and stacks",
            forks: 1
          },
          {
            step: 2,
            title: "Production environments prioritize reliability, ecosystem, supply chain, and compliance",
            forks: 0
          }
        ],
        outcomes: [
          "Stock: valuation de-rates from 'monopoly premium' toward 'cyclical hardware leader'"
        ]
      }
    ],
    lastUpdated: "3 days ago",
    outcomes: [
      {
        id: 1,
        content: "Short term: markets fear 'compute becomes cheap,' NVDA valuation becomes volatile, but orders are not meaningfully revised down",
        scenario: "Scenario A",
        creator: "Alex Thinker",
        likes: 234,
        dislikes: 12,
        isPrivate: false,
        isUserCreated: false
      },
      {
        id: 2,
        content: "Medium term: as inference scales, demand grows for the full stack (GPU + networking + software), and the moat looks more platform-like than purely performance-based",
        scenario: "Scenario A",
        creator: "Sarah Kim",
        likes: 189,
        dislikes: 8,
        isPrivate: false,
        isUserCreated: false
      }
    ]
  },
  {
    id: 2,
    question: "If the U.S. restricts H100 exports to the Middle East, what is the impact on NVIDIA's stock?",
    mostLikelyOutcome: "Impact is 'manageable and absorbed elsewhere'",
    participants: 892,
    userSimulationResult: null,
    scenarios: [
      {
        id: 'A',
        title: "Impact is 'manageable and absorbed elsewhere'",
        probability: "Medium-high probability",
        reasoningSteps: [
          {
            step: 1,
            title: "The U.S. has precedent for advanced AI chip licensing/export restrictions (A100/H100-class controls)",
            forks: 18
          },
          {
            step: 2,
            title: "Middle East demand may be constrained, but if global demand is strong and supply remains tight, NVIDIA can reallocate supply to U.S./Europe/Asia hyperscalers",
            forks: 14
          },
          {
            step: 3,
            title: "Markets focus on total shipments and gross margin, not a single region",
            forks: 9
          }
        ],
        outcomes: [
          "Short term: headline shock drives a 2%–8% drawdown (higher risk premium)",
          "Medium term: if guidance holds, the stock recovers"
        ]
      },
      {
        id: 'B',
        title: "Restrictions broaden into third-country/transshipment enforcement, causing cancellations and execution friction",
        probability: "Medium probability",
        reasoningSteps: [
          {
            step: 1,
            title: "Stricter licensing -> delivery delays; customers' procurement cadence is disrupted",
            forks: 12
          },
          {
            step: 2,
            title: "Transshipment/offshore training routes are constrained -> the Middle East's role as a 'compute hub' shrinks",
            forks: 7
          },
          {
            step: 3,
            title: "Markets trim portions of data-center CapEx expectations",
            forks: 4
          }
        ],
        outcomes: [
          "Short term: 8%–15% drawdown; volatility rises",
          "Medium term: if sustained, some regional demand shifts to local substitutes/gray channels; NVIDIA loses marginal share"
        ]
      }
    ],
    lastUpdated: "2 days ago",
    outcomes: []
  },
  {
    id: 3,
    question: "Will OpenAI release GPT-6 by end-2026? Can inference cost drop to 1/10 of today?",
    mostLikelyOutcome: "No 'GPT-6' branding; instead, continuous GPT-5.x releases with stronger reasoning/tooling",
    participants: 1567,
    userSimulationResult: "GPT-6 launches; cost/performance gains are system-engineering-led; 10x cost drop achieved",
    scenarios: [
      {
        id: 'A',
        title: "GPT-6 launches; cost/performance gains are system-engineering-led; 10x cost drop achieved",
        probability: "Medium probability",
        reasoningSteps: [
          {
            step: 1,
            title: "OpenAI's path likely combines a stronger model + a stronger inference stack (compilation, caching, routing, MoE, quantization)",
            forks: 31
          },
          {
            step: 2,
            title: "Unit inference cost can fall via more efficient decoding, better KV caching, speculative decoding, and hardware generation upgrades",
            forks: 22
          },
          {
            step: 3,
            title: "A 10x drop is more likely from 'software + hardware + workload shifting' in combination than from model changes alone",
            forks: 16
          }
        ],
        outcomes: [
          "2026: GPT-6 (by name) or an equivalent generational jump ships; large customers see meaningfully lower inference unit economics"
        ]
      },
      {
        id: 'B',
        title: "No 'GPT-6' branding; instead, continuous GPT-5.x releases with stronger reasoning/tooling",
        probability: "Medium-high probability",
        reasoningSteps: [
          {
            step: 1,
            title: "Commercial demand prioritizes usability (agents, reliability, tooling) over major-version naming",
            forks: 28
          },
          {
            step: 2,
            title: "Safety, evaluation, and supply-chain constraints may force 'next-gen' capability to ship as multiple components",
            forks: 15
          }
        ],
        outcomes: [
          "By end-2026: you observe a capability jump, but it may not be labeled GPT-6"
        ]
      }
    ],
    lastUpdated: "1 day ago",
    outcomes: []
  },
  {
    id: 4,
    question: "Before fusion is commercialized, will data-center power bottlenecks be solved by SMRs?",
    mostLikelyOutcome: "Near-term relief comes mainly from grid expansion + gas + storage + load management; SMRs remain mostly demonstrative",
    participants: 634,
    userSimulationResult: null,
    scenarios: [
      {
        id: 'A',
        title: "Near-term relief comes mainly from grid expansion + gas + storage + load management; SMRs remain mostly demonstrative",
        probability: "High probability",
        reasoningSteps: [
          {
            step: 1,
            title: "Data-center growth already stresses certain grids; operators adopt 'behind-the-meter power' and interruptible load mechanisms",
            forks: 14
          },
          {
            step: 2,
            title: "SMRs face long timelines, complex licensing, and cost/financing uncertainty; hard to scale materially in 2026–2030",
            forks: 9
          },
          {
            step: 3,
            title: "Therefore, near-term solutions are faster-to-build: grid interconnects, gas peakers, BESS, and demand-side management",
            forks: 6
          }
        ],
        outcomes: [
          "Next 3–5 years: bottlenecks ease mainly via engineering and policy; SMR contribution is limited"
        ]
      }
    ],
    lastUpdated: "4 days ago",
    outcomes: []
  },
  {
    id: 5,
    question: "Can TSMC's U.S. fab reach volume production in 2026? Can yield exceed 80%?",
    mostLikelyOutcome: "Volume production (at least Phase 1) in 2026; '>80% yield' depends on node and definition",
    participants: 1023,
    userSimulationResult: null,
    scenarios: [
      {
        id: 'A',
        title: "Volume production (at least Phase 1) in 2026; '>80% yield' depends on node and definition",
        probability: "Medium-high probability",
        reasoningSteps: [
          {
            step: 1,
            title: "TSMC has publicly advanced Arizona Fab 1 milestones with clear expansion/Phase 2 cadence",
            forks: 17
          },
          {
            step: 2,
            title: "If '2026 volume production' refers to a mature advanced node like N4/N4P, achieving high yield is more feasible",
            forks: 11
          },
          {
            step: 3,
            title: "But 'yield >80%' must be defined: electrical yield, final die yield, or product-specific shippable yield",
            forks: 8
          }
        ],
        outcomes: [
          "2026: volume production holds (external shipments / scale ramp)",
          "Yield: on mature nodes and mature products, >80% becomes much more likely"
        ]
      }
    ],
    lastUpdated: "5 days ago",
    outcomes: []
  }
];

const DecisionSandboxView = ({ onOpportunityClick }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 text-slate-900">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-md">
              <BrainCircuit className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Decision Sandbox</h1>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Title - Not sticky, scrolls with content */}
        <div className="px-4 py-3 mb-2">
          <h2 className="text-sm text-slate-500">
            Explore how different futures could unfold, or run your own simulation.
          </h2>
        </div>
        
        {/* Cards - Full width, no padding */}
        <div className="space-y-4 px-4">
        {DECISION_SANDBOX_OPPORTUNITIES.map((opportunity) => {
          const handleCardClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onOpportunityClick) {
              onOpportunityClick(opportunity);
            }
          };
          
          return (
            <button
              key={opportunity.id}
              onClick={handleCardClick}
              type="button"
              className="w-full text-left bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="p-5 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3 leading-relaxed">
                    {opportunity.question}
                  </h3>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                      <div className="text-xs font-semibold text-purple-700 mb-1 uppercase tracking-wide">
                        Likely outcome
                      </div>
                    <div className="text-sm font-medium text-slate-800 leading-relaxed">
                      {opportunity.mostLikelyOutcome}
                    </div>
                  </div>
                </div>
                
                {opportunity.userSimulationResult && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-slate-500 mb-1">Your latest simulation:</div>
                    <div className="text-sm text-slate-700 font-medium">
                      {opportunity.userSimulationResult}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-end mt-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">
                    Simulate
                    <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default DecisionSandboxView;
export { DECISION_SANDBOX_OPPORTUNITIES };
