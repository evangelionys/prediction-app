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

  Plus,

  Heart

} from 'lucide-react';

// Import components
import DetailPage from './components/DetailPage';
import NewsDetailPage from './components/NewsDetailPage';
import SettledDetailPage from './components/SettledDetailPage';
import AssetOpportunityDetailPage from './components/AssetOpportunityDetailPage';
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
import TrendView from './components/TrendView';
import UserProfileView from './components/UserProfileView';
import FollowedView from './components/FollowedView';
import SearchView from './components/SearchView';
import ActivitiesListView from './components/ActivitiesListView';
import FollowersFollowingListView from './components/FollowersFollowingListView';
import OpportunityDetailPage from './components/OpportunityDetailPage';
import ReasoningPathView from './components/ReasoningPathView';
import DecisionSandboxView from './components/DecisionSandboxView';
import { DECISION_SANDBOX_OPPORTUNITIES } from './components/DecisionSandboxView';
import DifferenceDetailView from './components/DifferenceDetailView';
import DifferencesListView from './components/DifferencesListView';

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

  name: "Alex Thinker",

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
    explanation: "Measures the scope of the user's cognitive engagement through the total number of Predictions they participated in."
  },
  versatility: {
    score: 3.2, // Based on number of distinct tags/categories
    explanation: "Measures the diversity of topics the user explored through the number of distinct tags covered across their Predictions."
  },
  accuracy: {
    score: 8.5, // Based on accuracy percentile
    explanation: "Measures the user's judgment precision through the percentage of their Predictions that turned out to be correct."
  },
  conviction: {
    score: 6.8, // Based on average predicted probability on correct predictions
    explanation: "Measures the user's conviction (boldness) through the average predicted probability on the Predictions that turned out to be correct."
  },
  influence: {
    score: 9.9, // Based on followers, votes on contributions
    explanation: "Measures the user's influence through a weighted count of high-quality Predictions, Drivers, and Opportunities they created."
  },
  judgment: {
    score: 4.5, // Based on votes cast + contributions
    explanation: "Measures the user's judgment through the number of Predictions in which they performed judgment actions (e.g., voting on Drivers, Opportunities)."
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
      isCreated: false,
      isPredicted: true,
      isFollowed: true,
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
      isCreated: false,
      isPredicted: true,
      isFollowed: false,
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
      isCreated: true,
      isPredicted: true,
      isFollowed: false,
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
      isCreated: true,
      isPredicted: false,
      isFollowed: true,
      topOptions: [
        { option: "Yes", votes: 320 },
        { option: "No", votes: 580 }
      ]
    },
    { 
      id: 5, 
      title: "Will AI replace 50% of jobs by 2030?", 
      date: "2024-06-12", 
      status: "active", 
      prediction: "No", 
      timeAgo: "1d ago",
      isCreated: false,
      isPredicted: true,
      isFollowed: true,
      topOptions: [
        { option: "Yes", votes: 850 },
        { option: "No", votes: 620 }
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
      title: "Voted on driver", 
      target: "Diplomatic back-channels remain open", 
      date: "2024-06-05", 
      timeAgo: "1w ago",
      predictionTitle: "Will US attack Venezuela before 2026?"
    },
    { 
      id: 4, 
      type: "vote", 
      title: "Voted on opportunity", 
      target: "Supply chain disruption creates arbitrage window", 
      date: "2024-06-03", 
      timeAgo: "2w ago",
      predictionTitle: "Will Starship reach orbit before 2025?"
    }
  ]
};

const FILTERS = ["Latest", "Business", "Politics", "Tech"];

const DETAIL_TABS = ["Question", "Opportunities", "Discussions"];

// Leaderboard Data
const LEADERBOARD_DATA = {
  influence: [
    { id: 1, userId: 'user1', username: 'Alex Chen', avatar: 'AC', category: 'Tech', drivers: 12, opportunities: 8, score: 1250 },
    { id: 2, userId: 'user2', username: 'Sarah Kim', avatar: 'SK', category: 'Business', drivers: 15, opportunities: 5, score: 1180 },
    { id: 3, userId: 'user3', username: 'Mike Johnson', avatar: 'MJ', category: 'Politics', drivers: 10, opportunities: 12, score: 1100 },
    { id: 4, userId: 'user4', username: 'Emma Wilson', avatar: 'EW', category: 'Tech', drivers: 8, opportunities: 6, score: 980 },
    { id: 5, userId: 'user5', username: 'David Lee', avatar: 'DL', category: 'Business', drivers: 9, opportunities: 4, score: 850 },
    { id: 6, userId: 'user6', username: 'Lisa Zhang', avatar: 'LZ', category: 'Politics', drivers: 7, opportunities: 9, score: 720 },
    { id: 7, userId: 'user7', username: 'Tom Brown', avatar: 'TB', category: 'Tech', drivers: 6, opportunities: 5, score: 650 },
    { id: 8, userId: 'user8', username: 'Anna Taylor', avatar: 'AT', category: 'Business', drivers: 5, opportunities: 7, score: 580 },
    { id: 9, userId: 'user9', username: 'Chris Wang', avatar: 'CW', category: 'Politics', drivers: 4, opportunities: 6, score: 520 },
    { id: 10, userId: 'user10', username: 'Maria Garcia', avatar: 'MG', category: 'Tech', drivers: 3, opportunities: 4, score: 450 }
  ],
  accuracy: [
    { id: 1, userId: 'user1', username: 'Alex Chen', avatar: 'AC', category: 'Tech', accuracy: 92, totalPredictions: 25, correctPredictions: 23 },
    { id: 2, userId: 'user2', username: 'Sarah Kim', avatar: 'SK', category: 'Business', accuracy: 88, totalPredictions: 30, correctPredictions: 26 },
    { id: 3, userId: 'user3', username: 'Mike Johnson', avatar: 'MJ', category: 'Politics', accuracy: 88, totalPredictions: 28, correctPredictions: 25 },
    { id: 4, userId: 'user4', username: 'Emma Wilson', avatar: 'EW', category: 'Tech', accuracy: 85, totalPredictions: 20, correctPredictions: 17 },
    { id: 5, userId: 'user5', username: 'David Lee', avatar: 'DL', category: 'Business', accuracy: 82, totalPredictions: 22, correctPredictions: 18 },
    { id: 6, userId: 'user6', username: 'Lisa Zhang', avatar: 'LZ', category: 'Politics', accuracy: 80, totalPredictions: 18, correctPredictions: 14 },
    { id: 7, userId: 'user7', username: 'Tom Brown', avatar: 'TB', category: 'Tech', accuracy: 78, totalPredictions: 15, correctPredictions: 12 },
    { id: 8, userId: 'user8', username: 'Anna Taylor', avatar: 'AT', category: 'Business', accuracy: 75, totalPredictions: 16, correctPredictions: 12 },
    { id: 9, userId: 'user9', username: 'Chris Wang', avatar: 'CW', category: 'Politics', accuracy: 73, totalPredictions: 14, correctPredictions: 10 },
    { id: 10, userId: 'user10', username: 'Maria Garcia', avatar: 'MG', category: 'Tech', accuracy: 70, totalPredictions: 12, correctPredictions: 8 }
  ],
  aiModels: [
    { id: 'ai1', name: 'Miromind', accuracy: 94, totalPredictions: 500, correctPredictions: 470, isAI: true },
    { id: 'ai2', name: 'Gemini-3', accuracy: 91, totalPredictions: 480, correctPredictions: 437, isAI: true },
    { id: 'ai3', name: 'Claude-4', accuracy: 89, totalPredictions: 450, correctPredictions: 401, isAI: true },
    { id: 'ai4', name: 'GPT-5', accuracy: 87, totalPredictions: 520, correctPredictions: 452, isAI: true }
  ],
  // 当前用户数据
  currentUser: {
    influence: { score: 850, drivers: 24, opportunities: 8 },
    accuracy: { accuracy: 65, totalPredictions: 142, correctPredictions: 89 }
  },
  opportunity: [
    { 
      id: 1, 
      content: 'Volatility spike expected in Q3 2024 due to election uncertainty', 
      action: 'Consider hedging positions before Q3 earnings season',
      category: 'Business',
      predictionId: 3,
      predictionTitle: 'Will the Fed cut rates in March?',
      contributorId: 'user2',
      contributorName: 'Sarah Kim',
      contributorAvatar: 'SK',
      votes: 245
    },
    { 
      id: 2, 
      content: 'AI chip supply chain disruption creates arbitrage window', 
      action: 'Monitor TSMC and NVIDIA supply chain updates',
      category: 'Tech',
      predictionId: 2,
      predictionTitle: 'Will GPT-5 achieve AGI by Q4 2025?',
      contributorId: 'user1',
      contributorName: 'Alex Chen',
      contributorAvatar: 'AC',
      votes: 198
    },
    { 
      id: 3, 
      content: 'Diplomatic back-channels remain open despite public tensions', 
      action: 'Watch for behind-the-scenes negotiation signals',
      category: 'Politics',
      predictionId: 1,
      predictionTitle: 'Will US attack Venezuela before 2026?',
      contributorId: 'user3',
      contributorName: 'Mike Johnson',
      contributorAvatar: 'MJ',
      votes: 176
    },
    { 
      id: 4, 
      content: 'SpaceX contract opportunity matches tech hardware expertise', 
      action: 'Research SpaceX supplier chain and contract timeline',
      category: 'Tech',
      predictionId: 0,
      predictionTitle: 'Will Starship reach orbit before 2025?',
      contributorId: 'user4',
      contributorName: 'Emma Wilson',
      contributorAvatar: 'EW',
      votes: 152
    },
    { 
      id: 5, 
      content: 'Supply chain disruption creates arbitrage window', 
      action: 'Identify alternative suppliers and pricing opportunities',
      category: 'Business',
      predictionId: 3,
      predictionTitle: 'Will the Fed cut rates in March?',
      contributorId: 'user5',
      contributorName: 'David Lee',
      contributorAvatar: 'DL',
      votes: 134
    },
    { 
      id: 6, 
      content: 'Regulatory changes expected in Q4 create compliance opportunities', 
      action: 'Prepare compliance frameworks early',
      category: 'Business',
      predictionId: 3,
      predictionTitle: 'Will the Fed cut rates in March?',
      contributorId: 'user8',
      contributorName: 'Anna Taylor',
      contributorAvatar: 'AT',
      votes: 118
    },
    { 
      id: 7, 
      content: 'Military movement patterns suggest de-escalation timeline', 
      action: 'Monitor official statements and troop movements',
      category: 'Politics',
      predictionId: 1,
      predictionTitle: 'Will US attack Venezuela before 2026?',
      contributorId: 'user6',
      contributorName: 'Lisa Zhang',
      contributorAvatar: 'LZ',
      votes: 105
    },
    { 
      id: 8, 
      content: 'Quantum computing breakthrough creates investment window', 
      action: 'Research quantum computing startups and partnerships',
      category: 'Tech',
      predictionId: 2,
      predictionTitle: 'Will GPT-5 achieve AGI by Q4 2025?',
      contributorId: 'user7',
      contributorName: 'Tom Brown',
      contributorAvatar: 'TB',
      votes: 98
    },
    { 
      id: 9, 
      content: 'Trade agreement negotiations show positive signals', 
      action: 'Watch for trade deal announcements and market impacts',
      category: 'Politics',
      predictionId: 1,
      predictionTitle: 'Will US attack Venezuela before 2026?',
      contributorId: 'user9',
      contributorName: 'Chris Wang',
      contributorAvatar: 'CW',
      votes: 87
    },
    { 
      id: 10, 
      content: 'Semiconductor market recovery creates entry opportunity', 
      action: 'Analyze semiconductor stock valuations and timing',
      category: 'Tech',
      predictionId: 0,
      predictionTitle: 'Will Starship reach orbit before 2025?',
      contributorId: 'user10',
      contributorName: 'Maria Garcia',
      contributorAvatar: 'MG',
      votes: 76
    }
  ]
};

// Followed Predictions Updates Data
const FOLLOWED_PREDICTIONS = [
  {
    id: 1,
    prediction: {
      id: 1,
      category: "Politics",
      question: "Will the United States attack Venezuela before 2026?",
      imageGradient: "from-blue-600 to-slate-700",
      stats: { yes: 45, no: 55 }
    },
    updateType: 'driver',
    driverTitle: 'Increased military movement observed',
    driverContent: 'Satellite imagery shows a 40% increase in naval vessel deployment in Key West naval base over the last 48 hours.',
    votes: 850,
    contributorName: 'Mike Johnson',
    timeAgo: '2h ago'
  },
  {
    id: 2,
    prediction: {
      id: 2,
      category: "Tech",
      question: "Will GPT-5 achieve AGI definition benchmarks by Q4 2025?",
      imageGradient: "from-purple-600 to-indigo-700",
      stats: { yes: 72, no: 28 }
    },
    updateType: 'opportunity',
    opportunityTitle: 'AI chip supply chain disruption',
    opportunityContent: 'Monitor TSMC and NVIDIA supply chain updates for potential arbitrage windows.',
    votes: 198,
    contributorName: 'Alex Chen',
    timeAgo: '5h ago'
  },
  {
    id: 3,
    prediction: {
      id: 3,
      category: "Business",
      question: "Will the Fed cut interest rates by at least 25bps in March?",
      imageGradient: "from-emerald-600 to-teal-700",
      stats: { yes: 30, no: 70 }
    },
    updateType: 'vote_change',
    changeDirection: 'up',
    changePercentage: 15,
    newStats: { yes: 45, no: 55 },
    timeAgo: '1d ago'
  },
  {
    id: 4,
    prediction: {
      id: 0,
      category: "Space",
      question: "Did Starship reach orbit before 2025?",
      imageGradient: "from-indigo-600 to-purple-600",
      stats: { yes: 100, no: 0 }
    },
    updateType: 'driver',
    driverTitle: 'FAA Approval Granted',
    driverContent: 'Federal Aviation Administration has granted approval for the next launch window.',
    votes: 1240,
    contributorName: 'Sarah Kim',
    timeAgo: '3h ago'
  }
];

// Followed Users Activity Data
const FOLLOWED_USERS = [
  {
    id: 1,
    userId: 'user1',
    userName: 'Alex Chen',
    userAvatar: 'AC',
    activityType: 'new_driver',
    driverTitle: 'Increased military movement observed',
    driverContent: 'Satellite imagery from Maxar Technologies shows a 40% increase in naval vessel deployment.',
    prediction: {
      id: 1,
      category: "Politics",
      question: "Will the United States attack Venezuela before 2026?",
      imageGradient: "from-blue-600 to-slate-700"
    },
    timeAgo: '2h ago'
  },
  {
    id: 2,
    userId: 'user2',
    userName: 'Sarah Kim',
    userAvatar: 'SK',
    activityType: 'new_opportunity',
    opportunityTitle: 'Volatility spike expected in Q3 2024',
    opportunityContent: 'Consider hedging positions before Q3 earnings season due to election uncertainty.',
    prediction: {
      id: 3,
      category: "Business",
      question: "Will the Fed cut interest rates by at least 25bps in March?",
      imageGradient: "from-emerald-600 to-teal-700"
    },
    timeAgo: '4h ago'
  },
  {
    id: 3,
    userId: 'user3',
    userName: 'Mike Johnson',
    userAvatar: 'MJ',
    activityType: 'prediction',
    predictionValue: 'yes',
    predictionReason: 'Based on recent diplomatic developments and military movements, I believe the probability has increased significantly.',
    prediction: {
      id: 1,
      category: "Politics",
      question: "Will the United States attack Venezuela before 2026?",
      imageGradient: "from-blue-600 to-slate-700"
    },
    timeAgo: '6h ago'
  },
  {
    id: 4,
    userId: 'user1',
    userName: 'Alex Chen',
    userAvatar: 'AC',
    activityType: 'comment',
    commentContent: 'This is a very interesting development. The supply chain implications could be significant for the entire tech sector.',
    prediction: {
      id: 2,
      category: "Tech",
      question: "Will GPT-5 achieve AGI definition benchmarks by Q4 2025?",
      imageGradient: "from-purple-600 to-indigo-700"
    },
    timeAgo: '8h ago'
  },
  {
    id: 5,
    userId: 'user2',
    userName: 'Sarah Kim',
    userAvatar: 'SK',
    activityType: 'new_driver',
    driverTitle: 'Federal Reserve signals potential rate cut',
    driverContent: 'Recent statements from Fed officials suggest a more dovish stance than previously expected.',
    prediction: {
      id: 3,
      category: "Business",
      question: "Will the Fed cut interest rates by at least 25bps in March?",
      imageGradient: "from-emerald-600 to-teal-700"
    },
    timeAgo: '12h ago'
  }
];

// Mock User Profiles Data
const MOCK_USER_PROFILES = {
  user1: {
    id: 'user1',
    name: 'Alex Chen',
    handle: '@alexchen',
    bio: 'Tech enthusiast. Focused on AI and hardware innovation.',
    avatar: 'AC',
    followers: 2450,
    following: 120,
    badges: [
      { type: 'identity', label: 'AI Domain Expert', level: 3, icon: '🤖', color: 'bg-purple-50 text-purple-600 border-purple-100' },
      { type: 'achievement', label: 'Oct Top 10%', level: 1, icon: '🏆', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' }
    ],
    isFollowing: false
  },
  user2: {
    id: 'user2',
    name: 'Sarah Kim',
    handle: '@sarahkim',
    bio: 'Business analyst. Expert in market trends and financial predictions.',
    avatar: 'SK',
    followers: 1890,
    following: 85,
    badges: [
      { type: 'identity', label: 'Business Expert', level: 2, icon: '💼', color: 'bg-blue-50 text-blue-600 border-blue-100' }
    ],
    isFollowing: false
  },
  user3: {
    id: 'user3',
    name: 'Mike Johnson',
    handle: '@mikej',
    bio: 'Political analyst. Tracking global geopolitical developments.',
    avatar: 'MJ',
    followers: 3200,
    following: 200,
    badges: [
      { type: 'identity', label: 'Politics Expert', level: 3, icon: '🏛️', color: 'bg-blue-100 text-blue-600 border-blue-100' }
    ],
    isFollowing: true
  }
};

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
  LEADERBOARD_DATA,
  MOCK_USER_PROFILES,
  FOLLOWED_PREDICTIONS,
  FOLLOWED_USERS,
  NEWS_DETAILS,
  RULES_TEXT,
  callGemini
};

export default function App() {

  const [activeTab, setActiveTab] = useState('signal');

  const [selectedCard, setSelectedCard] = useState(null);

  const [detailSubView, setDetailSubView] = useState(null);
  
  // 使用 ref 保存进入 SettledDetailPage 之前的状态
  const previousStateRef = useRef(null);
  
  // 监听 selectedCard 变化，当它变成一个已结算的卡片时，保存之前的状态
  useEffect(() => {
    if (selectedCard && selectedCard.status === 'closed') {
      // 如果还没有保存状态，保存当前的状态（除了 selectedCard，因为它已经是新的卡片了）
      if (!previousStateRef.current) {
        previousStateRef.current = {
          detailSubView: detailSubView,
          activeTab: activeTab,
          // 注意：我们不保存 selectedCard，因为它是新的已结算卡片
        };
      }
    } else if (!selectedCard || (selectedCard && selectedCard.status !== 'closed')) {
      // 当离开 SettledDetailPage 时，清除保存的状态
      previousStateRef.current = null;
    }
  }, [selectedCard, detailSubView, activeTab]);

  const [userPrediction, setUserPrediction] = useState(null);

  const [drivers, setDrivers] = useState(MOCK_DRIVERS);

  const [opportunities, setOpportunities] = useState(MOCK_OPPORTUNITIES);
  
  // Store additional outcomes for opportunities (user-created)
  const [opportunityOutcomes, setOpportunityOutcomes] = useState({});
  // Store user saved paths: { opportunityId_scenarioId: { modifiedSteps, modifiedResult, isPrivate } }
  const [userSavedPaths, setUserSavedPaths] = useState({});
  // Store comparison data for AI Analyst
  const [comparisonData, setComparisonData] = useState(null);

  // Helper function to get AI prediction (mock for now)
  const getAIPrediction = (predictionId) => {
    // Mock AI predictions - in real app, this would come from API
    const mockAIPredictions = {
      1: { prediction: "Yes", confidence: 75 },
      2: { prediction: "Yes", confidence: 68 },
      3: { prediction: "No", confidence: 82 },
      4: { prediction: "Yes", confidence: 71 },
      5: { prediction: "No", confidence: 65 }
    };
    return mockAIPredictions[predictionId] || { prediction: "Yes", confidence: 50 };
  };

  // Helper function to calculate alignment score (0-100)
  // User option == AI top option → aligned (100), different → divergent (0)
  const calculateAlignmentScore = (userPred, aiPred) => {
    if (userPred === aiPred) return 100;
    return 0; // Different options = not aligned
  };

  // Helper function to calculate difference score (for display)
  const calculateDifference = (userPred, aiPred) => {
    if (userPred === aiPred) return 0;
    return 50; // Default difference score for display
  };

  // Helper function to get AI default reasoning path
  const getAIDefaultPath = (opportunity, scenario) => {
    // AI's default path is the scenario's original reasoning steps and first outcome
    return {
      steps: scenario?.reasoningSteps || [],
      result: scenario?.outcomes?.[0] || "No result available"
    };
  };

  // Helper function to calculate Jaccard similarity (overlap ratio)
  const calculateJaccardSimilarity = (set1, set2) => {
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : (intersection.size / union.size) * 100;
  };

  // Helper function to compare reasoning paths and calculate alignment
  const comparePaths = (userPath, aiPath) => {
    const differences = [];
    
    // Compare steps - extract drivers/keys from steps
    const userStepKeys = userPath.modifiedSteps ? Object.keys(userPath.modifiedSteps) : [];
    const aiStepKeys = aiPath.steps ? aiPath.steps.map((_, idx) => idx.toString()) : [];
    
    // Calculate alignment based on shared drivers/steps (Jaccard similarity)
    const userStepSet = new Set(userStepKeys);
    const aiStepSet = new Set(aiStepKeys);
    const alignmentScore = calculateJaccardSimilarity(userStepSet, aiStepSet);
    
    // Compare steps
    if (userPath.modifiedSteps && Object.keys(userPath.modifiedSteps).length > 0) {
      differences.push("User modified reasoning steps");
    }
    
    // Compare results
    if (userPath.modifiedResult && userPath.modifiedResult !== aiPath.result) {
      differences.push("Different final conclusions");
    }
    
    return { differences, alignmentScore };
  };

  // Function to compute comparison data
  const computeComparisonData = React.useCallback(() => {
    // 1. Compare predictions
    const settledPredictions = (HISTORICAL_RECORDS.predictions || [])
      .filter(p => p.status === 'closed' && p.isPredicted);
    
    const predictionDiffs = settledPredictions.map(prediction => {
      const aiPrediction = getAIPrediction(prediction.id);
      const alignmentScore = calculateAlignmentScore(prediction.prediction, aiPrediction.prediction);
      
      return {
        id: prediction.id,
        title: prediction.title,
        category: prediction.category || 'Other',
        userPrediction: prediction.prediction,
        userConfidence: prediction.confidence || 50,
        aiPrediction: aiPrediction.prediction,
        aiConfidence: aiPrediction.confidence,
        differenceScore: calculateDifference(prediction.prediction, aiPrediction.prediction),
        alignmentScore: alignmentScore,
        isAgreement: prediction.prediction === aiPrediction.prediction
      };
    });

    // 2. Compare reasoning paths
    const reasoningDiffs = Object.entries(userSavedPaths).map(([key, userPath]) => {
      const [opportunityId, scenarioId] = key.split('_');
      const opportunity = DECISION_SANDBOX_OPPORTUNITIES.find(o => o.id === parseInt(opportunityId));
      const scenario = opportunity?.scenarios.find(s => s.id === scenarioId);
      
      if (!opportunity || !scenario) return null;
      
      const aiPath = getAIDefaultPath(opportunity, scenario);
      const pathComparison = comparePaths(userPath, aiPath);
      
      return {
        key,
        opportunityId: parseInt(opportunityId),
        scenarioId,
        opportunityTitle: opportunity.question,
        scenarioTitle: scenario.title,
        userPath: {
          steps: userPath.modifiedSteps || {},
          result: userPath.modifiedResult || scenario.outcomes[0]
        },
        aiPath: {
          steps: aiPath.steps,
          result: aiPath.result
        },
        differences: pathComparison.differences,
        alignmentScore: pathComparison.alignmentScore
      };
    }).filter(Boolean);

    return { predictionDiffs, reasoningDiffs };
  }, [userSavedPaths]);

  // Compute comparison data when dependencies change
  useEffect(() => {
    const data = computeComparisonData();
    setComparisonData(data);
  }, [computeComparisonData]);

  // Helper to handle navigation within Me tab

  const handleMeNavigation = (view) => {

    setDetailSubView(view);

  };

  const renderContent = () => {

    // 0. Search View (can be shown from any tab)
    if (detailSubView === 'search') {
      return (
        <SearchView
          onBack={() => setDetailSubView(null)}
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

    // 0.1. User Profile View (can be shown from any tab)
    if (detailSubView && detailSubView.startsWith('user_profile_')) {
      const userId = detailSubView.replace('user_profile_', '');
      // 检查是否从 Trend tab 跳转过来的
      const trendContextMatch = detailSubView.match(/trend_(\w+)_user_/);
      const trendContext = trendContextMatch ? trendContextMatch[1] : null;
      
      return (
        <UserProfileView 
          userId={userId} 
          onBack={() => {
            // 如果是从 Trend tab 跳转过来的，返回到对应的 tab
            if (trendContext) {
              setDetailSubView(`trend_${trendContext}`);
              setActiveTab('trend');
            } else {
              setDetailSubView(null);
            }
          }}
          onNavigate={(view) => setDetailSubView(view)}
        />
      );
    }

    // 0.2. Decision Sandbox - Opportunity Detail (can be shown without selectedCard)
    if (detailSubView && detailSubView.startsWith('opportunity_')) {
      const parts = detailSubView.split('_');
      const opportunityId = parseInt(parts[1]);
      const shouldShowOutcomes = parts.length > 2 && parts[2] === 'outcomes';
      
      return (
        <OpportunityDetailPage
          opportunityId={opportunityId}
          initialTab={shouldShowOutcomes ? 'outcomes' : 'simulate'}
          additionalOutcomes={opportunityOutcomes[opportunityId] || []}
          onBack={() => {
            setDetailSubView(null);
          }}
          onScenarioClick={(opportunity, scenario, outcome) => {
            if (outcome) {
              // Navigate to outcome's reasoning path
              setDetailSubView(`reasoning_${opportunity.id}_outcome_${outcome.id}`);
            } else {
              // Navigate to scenario's reasoning path
              setDetailSubView(`reasoning_${opportunity.id}_scenario_${scenario.id}`);
            }
          }}
          onSaveOutcome={(newOutcome, isPrivate) => {
            // Add new outcome to the opportunity's outcomes
            setOpportunityOutcomes(prev => ({
              ...prev,
              [opportunityId]: [...(prev[opportunityId] || []), newOutcome]
            }));
            // Navigate to outcomes tab
            setDetailSubView(`opportunity_${opportunityId}_outcomes`);
          }}
        />
      );
    }

    // 0.3. Decision Sandbox - Reasoning Path (can be shown without selectedCard)
    if (detailSubView && detailSubView.startsWith('reasoning_')) {
      const match = detailSubView.match(/reasoning_(\d+)_(scenario_([A-Za-z0-9]+)|outcome_(\d+))/);
      if (match) {
        const opportunityId = parseInt(match[1]);
        const scenarioId = match[3] || null;
        const outcomeId = match[4] ? parseInt(match[4]) : null;
        
        const opportunity = DECISION_SANDBOX_OPPORTUNITIES.find(o => o.id === opportunityId);
        if (!opportunity) {
          return (
            <div className="flex flex-col h-full bg-gray-50">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
                <button onClick={() => setDetailSubView(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
                  <ChevronLeft size={24} />
                </button>
                <span className="font-semibold text-slate-900">Reasoning Path</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-slate-600">Opportunity not found</p>
              </div>
            </div>
          );
        }
        
        const scenario = scenarioId ? opportunity.scenarios.find(s => s.id === scenarioId) : null;
        // For outcomes, check both original outcomes and additional outcomes
        let outcome = null;
        if (outcomeId) {
          outcome = opportunity.outcomes.find(o => o.id === outcomeId);
          if (!outcome && opportunityOutcomes[opportunityId]) {
            outcome = opportunityOutcomes[opportunityId].find(o => o.id === outcomeId);
          }
        }
        
        // If scenario is not found, show error message
        if (scenarioId && !scenario) {
          return (
            <div className="flex flex-col h-full bg-gray-50">
              <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
                <button onClick={() => setDetailSubView(`opportunity_${opportunityId}`)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
                  <ChevronLeft size={24} />
                </button>
                <span className="font-semibold text-slate-900">Reasoning Path</span>
              </div>
              <div className="flex-1 flex items-center justify-center p-4">
                <p className="text-slate-600">Scenario not found</p>
              </div>
            </div>
          );
        }
        
        // Check if user has a saved path for this scenario
        // Use scenarioId from match, or get it from scenario/outcome if not available
        const finalScenarioId = scenarioId || scenario?.id || (outcome ? outcome.scenario.split(' ')[1] : null);
        const pathKey = finalScenarioId ? `${opportunityId}_${finalScenarioId}` : null;
        const savedPath = pathKey ? userSavedPaths[pathKey] : null;
        
        return (
          <ReasoningPathView
            opportunity={opportunity}
            scenario={scenario}
            outcome={outcome}
            savedPath={savedPath}
            onBack={() => {
              setDetailSubView(`opportunity_${opportunityId}`);
            }}
            onNewsClick={(newsCard) => {
              setSelectedCard(newsCard);
              setDetailSubView('news');
            }}
            onSave={(newOutcome, isPrivate) => {
              // Add new outcome to the opportunity's outcomes
              setOpportunityOutcomes(prev => ({
                ...prev,
                [opportunityId]: [...(prev[opportunityId] || []), newOutcome]
              }));
              
              // Save the path for this scenario (reuse finalScenarioId from outer scope)
              if (finalScenarioId && newOutcome.modifiedSteps !== undefined) {
                const savePathKey = `${opportunityId}_${finalScenarioId}`;
                setUserSavedPaths(prev => ({
                  ...prev,
                  [savePathKey]: {
                    modifiedSteps: newOutcome.modifiedSteps || {},
                    modifiedResult: newOutcome.modifiedResult || null,
                    isPrivate: isPrivate,
                    creator: newOutcome.creator || 'You',
                    creatorAvatar: newOutcome.creatorAvatar || 'AT',
                    creatorName: newOutcome.creatorName || 'Alex Thinker',
                    updatedAt: newOutcome.updatedAt || newOutcome.createdAt || new Date().toISOString()
                  }
                }));
              }
              
              // Do not navigate - stay on current page
            }}
          />
        );
      } else {
        // If regex doesn't match, show error
        return (
          <div className="flex flex-col h-full bg-gray-50">
            <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
              <button onClick={() => setDetailSubView(null)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
                <ChevronLeft size={24} />
              </button>
              <span className="font-semibold text-slate-900">Reasoning Path</span>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <p className="text-slate-600">Invalid path format</p>
            </div>
          </div>
        );
      }
    }

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

      if (detailSubView?.startsWith('trend_') && detailSubView.includes('_opportunities')) {
        // 从 Trend tab 跳转过来的，提取 tab 信息
        const trendTab = detailSubView.split('trend_')[1]?.split('_')[0] || 'influence';
        return (
          <OpportunitiesListView 
            onBack={() => {
              // 返回到对应的 Trend tab
              setDetailSubView(`trend_${trendTab}`);
              setActiveTab('trend');
            }} 
            opportunities={opportunities} 
          />
        );
      }

      if (detailSubView === 'opportunities_from_trend') {
        // 从 Trend tab 跳转过来的，保存 tab 信息
        const trendContext = detailSubView.includes('_trend_') 
          ? detailSubView.split('_trend_')[1]?.split('_opportunities')[0]
          : null;
        
        return (
          <OpportunitiesListView 
            onBack={() => {
              // 如果是从 Trend tab 跳转过来的，返回到对应的 tab
              if (trendContext) {
                setDetailSubView(`trend_${trendContext}`);
                setActiveTab('trend');
              } else {
                setDetailSubView(null);
              }
            }} 
            opportunities={opportunities} 
          />
        );
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

             onBack={() => {
               // 返回到上一步：如果有保存的状态，恢复它；否则返回到 Signal 页面
               if (previousStateRef.current) {
                 const prevState = previousStateRef.current;
                 setDetailSubView(prevState.detailSubView);
                 setActiveTab(prevState.activeTab);
                 setSelectedCard(null); // 清除已结算的卡片
                 previousStateRef.current = null; // 清除保存的状态
               } else {
                 // 没有保存的状态，返回到 Signal 页面
                 setSelectedCard(null);
                 setDetailSubView(null);
               }
             }} 

           />

         );

      }

      return (

        <DetailPage 

          data={selectedCard} 

          onBack={() => {
            // 检查是否从 Trend tab 跳转过来的
            if (detailSubView?.startsWith('trend_')) {
              // 提取 tab 信息
              const parts = detailSubView.split('trend_')[1]?.split('_') || [];
              const trendTab = parts[0] || 'influence';
              setSelectedCard(null);
              setDetailSubView(`trend_${trendTab}`);
              setActiveTab('trend');
            } else {
              setSelectedCard(null);
              setDetailSubView(null);
            }
          }} 

          setSubView={setDetailSubView}

          drivers={drivers}

          opportunities={opportunities}

          onPredict={(pred) => {

            setUserPrediction(pred);

            setDetailSubView('collectiveReasoning');

          }}

          initialTab={detailSubView?.includes('_opportunities') ? 'Opportunities' : 'Question'}

        />

      );

    }

    // 2. Profile / Me Tab Flow

    if (activeTab === 'me') {

      // Handle AI Analyst differences list view (must be first)
      if (detailSubView === 'ai_analyst') {
        console.log('Rendering DifferencesListView, comparisonData:', comparisonData);
        return (
          <DifferencesListView
            comparisonData={comparisonData}
            onBack={() => {
              console.log('Navigating back from DifferencesListView');
              setDetailSubView(null);
            }}
            onCategoryClick={(category) => {
              console.log('Category clicked:', category);
              const newView = `ai_analyst_category_${category.replace(/\s+/g, '_')}`;
              console.log('Setting detailSubView to:', newView);
              setDetailSubView(newView);
            }}
            onReasoningClick={() => {
              console.log('Reasoning clicked');
              setDetailSubView('ai_analyst_reasoning');
            }}
          />
        );
      }

      // Handle AI Analyst category detail view (must be before ai_insight check)
      if (detailSubView && detailSubView.startsWith('ai_analyst_category_')) {
        const category = detailSubView.replace('ai_analyst_category_', '').replace(/_/g, ' ');
        const { predictionDiffs = [] } = comparisonData || {};
        let categoryDifferences = predictionDiffs.filter(d => 
          (d.category || 'Other').replace(/_/g, ' ') === category
        );

        // 如果真实数据不足，添加假数据
        if (categoryDifferences.length === 0) {
          const mockDifferences = {
            'Stocks & Indexes': [
              { id: 1, title: 'Will the S&P 500 reach 6000 by end of 2025?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 75, aiConfidence: 68, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Stocks & Indexes' },
              { id: 2, title: 'Will Fed cut rates in Q2 2025?', userPrediction: 'No', aiPrediction: 'Yes', userConfidence: 65, aiConfidence: 72, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Stocks & Indexes' }
            ],
            'AI & Technology': [
              { id: 3, title: 'Will GPT-6 ship by 2026?', userPrediction: 'Incremental GPT-5.x evolution', aiPrediction: 'Major architecture leap before 2026', userConfidence: 60, aiConfidence: 80, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'AI & Technology' },
              { id: 4, title: 'Will Apple release AR glasses in 2025?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 70, aiConfidence: 55, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'AI & Technology' },
              { id: 5, title: 'Will quantum computing achieve commercial viability by 2026?', userPrediction: 'No', aiPrediction: 'Yes', userConfidence: 65, aiConfidence: 75, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'AI & Technology' }
            ],
            'Energy & Infra': [
              { id: 6, title: 'Will oil prices exceed $100/barrel in 2025?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 68, aiConfidence: 58, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Energy & Infra' },
              { id: 7, title: 'Will renewable energy exceed 50% of US grid by 2026?', userPrediction: 'No', aiPrediction: 'Yes', userConfidence: 55, aiConfidence: 70, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Energy & Infra' }
            ],
            'Other': [
              { id: 8, title: 'Will global population reach 8.5B by 2030?', userPrediction: 'Yes', aiPrediction: 'No', userConfidence: 70, aiConfidence: 60, differenceScore: 50, alignmentScore: 0, isAgreement: false, category: 'Other' }
            ]
          };
          categoryDifferences = mockDifferences[category] || [];
        }

        return (
          <DifferenceDetailView
            category={category}
            type="predictions"
            differences={categoryDifferences}
            onBack={() => setDetailSubView('ai_analyst')}
            onUpdatePrediction={(diff) => {
              console.log('Update prediction:', diff);
            }}
            onAnalyzeDifference={(diff) => {
              console.log('Analyze difference:', diff);
            }}
          />
        );
      }

      // Handle AI Analyst reasoning differences view
      if (detailSubView === 'ai_analyst_reasoning') {
        const { reasoningDiffs = [] } = comparisonData || {};
        const differences = reasoningDiffs.filter(d => d.differences && d.differences.length > 0);

        return (
          <DifferenceDetailView
            type="reasoning"
            differences={differences}
            onBack={() => setDetailSubView('ai_analyst')}
            onUpdatePrediction={(diff) => {
              console.log('Update reasoning path:', diff);
            }}
            onAnalyzeDifference={(diff) => {
              console.log('Analyze reasoning difference:', diff);
            }}
          />
        );
      }

      if (detailSubView === 'ai_insight') {
        // 计算用户预测分析数据（与MyGrowthView中的逻辑一致）
        const allPredictions = HISTORICAL_RECORDS.predictions || [];
        const totalPredictions = Math.max(allPredictions.length, 30);
        const settledPredictions = allPredictions.filter(p => p.status === 'closed' && p.isPredicted);
        const correctCount = settledPredictions.filter(p => p.prediction === p.outcome).length;
        const averageAccuracy = settledPredictions.length > 0 
          ? (correctCount / settledPredictions.length) * 100 
          : 0;
        
        // 将简单分类映射到更细分的分类
        const categoryMapping = {
          'Space': 'Space & Aerospace',
          'Tech': 'AI & Technology',
          'Business': 'Stocks & Indexes',
          'Politics': 'Conflict & Security',
          'Geopolitics': 'Conflict & Security',
          'Other': 'Other'
        };
        
        const titleToCategory = {};
        (MOCK_CARDS || []).forEach(card => {
          if (card.question) {
            const baseCategory = card.category || 'Other';
            titleToCategory[card.question] = categoryMapping[baseCategory] || baseCategory;
          }
        });
        
        const categoryStats = {};
        settledPredictions.forEach(p => {
          const category = titleToCategory[p.title] || p.category || 'Other';
          if (!categoryStats[category]) {
            categoryStats[category] = { total: 0, correct: 0 };
          }
          categoryStats[category].total++;
          if (p.prediction === p.outcome) {
            categoryStats[category].correct++;
          }
        });
        
        const categoryAccuracies = Object.entries(categoryStats).map(([category, stats]) => ({
          category,
          total: stats.total,
          correct: stats.correct,
          accuracy: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0
        }));
        
        const strengths = categoryAccuracies
          .filter(cat => cat.total >= 5 && cat.accuracy > averageAccuracy + 10)
          .sort((a, b) => b.accuracy - a.accuracy);
        const strength = strengths.length > 0 ? strengths[0] : null;
        const topByVolume = categoryAccuracies.length > 0
          ? categoryAccuracies.sort((a, b) => b.total - a.total)[0]
          : null;
        const finalStrength = strength || topByVolume;
        
        const blindSpots = categoryAccuracies
          .filter(cat => cat.total >= 5 && cat.accuracy < averageAccuracy - 10)
          .sort((a, b) => a.accuracy - b.accuracy);
        const blindSpot = blindSpots.length > 0 ? blindSpots[0] : null;
        
        const allCategories = ['AI & Technology', 'Stocks & Indexes', 'Conflict & Security', 'Space & Aerospace', 'Crypto & Blockchain', 'Energy & Commodities'];
        const userCategories = new Set(categoryAccuracies.map(c => c.category));
        const recommendedCategory = allCategories.find(cat => !userCategories.has(cat)) || 
          categoryAccuracies.sort((a, b) => a.total - b.total)[0]?.category || 'AI & Technology';
        
        const userPredictionAnalysis = {
          totalPredictions,
          settledCount: settledPredictions.length,
          averageAccuracy,
          strength: finalStrength,
          blindSpot: blindSpot || { category: recommendedCategory, total: 0, accuracy: 0, isRecommended: true }
        };

        return (

          <AIChatView 

            onBack={() => setDetailSubView(null)} 

            questionTitle="AI Analyst"

            initialContext=""

            isAIInsight={detailSubView === 'ai_insight'}

            isAIAnalyst={detailSubView === 'ai_analyst'}

            userPredictionAnalysis={userPredictionAnalysis}

            onAddDriverFromAI={() => {}}

            onPredictionClick={(prediction) => {
              setDetailSubView(null);
              setSelectedCard(prediction);
            }}

          />

        );

      }

      if (detailSubView && detailSubView.startsWith('activities_all')) {
        const tab = detailSubView.replace('activities_all_', '') || 'prediction';
        return <ActivitiesListView onBack={() => setDetailSubView(null)} initialTab={tab} />;
      }

      // Followers/Following List View
      if (detailSubView && detailSubView.startsWith('followers_')) {
        const userId = detailSubView.replace('followers_', '');
        return (
          <FollowersFollowingListView
            userId={userId}
            type="followers"
            onBack={() => setDetailSubView(null)}
            onUserClick={(clickedUserId) => {
              setDetailSubView(`user_profile_${clickedUserId}`);
            }}
          />
        );
      }

      if (detailSubView && detailSubView.startsWith('following_')) {
        const userId = detailSubView.replace('following_', '');
        return (
          <FollowersFollowingListView
            userId={userId}
            type="following"
            onBack={() => setDetailSubView(null)}
            onUserClick={(clickedUserId) => {
              setDetailSubView(`user_profile_${clickedUserId}`);
            }}
          />
        );
      }

      // Handle list_followers and list_following from Me tab (current user)
      if (detailSubView === 'list_followers') {
        return (
          <FollowersFollowingListView
            userId="current"
            type="followers"
            onBack={() => setDetailSubView(null)}
            onUserClick={(clickedUserId) => {
              setDetailSubView(`user_profile_${clickedUserId}`);
            }}
          />
        );
      }

      if (detailSubView === 'list_following') {
        return (
          <FollowersFollowingListView
            userId="current"
            type="following"
            onBack={() => setDetailSubView(null)}
            onUserClick={(clickedUserId) => {
              setDetailSubView(`user_profile_${clickedUserId}`);
            }}
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
      
      return <MyGrowthView onNavigate={handleMeNavigation} comparisonData={comparisonData} />;

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

            onSearchClick={() => {
              setDetailSubView('search');
            }}

          />

        );

      case 'whatifs':

        return (
          <DecisionSandboxView 
            onOpportunityClick={(opportunity) => {
              console.log('App.jsx: onOpportunityClick received', opportunity);
              const newView = `opportunity_${opportunity.id}`;
              console.log('Setting detailSubView to:', newView);
              setDetailSubView(newView);
              console.log('detailSubView set, should render OpportunityDetailPage');
            }}
          />
        );

      case 'predict':

        return (
          <FollowedView 
            onCardClick={(prediction) => {
              setSelectedCard(prediction);
              setDetailSubView(null);
            }}
            onUserClick={(userId) => {
              setDetailSubView(`user_profile_${userId}`);
            }}
          />
        );

      case 'trend':
        // 从 detailSubView 中提取 tab 信息（如果有的话）
        let trendTabFromSubView = 'influence';
        if (detailSubView?.startsWith('trend_')) {
          const parts = detailSubView.replace('trend_', '').split('_');
          trendTabFromSubView = parts[0] || 'influence';
        }
        
        // 处理投资机会详情页
        if (detailSubView?.includes('_asset_opportunity_')) {
          const assetIdMatch = detailSubView.match(/_asset_opportunity_(\d+)/);
          if (assetIdMatch) {
            const assetId = parseInt(assetIdMatch[1]);
            return (
              <AssetOpportunityDetailPage
                assetId={assetId}
                onBack={() => {
                  // 返回到 Trend 页面的 Momentum tab
                  setDetailSubView(`trend_${trendTabFromSubView}`);
                }}
                onPredictionClick={(prediction) => {
                  // 保存当前 tab 状态
                  const currentTrendTab = trendTabFromSubView;
                  setDetailSubView(`trend_${currentTrendTab}_prediction_${prediction.id}`);
                  setSelectedCard(prediction);
                  setTimeout(() => {
                    setDetailSubView(null);
                  }, 0);
                }}
              />
            );
          }
        }
        
        return (
          <TrendView 
            initialTab={trendTabFromSubView}
            onBack={() => {
              // 如果是从其他页面返回的，清除 detailSubView
              if (detailSubView?.startsWith('trend_')) {
                setDetailSubView(null);
              }
            }}
            onUserClick={(userId) => {
              // 保存当前 tab 状态并跳转到用户主页
              const currentTrendTab = trendTabFromSubView;
              setDetailSubView(`trend_${currentTrendTab}_user_${userId}`);
              setTimeout(() => {
                setDetailSubView(`user_profile_trend_${currentTrendTab}_user_${userId}`);
              }, 0);
            }}
            onMomentumClick={(predictionId, momentumId) => {
              // 保存当前 tab 状态
              const currentTrendTab = trendTabFromSubView;
              
              // 检查是否是投资机会详情页
              if (typeof predictionId === 'string' && predictionId.startsWith('asset_opportunity_')) {
                const assetId = predictionId.replace('asset_opportunity_', '');
                setDetailSubView(`trend_${currentTrendTab}_asset_opportunity_${assetId}`);
                return;
              }
              
              // 原有的逻辑：跳转到Opportunities tab
              setDetailSubView(`trend_${currentTrendTab}_momentum_${predictionId}`);
              const card = MOCK_CARDS.find(c => c.id === predictionId);
              if (card) {
                setSelectedCard(card);
                setTimeout(() => {
                  setDetailSubView(`trend_${currentTrendTab}_opportunities`);
                }, 0);
              }
            }}
            onPredictionClick={(card) => {
              // 保存当前 tab 状态
              const currentTrendTab = trendTabFromSubView;
              setDetailSubView(`trend_${currentTrendTab}_prediction_${card.id}`);
              // 点击预测题标题，跳转到预测题详情页
              setSelectedCard(card);
              setTimeout(() => {
                setDetailSubView(null);
              }, 0);
            }}
          />
        );

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

            onSearchClick={() => {
              setDetailSubView('search');
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

      {!selectedCard && !(detailSubView && detailSubView.startsWith('reasoning_')) && (

        <nav className="bg-white border-t border-gray-200 h-20 px-6 flex justify-between items-center z-20 pb-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">

          <button 

            onClick={() => { setActiveTab('signal'); setDetailSubView(null); }}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'signal' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <Signal size={24} />

            <span className="text-[10px] font-medium">Signal</span>

          </button>

          

          <button 

            onClick={() => { setActiveTab('whatifs'); setDetailSubView(null); }}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'whatifs' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <BrainCircuit size={24} />

            <span className="text-[10px] font-medium">What-Ifs</span>

          </button>

          

          <button 

            onClick={() => setActiveTab('predict')}

            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'predict' ? 'text-black' : 'text-slate-400 hover:text-slate-600'}`}

          >

            <Bookmark size={24} />

            <span className="text-[10px] font-medium">Followed</span>

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

