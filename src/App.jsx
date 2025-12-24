import React, { useState, useRef, useEffect } from 'react';

import { 

  Signal, 

  TrendingUp, 

  PieChart, 

  User, 

  Users, 

  MessageSquare, 

  ChevronLeft, 

  Search,

  Bell,

  Cpu,

  Globe,

  Share2,

  Hexagon,

  BarChart3,

  Bookmark,

  Info,

  ChevronDown,

  ChevronUp,

  Clock,

  CheckCircle2,

  AlertCircle,

  ThumbsUp,

  ThumbsDown,

  Zap,

  Target,

  ArrowRight,

  Bot,

  Send,

  ArrowUpRight,

  MoreHorizontal,

  X,

  Edit3,

  Award,

  RefreshCw,

  Sparkles,

  Search as SearchIcon,

  FileText,

  Flame,

  Newspaper,

  Loader2,

  Trophy,

  History,

  Check,

  BrainCircuit,

  TrendingDown,

  Activity,

  Star,

  Medal,

  Crown,

  Lightbulb,

  List,

  Plus

} from 'lucide-react';

// Import components
import DetailPage from './components/DetailPage';
import NewsDetailPage from './components/NewsDetailPage';
import SettledDetailPage from './components/SettledDetailPage';
import DriversListView from './components/DriversListView';
import OpportunitiesListView from './components/OpportunitiesListView';
import AIChatView from './components/AIChatView';
import CollectiveReasoningView from './components/CollectiveReasoningView';
import AddDriverView from './components/AddDriverView';
import MyGrowthViewBasic from './components/MyGrowthView.basic-1222';
import MyGrowthViewCognition from './components/MyGrowthView.cognition-1222';
import FeedView from './components/FeedView';
import PredictionCard from './components/PredictionCard';
import GenericListView from './components/GenericListView';

// Version configuration - 可以切换 'basic-1222' 或 'cognition-1222'
const ME_VIEW_VERSION = 'cognition-1222'; // 切换到 'basic-1222' 使用基础版本

// --- GEMINI API SETUP ---

const apiKey = ""; // API Key injected by environment

const callGemini = async (prompt, systemInstruction = "") => {

  try {

    const response = await fetch(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,

      {

        method: 'POST',

        headers: {

          'Content-Type': 'application/json',

        },

        body: JSON.stringify({

          contents: [{ parts: [{ text: prompt }] }],

          systemInstruction: { parts: [{ text: systemInstruction }] },

        }),

      }

    );

    if (!response.ok) {

      throw new Error(`HTTP error! status: ${response.status}`);

    }

    const data = await response.json();

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

  } catch (error) {

    console.error("Gemini API Error:", error);

    return "I'm having trouble connecting to the neural link right now. Please try again later.";

  }

};

/**

 * MOCK DATA

 */

const NEWS_DETAILS = `US President Donald Trump has authorized the CIA to prepare covert operations inside Venezuela as part of a broader pressure campaign against President Nicolas Maduro's government, according to a report Tuesday.

The New York Times reported, citing multiple people briefed on the matter, that Trump signed off on potential covert measures that could be meant to prepare a battlefield for further action.`;

const RULES_TEXT = `If the United States conducts a military attack on Venezuelan territory or military forces before January 1, 2026, this question will resolve as Yes.`;

// Drivers Data

const MOCK_DRIVERS = [

  {

    id: 'd1',

    side: 'yes',

    claim: 'The United States has designated the Maduro regime and senior military officials in Venezuela as a "narcoterrorist organization."',

    evidence: 'Defense Secretary Pete Hegseth announced the launch of Operation Southern Spear, stating clearly: "This is not an invasion, but a removal of a malignant threat."',

    strength: 'High',

    votes: 1240,

    liked: false

  },

  {

    id: 'd2',

    side: 'yes',

    claim: 'Increased military movement observed in the Caribbean Sea near Venezuelan territorial waters.',

    evidence: 'Satellite imagery from Maxar Technologies shows a 40% increase in naval vessel deployment in Key West naval base over the last 48 hours.',

    strength: 'Medium',

    votes: 850,

    liked: false

  },

  {

    id: 'd3',

    side: 'no',

    claim: 'Diplomatic back-channels remain open, suggesting a preference for negotiated transition.',

    evidence: 'State Department officials confirmed a secret meeting with Maduro representatives in Mexico City last Tuesday.',

    strength: 'High',

    votes: 920,

    liked: false

  },

   {

    id: 'd4',

    side: 'yes',

    claim: 'Domestic political pressure requires a "strongman" foreign policy win before midterms.',

    evidence: 'Recent polling data in swing states shows 65% approval for "decisive action against dictators".',

    strength: 'Low',

    votes: 340,

    liked: false

  }

];

// Expanded Opportunities Data

const MOCK_OPPORTUNITIES = [

  {

    id: 'o1',

    side: 'yes',

    title: 'Financial Arbitrage',

    type: 'Volatility Trading',

    roi: '20% - 50% (Lev)',

    action: 'When diplomatic rhetoric is aggressive, Long Crude Oil Volatility (OVX) or Long Defense ETFs (e.g., ITA). If no actual war occurs, short the oil futures at the panic peak.',

    probability: '75%',

    votes: 300,

    reasoningChain: 'Rising tension -> Market panic -> Fears of oil supply disruption -> Spread between Brent and Heavy Crude widens.'

  },

  {

    id: 'o2',

    side: 'yes',

    title: 'Supply/Demand Arbitrage',

    type: 'Commodities Trade',

    roi: '100% - 300%',

    action: 'Stockpile small generators, water purification tablets, and Starlink terminals in Colombia or the Caribbean. Sell at a premium via border trade channels.',

    probability: '90%',

    votes: 215,

    reasoningChain: 'Sanctions/Blockade -> Extreme shortage of gasoline and consumer goods -> Demand for goods on nearby islands acting as smuggling hubs skyrockets.'

  },

  {

    id: 'o3',

    side: 'yes',

    title: 'Traffic Arbitrage',

    type: 'Attention Hacking',

    roi: 'High CPM',

    action: 'Mass-produce short videos/articles with titles like "US Carrier Strike Group Approaches Caribbean?" Target Preppers. Monetize via affiliate links for Survival Kits.',

    probability: '100%',

    votes: 180,

    reasoningChain: 'Public fear regarding war is primal -> "Suspense of Imminent War" is a massive traffic goldmine regardless of outcome.'

  },

  {

    id: 'o4',

    side: 'yes',

    title: 'Labor Arbitrage',

    type: 'Wage / Geo-arbitrage',

    roi: '50% - 70% savings',

    action: 'Build a cross-border remote agency recruiting Venezuelan programmers/designers. Outsource them to US/EU markets to earn the spread.',

    probability: '85%',

    votes: 150,

    reasoningChain: 'Instability -> Educated youth need USD -> Willing to accept remote work at low rates ($3/hr) despite high skill level.'

  }

];

const MOCK_COMMENTS = [

  {

    id: 'c1',

    user: 'AlphaSeeker',

    avatar: 'AS',

    text: 'The probability of direct intervention is overstated. Look at the logistics—it takes months to mobilize for a ground invasion.',

    prediction: 'No',

    time: '2h ago',

    likes: 45

  },

  {

    id: 'c2',

    user: 'GeoMacro_Analyst',

    avatar: 'GM',

    text: 'Disagree. The "narcoterrorist" designation is the legal framework they needed. This is moving fast.',

    prediction: 'Yes',

    time: '1h ago',

    likes: 28

  }

];

const MOCK_RELATED_QUESTIONS = [

  {

    id: 101,

    category: "Geopolitics",

    newsTitle: "Regional Tensions Escalate as Brazil Reinforces Northern Border",

    question: "Will Venezuela enter a new hot war with anyone by the end of 2026?",

    imageGradient: "from-orange-500 to-red-600",

    stats: { yes: 35, no: 65 },

    trending: 'yes',

    followers: 850,

    drivers: 15,

    timeLeft: "1 year left"

  }

];

const MOCK_CARDS = [

  {

    id: 0,

    status: 'closed', // New status

    outcome: 'yes',

    userPrediction: 'yes', // Mock user predicted correctly

    category: "Space",

    newsTitle: "Starship Successfully Reaches Orbit on Flight 5",

    question: "Did Starship reach orbit before 2025?",

    imageGradient: "from-indigo-600 to-purple-600",

    stats: { yes: 100, no: 0 }, // Resolved

    trending: 'no',

    followers: 15000,

    drivers: 200,

    timeLeft: "Ended Dec 20, 2024",

    impactEvents: [

       { date: 'Nov 15', title: 'FAA Approval Granted', impact: '+15% prob', type: 'positive' },

       { date: 'Dec 10', title: 'Successful Static Fire', impact: '+10% prob', type: 'positive' },

       { date: 'Dec 20', title: 'Launch Success confirmed by telemetry', impact: 'Resolved Yes', type: 'positive' }

    ],

    winningOpportunities: [

        {

            id: 'wo1',

            title: 'Aerospace ETF Long',

            roi: '45%',

            action: 'Holding ITA ETF through the launch window generated significant alpha as SpaceX success lifted the entire sector.',

            confidence: 'High'

        },

        {

            id: 'wo2',

            title: 'Material Science Suppliers',

            roi: '120%',

            action: 'Suppliers of stainless steel alloys used in Starship saw stock bumps immediately post-launch.',

            confidence: 'Medium'

        }

    ]

  },

  {

    id: 1,

    isNew: true, // Highlighted

    category: "Politics",

    newsTitle: "Trump Said to Authorize C.I.A. Plans for Covert Action in Venezuela",

    question: "Will the United States attack Venezuela before 2026?",

    imageGradient: "from-blue-600 to-slate-700", 

    stats: { yes: 45, no: 55 },

    trending: 'yes',

    followers: 1280,

    drivers: 23,

    timeLeft: "2 months left"

  },

  {

    id: 2,

    category: "Tech",

    newsTitle: "OpenAI Announces GPT-5 Beta Release Date Rumors",

    question: "Will GPT-5 achieve AGI definition benchmarks by Q4 2025?",

    imageGradient: "from-purple-600 to-indigo-700",

    stats: { yes: 72, no: 28 },

    trending: 'yes',

    followers: 3450,

    drivers: 156,

    timeLeft: "8 months left"

  },

  {

    id: 3,

    category: "Business",

    newsTitle: "Federal Reserve Signals Potential Rate Cut in Upcoming Meeting",

    question: "Will the Fed cut interest rates by at least 25bps in March?",

    imageGradient: "from-emerald-600 to-teal-700",

    stats: { yes: 30, no: 70 },

    trending: 'no',

    followers: 890,

    drivers: 12,

    timeLeft: "1 week left"

  }

];

// USER STATS MOCK

const USER_PROFILE = {

  name: "Alex Trader",

  handle: "@alxt_macro",

  bio: "Contrarian thinker. Focused on Geopolitics & Tech Hardware.",

  avatar: "AT",

  followers: 1205,

  following: 45,

  badges: [

    { type: 'identity', label: 'AI Domain Expert', level: 3, icon: '🤖', color: 'bg-purple-50 text-purple-600 border-purple-100' },

    { type: 'identity', label: 'U.S. Politics Expert', level: 2, icon: '🏛️', color: 'bg-blue-100 text-blue-600 border-blue-100' },

    { type: 'achievement', label: 'Oct Top 10%', level: 1, icon: '🏆', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' },

  ]

};

const USER_METRICS = {

  predictions: { total: 142, tracked: 30, percentile: 15 },

  streak: { days: 12, percentile: 5 },

  contributions: { drivers: 24, opportunities: 8, percentile: 2 },

  influence: { score: 8500, percentile: 1 }, // Clicks + Votes on content

  social: { votesCast: 320, comments: 56 },

  correctPredictions: 89

};

// Cognitive Ability Dimensions (0-10 scale based on percentile)
const COGNITIVE_DIMENSIONS = {
  breadth: {
    score: 1.5, // 0-10 scale, based on predictions.total percentile
    explanation: "Measures the scope of user's cognitive engagement through the total number of predictions participated in."
  },
  versatility: {
    score: 3.2, // Based on number of distinct tags/categories
    explanation: "Measures the variety of cognitive domains explored through the number of distinct tags covered in user's predictions."
  },
  accuracy: {
    score: 8.5, // Based on accuracy percentile
    explanation: "Measures the precision of user's judgment through the percentage of correct predictions made."
  },
  conviction: {
    score: 6.8, // Based on average predicted probability on correct predictions
    explanation: "Measures user's boldness and risk-taking tendency through the average predicted probability on predictions that turned out to be correct."
  },
  influence: {
    score: 9.9, // Based on followers, votes on contributions
    explanation: "Measures the impact of user's contributions through followers count, votes received on contributed drivers and opportunities."
  },
  analysis: {
    score: 4.5, // Based on votes cast + contributions
    explanation: "Measures user's analytical thinking through votes cast and contributions of drivers and opportunities."
  }
};

const USER_STATS = {

  accuracy: 65,

  topDomain: 'Tech Hardware',

};

const TREND_DATA = [

  { month: 'Jan', user: 55, platform: 50, ai: 60, vol: 10 },

  { month: 'Feb', user: 58, platform: 52, ai: 62, vol: 15 },

  { month: 'Mar', user: 52, platform: 51, ai: 65, vol: 12 },

  { month: 'Apr', user: 65, platform: 53, ai: 68, vol: 20 },

  { month: 'May', user: 72, platform: 55, ai: 70, vol: 25 },

  { month: 'Jun', user: 68, platform: 56, ai: 72, vol: 30 },

];

// Cognition Radar Data - 6 months trend for each dimension
const COGNITION_TREND_DATA = {
  predictions: [
    { month: 'Jan', user: 8, community: 5 },
    { month: 'Feb', user: 12, community: 6 },
    { month: 'Mar', user: 10, community: 5 },
    { month: 'Apr', user: 15, community: 6 },
    { month: 'May', user: 18, community: 7 },
    { month: 'Jun', user: 16, community: 7 }
  ],
  contributions: [
    { month: 'Jan', user: 2, community: 1 },
    { month: 'Feb', user: 3, community: 1.5 },
    { month: 'Mar', user: 2, community: 1 },
    { month: 'Apr', user: 4, community: 2 },
    { month: 'May', user: 5, community: 2 },
    { month: 'Jun', user: 4, community: 2 }
  ],
  accuracy: [
    { month: 'Jan', user: 55, community: 50, ai: 60 },
    { month: 'Feb', user: 58, community: 52, ai: 62 },
    { month: 'Mar', user: 52, community: 51, ai: 65 },
    { month: 'Apr', user: 65, community: 53, ai: 68 },
    { month: 'May', user: 72, community: 55, ai: 70 },
    { month: 'Jun', user: 68, community: 56, ai: 72 }
  ],
  influence: [
    { month: 'Jan', user: 1200, community: 800 },
    { month: 'Feb', user: 1500, community: 900 },
    { month: 'Mar', user: 1400, community: 850 },
    { month: 'Apr', user: 1800, community: 1000 },
    { month: 'May', user: 2200, community: 1100 },
    { month: 'Jun', user: 2000, community: 1050 }
  ]
};

// Historical records mock data
const HISTORICAL_RECORDS = {
  predictions: [
    { 
      id: 1, 
      title: "Will GPT-5 achieve AGI by Q4 2025?", 
      date: "2024-06-15", 
      status: "active", 
      prediction: "Yes", 
      timeAgo: "2h ago",
      topOptions: [
        { option: "Yes", votes: 1250 },
        { option: "No", votes: 890 }
      ]
    },
    { 
      id: 2, 
      title: "Will the Fed cut rates in March?", 
      date: "2024-06-10", 
      status: "active", 
      prediction: "No", 
      timeAgo: "3d ago",
      topOptions: [
        { option: "Yes", votes: 680 },
        { option: "No", votes: 920 }
      ]
    },
    { 
      id: 3, 
      title: "Will Starship reach orbit before 2025?", 
      date: "2024-05-20", 
      status: "closed", 
      prediction: "Yes", 
      outcome: "Yes", 
      timeAgo: "1w ago",
      topOptions: [
        { option: "Yes", votes: 1100 },
        { option: "No", votes: 450 }
      ]
    },
    { 
      id: 4, 
      title: "Will US attack Venezuela before 2026?", 
      date: "2024-05-15", 
      status: "active", 
      prediction: "Yes", 
      timeAgo: "2w ago",
      topOptions: [
        { option: "Yes", votes: 320 },
        { option: "No", votes: 580 }
      ]
    }
  ],
  contributions: [
    { 
      id: 1, 
      type: "driver", 
      title: "Increased military movement observed", 
      date: "2024-06-12", 
      votes: 45, 
      timeAgo: "5h ago",
      predictionTitle: "Will US attack Venezuela before 2026?"
    },
    { 
      id: 2, 
      type: "opportunity", 
      title: "Volatility spike expected in Q3 2024 due to election uncertainty", 
      date: "2024-06-08", 
      votes: 32, 
      timeAgo: "1d ago",
      predictionTitle: "Will the Fed cut rates in March?"
    },
    { 
      id: 3, 
      type: "driver", 
      title: "Diplomatic back-channels remain open", 
      date: "2024-05-25", 
      votes: 28, 
      timeAgo: "1w ago",
      predictionTitle: "Will US attack Venezuela before 2026?"
    },
    { 
      id: 4, 
      type: "opportunity", 
      title: "Supply chain disruption creates arbitrage window", 
      date: "2024-05-20", 
      votes: 21, 
      timeAgo: "2w ago",
      predictionTitle: "Will Starship reach orbit before 2025?"
    }
  ],
  interactions: [
    { 
      id: 1, 
      type: "vote", 
      title: "Voted on driver", 
      target: "Increased military movement observed", 
      date: "2024-06-14", 
      timeAgo: "1h ago",
      predictionTitle: "Will US attack Venezuela before 2026?"
    },
    { 
      id: 2, 
      type: "vote", 
      title: "Voted on opportunity", 
      target: "Volatility spike expected in Q3 2024", 
      date: "2024-06-11", 
      timeAgo: "4h ago",
      predictionTitle: "Will the Fed cut rates in March?"
    },
    { 
      id: 3, 
      type: "vote", 
      title: "Voted on prediction", 
      target: "Will GPT-5 achieve AGI by Q4 2025?", 
      date: "2024-06-09", 
      timeAgo: "2d ago",
      predictionTitle: "Will GPT-5 achieve AGI by Q4 2025?"
    },
    { 
      id: 4, 
      type: "vote", 
      title: "Voted on driver", 
      target: "Diplomatic back-channels remain open", 
      date: "2024-06-05", 
      timeAgo: "1w ago",
      predictionTitle: "Will US attack Venezuela before 2026?"
    }
  ]
};

const FILTERS = ["Latest", "Business", "Politics", "Tech"];

const DETAIL_TABS = ["Question", "Reasoning", "Opportunities", "Discussions"];

// Export mock data for use in components
export { 
  MOCK_DRIVERS, 
  MOCK_OPPORTUNITIES, 
  MOCK_COMMENTS, 
  MOCK_CARDS, 
  USER_PROFILE, 
  USER_METRICS, 
  USER_STATS,
  TREND_DATA,
  COGNITION_TREND_DATA,
  COGNITIVE_DIMENSIONS,
  HISTORICAL_RECORDS,
  NEWS_DETAILS,
  RULES_TEXT,
  callGemini
};

export default function App() {

  const [activeTab, setActiveTab] = useState('signal');

  const [selectedCard, setSelectedCard] = useState(null);

  const [detailSubView, setDetailSubView] = useState(null); 

  const [userPrediction, setUserPrediction] = useState(null);

  const [drivers, setDrivers] = useState(MOCK_DRIVERS);

  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);

  // Helper to handle navigation within Me tab

  const handleMeNavigation = (view) => {

    setDetailSubView(view);

  };

  const renderContent = () => {

    // 1. Prediction Card Details Flow

    if (selectedCard) {

      if (detailSubView === 'news') {

         return (

           <NewsDetailPage 

             data={selectedCard}

             onBack={() => {

                setSelectedCard(null);

                setDetailSubView(null);

             }}

             onGoToPrediction={() => setDetailSubView(null)} 

           />

         );

      }

      if (detailSubView === 'drivers') {

        return <DriversListView onBack={() => setDetailSubView(null)} drivers={drivers} />;

      }

      if (detailSubView === 'opportunities') {

        return <OpportunitiesListView onBack={() => setDetailSubView(null)} opportunities={opportunities} />;

      }

      if (detailSubView === 'aiChat') {

        return (

          <AIChatView 

            onBack={() => setDetailSubView(null)} 

            questionTitle={selectedCard.question}

            onAddDriverFromAI={(newDriver) => setDrivers(prev => [newDriver, ...prev])}

          />

        );

      }

      if (detailSubView === 'collectiveReasoning') {

        return (

          <CollectiveReasoningView 

            prediction={userPrediction} 

            onBack={() => setDetailSubView(null)}

            onAddDriver={() => setDetailSubView('addDriver')}

            onUpdatePrediction={setUserPrediction}

          />

        );

      }

      if (detailSubView === 'addDriver') {

        return (

          <AddDriverView 

            onBack={() => setDetailSubView('collectiveReasoning')}

            onSubmit={() => setDetailSubView(null)} 

          />

        );

      }

      if (selectedCard.status === 'closed') {

         return (

           <SettledDetailPage 

             data={selectedCard}

             onBack={() => setDetailSubView('news')} 

           />

         );

      }

      return (

        <DetailPage 

          data={selectedCard} 

          onBack={() => setDetailSubView('news')} 

          setSubView={setDetailSubView}

          drivers={drivers}

          opportunities={opportunities}

          onPredict={(pred) => {

            setUserPrediction(pred);

            setDetailSubView('collectiveReasoning');

          }}

        />

      );

    }

    // 2. Profile / Me Tab Flow

    if (activeTab === 'me') {

      if (detailSubView === 'ai_insight') {

        return (

          <AIChatView 

            onBack={() => setDetailSubView(null)} 

            questionTitle="Personal Growth Analysis"

            initialContext={`Based on the user's data:\n- Accuracy: ${USER_STATS.accuracy}%\n- Top Domain: ${USER_STATS.topDomain}\n- Bias Tendency: Overconfident in Politics\n\nProvide a deep analysis of their betting behavior, point out blind spots (like ignored economic drivers), and suggest exclusive opportunities in Space Tech.`}

            onAddDriverFromAI={() => {}}

            isAIInsight={true}

          />

        );

      }

      if (detailSubView && detailSubView.startsWith('list_')) {

        return <GenericListView title={detailSubView.replace('list_', '').replace('_', ' ').toUpperCase()} onBack={() => setDetailSubView(null)} />;

      }

      // 根据版本切换使用不同的组件
      const MyGrowthView = ME_VIEW_VERSION === 'cognition-1222' 
        ? MyGrowthViewCognition 
        : MyGrowthViewBasic;
      
      return <MyGrowthView onNavigate={handleMeNavigation} />;

    }

    // 3. Other Tabs

    switch (activeTab) {

      case 'signal':

        return (

          <FeedView 

            onNewsClick={(data) => {

               setSelectedCard(data);

               setDetailSubView('news'); 

            }}

            onQuestionClick={(data) => {

               setSelectedCard(data);

               setDetailSubView(null); 

            }}

          />

        );

      case 'predict':

        return <div className="flex items-center justify-center h-full text-slate-400 bg-gray-50">Predict View</div>;

      case 'trend':

        return <div className="flex items-center justify-center h-full text-slate-400 bg-gray-50">Trend View</div>;

      default:

        return (

          <FeedView 

            onNewsClick={(data) => {

               setSelectedCard(data);

               setDetailSubView('news'); 

            }}

            onQuestionClick={(data) => {

               setSelectedCard(data);

               setDetailSubView(null); 

            }}

          />

        );

    }

  };

  return (

    <div className="bg-gray-50 h-screen w-full max-w-md mx-auto relative overflow-hidden flex flex-col font-sans text-slate-900 border-x border-gray-200 shadow-2xl">

      <main className="flex-1 overflow-hidden relative">

        {renderContent()}

      </main>

      {!selectedCard && (

        <nav className="bg-white border-t border-gray-200 h-20 px-6 flex justify-between items-center z-20 pb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">

          <button 

            onClick={() => { setActiveTab('signal'); setDetailSubView(null); }}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'signal' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <Signal size={24} />

            <span className="text-[10px] font-medium">Signal</span>

          </button>

          

          <button 

            onClick={() => setActiveTab('predict')}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'predict' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <Hexagon size={24} />

            <span className="text-[10px] font-medium">Predict</span>

          </button>

          

          <button 

            onClick={() => setActiveTab('trend')}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'trend' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <BarChart3 size={24} />

            <span className="text-[10px] font-medium">Trend</span>

          </button>

          

          <button 

            onClick={() => { setActiveTab('me'); setDetailSubView(null); }}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'me' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <User size={24} />

            <span className="text-[10px] font-medium">Me</span>

          </button>

        </nav>

      )}

    </div>

  );

}

