import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, GitBranch, Save, Share2, X, Send, Loader2, ArrowDown, ArrowRight, ThumbsUp, ThumbsDown, Lock, Clock } from 'lucide-react';
import { callGemini } from '../App';

// Mock detailed descriptions for reasoning steps
const MOCK_STEP_DESCRIPTIONS = {
  // Step index -> detailed description
  0: "Recent algorithmic breakthroughs, particularly from models like DeepSeek R1, demonstrate significant improvements in training and inference efficiency. These advances reduce the computational cost per token processed, making AI operations more economical. The efficiency gains come from improved model architectures, better optimization techniques, and more effective use of computational resources.",
  1: "The Jevons paradox suggests that as the cost of compute decreases, overall demand may actually increase rather than decrease. Lower costs enable new applications and use cases that were previously uneconomical, leading to expanded usage across industries. This creates a counterintuitive effect where efficiency improvements drive greater total consumption.",
  2: "Enterprise adoption patterns are shifting from primarily training-focused deployments to inference-heavy applications. Companies are moving toward scaled inference systems that support multimodal capabilities and autonomous agents. This transition makes inference throughput a critical competitive factor in the long-term AI infrastructure landscape.",
  3: "The purchasing model for AI infrastructure is evolving from one-time large training cluster purchases to continuous inference capacity expansion. This shift benefits NVIDIA through its ecosystem advantages and software stack lock-in, creating stronger platform-level moats beyond pure hardware performance."
};

// Mock news data for reasoning steps and result
const MOCK_STEP_NEWS = {
  // Step index -> { supporting: [...], opposing: [...] }
  // 'result' -> { supporting: [...], opposing: [...] }
  result: {
    supporting: [
      { id: 11, title: "NVDA Stock Volatility Expected in Short Term", updatedAt: "1h ago", timestamp: Date.now() - 1 * 60 * 60 * 1000, imageGradient: "from-blue-500 to-indigo-600" },
      { id: 12, title: "Market Analysts Predict Compute Cost Concerns", updatedAt: "3h ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, imageGradient: "from-purple-500 to-pink-600" },
      { id: 13, title: "Orders Remain Stable Despite Market Fears", updatedAt: "5h ago", timestamp: Date.now() - 5 * 60 * 60 * 1000, imageGradient: "from-green-500 to-emerald-600" }
    ],
    opposing: [
      { id: 14, title: "NVDA Orders Show Significant Decline", updatedAt: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, imageGradient: "from-orange-500 to-red-600" },
      { id: 15, title: "Market Confidence in Compute Sector Wanes", updatedAt: "4h ago", timestamp: Date.now() - 4 * 60 * 60 * 1000, imageGradient: "from-red-500 to-rose-600" }
    ]
  },
  0: {
    supporting: [
      { id: 1, title: "DeepSeek R1 Model Shows 10x Efficiency Gains", updatedAt: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, imageGradient: "from-blue-500 to-cyan-600" },
      { id: 2, title: "New Algorithm Reduces Training Costs by 80%", updatedAt: "5h ago", timestamp: Date.now() - 5 * 60 * 60 * 1000, imageGradient: "from-purple-500 to-pink-600" },
      { id: 3, title: "Compute Efficiency Breakthrough Announced", updatedAt: "1d ago", timestamp: Date.now() - 24 * 60 * 60 * 1000, imageGradient: "from-green-500 to-emerald-600" }
    ],
    opposing: [
      { id: 4, title: "Efficiency Claims Questioned by Experts", updatedAt: "3h ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, imageGradient: "from-orange-500 to-red-600" },
      { id: 5, title: "Real-World Performance Falls Short", updatedAt: "6h ago", timestamp: Date.now() - 6 * 60 * 60 * 1000, imageGradient: "from-red-500 to-rose-600" }
    ]
  },
  1: {
    supporting: [
      { id: 6, title: "Jevons Effect Observed in AI Compute Demand", updatedAt: "1h ago", timestamp: Date.now() - 1 * 60 * 60 * 1000, imageGradient: "from-indigo-500 to-purple-600" },
      { id: 7, title: "Lower Costs Drive Higher Usage", updatedAt: "4h ago", timestamp: Date.now() - 4 * 60 * 60 * 1000, imageGradient: "from-blue-500 to-indigo-600" }
    ],
    opposing: [
      { id: 8, title: "Demand Growth Slows Despite Lower Costs", updatedAt: "2h ago", timestamp: Date.now() - 2 * 60 * 60 * 1000, imageGradient: "from-yellow-500 to-orange-600" }
    ]
  },
  2: {
    supporting: [
      { id: 9, title: "Enterprises Shift to Inference-Focused Deployments", updatedAt: "3h ago", timestamp: Date.now() - 3 * 60 * 60 * 1000, imageGradient: "from-teal-500 to-cyan-600" }
    ],
    opposing: []
  },
  3: {
    supporting: [
      { id: 10, title: "NVIDIA Ecosystem Lock-In Strengthens", updatedAt: "1h ago", timestamp: Date.now() - 1 * 60 * 60 * 1000, imageGradient: "from-violet-500 to-purple-600" }
    ],
    opposing: []
  }
};

const ReasoningPathView = ({ opportunity, scenario, outcome, onBack, onSave, savedPath, onNewsClick }) => {
  // Initialize with saved path if available
  const [modifiedSteps, setModifiedSteps] = useState(savedPath?.modifiedSteps || {});
  const [modifiedResult, setModifiedResult] = useState(savedPath?.modifiedResult || null);
  const [showForkDialog, setShowForkDialog] = useState(null);
  const [forkInput, setForkInput] = useState('');
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [showSaveBanner, setShowSaveBanner] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(!!savedPath); // Track if path has been saved
  const [savedPathInfo, setSavedPathInfo] = useState(savedPath ? { 
    isPrivate: savedPath.isPrivate,
    creator: savedPath.creator || 'You',
    creatorAvatar: savedPath.creatorAvatar || 'AT',
    creatorName: savedPath.creatorName || 'Alex Thinker',
    updatedAt: savedPath.updatedAt || new Date().toISOString()
  } : null); // Store saved path info
  // Store likes/dislikes for each result (keyed by result content)
  const [resultLikes, setResultLikes] = useState({});
  const [resultDislikes, setResultDislikes] = useState({});
  const [resultUserLikeStatus, setResultUserLikeStatus] = useState({});
  const [showNewsOverlay, setShowNewsOverlay] = useState(null); // { stepIndex }
  const [newsOverlayTab, setNewsOverlayTab] = useState('supporting'); // 'supporting' | 'opposing'
  
  // Fork paths management: each step can have multiple fork paths
  // Structure: { stepIndex: [{ pathId, steps, result, ... }, ...], ... }
  const [forkPaths, setForkPaths] = useState({});
  // Current path index for each step: { stepIndex: currentPathIndex }
  const [currentPathIndex, setCurrentPathIndex] = useState({});
  // Touch/swipe handling
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const hasModifications = Object.keys(modifiedSteps).length > 0 || modifiedResult !== null;
  // Only show back confirmation if there are unsaved modifications
  const hasUnsavedModifications = hasModifications && !isSaved;
  
  // Use scenario from outcome if outcome is provided
  const displayScenario = scenario || (outcome ? opportunity.scenarios.find(s => s.id === outcome.scenario.split(' ')[1]) : null);

  // Initialize mock fork paths for steps that have forks
  useEffect(() => {
    if (!displayScenario || !displayScenario.reasoningSteps || !Array.isArray(displayScenario.reasoningSteps)) return;
    
    const initialForkPaths = {};
    displayScenario.reasoningSteps.forEach((step, index) => {
      const forkCount = step.forks || 0;
      if (forkCount > 0) {
        // Create mock fork paths (2-3 paths per step for demo)
        const mockPaths = [];
        const numPaths = Math.min(forkCount, 3); // Show up to 3 paths
        
        for (let i = 0; i < numPaths; i++) {
          const mockPath = {
            pathId: Date.now() + index * 1000 + i,
            forkInput: `Alternative approach ${i + 1}`,
            steps: {},
            result: displayScenario.outcomes && displayScenario.outcomes.length > 0 
              ? `${typeof displayScenario.outcomes[0] === 'string' ? displayScenario.outcomes[0] : displayScenario.outcomes[0].content || ''} (Alternative path ${i + 1})`
              : `(Alternative path ${i + 1})`
          };
          
          // Create modified step for this fork path
          mockPath.steps[index] = {
            ...step,
            title: `${step.title} (Alternative ${i + 1})`
          };
          
          // Add subsequent steps if they exist
          for (let j = index + 1; j < displayScenario.reasoningSteps.length; j++) {
            mockPath.steps[j] = {
              ...displayScenario.reasoningSteps[j],
              title: `${displayScenario.reasoningSteps[j].title} (Path ${i + 1})`
            };
          }
          
          mockPaths.push(mockPath);
        }
        
        initialForkPaths[index] = mockPaths;
      }
    });
    
    setForkPaths(initialForkPaths);
  }, [displayScenario]);
  
  if (!displayScenario) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600">
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

  const handleForkStep = (stepIndex) => {
    setShowForkDialog({ type: 'step', index: stepIndex });
    setForkInput('');
  };

  const handleForkResult = () => {
    setShowForkDialog({ type: 'result' });
    setForkInput('');
  };

  const handleForkSubmit = async () => {
    if (!forkInput.trim() || isRegenerating) return;

    const currentDialog = showForkDialog; // Save dialog state before closing
    setIsRegenerating(true);
    // Keep dialog open during regeneration to show loading state

    try {
      if (currentDialog.type === 'step') {
        const currentDisplaySteps = getDisplaySteps();
        const currentStep = currentDisplaySteps[currentDialog.index];
        const previousSteps = currentDisplaySteps.slice(0, currentDialog.index);
        const originalSubsequentSteps = displayScenario.reasoningSteps.slice(currentDialog.index + 1);
        
        // Build context for AI
        const context = `
Scenario: ${displayScenario.title}

Previous reasoning steps:
${previousSteps.map((step, idx) => `${idx + 1}. ${step.title}`).join('\n')}

Current step to modify:
${currentDialog.index + 1}. ${currentStep.title}

User's modification request: ${forkInput}

Please regenerate:
1. The current step (step ${currentDialog.index + 1}) incorporating the user's modification
2. All subsequent reasoning steps (${originalSubsequentSteps.length} steps)
3. The final outcome/result

Return the response in JSON format:
{
  "currentStep": "regenerated step title",
  "subsequentSteps": [
    {"step": 2, "title": "step title"},
    {"step": 3, "title": "step title"}
  ],
  "result": "regenerated outcome text"
}
`;

        // Call AI to regenerate
        const systemInstruction = "You are an AI assistant that helps refine reasoning paths. Generate logical, coherent reasoning steps that build upon previous steps and incorporate user modifications.";
        
        // For demo: simulate AI response with loading
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // In production, use: const aiResponse = await callGemini(context, systemInstruction);
        // For demo, generate mock response
        const mockResponse = {
          currentStep: `${currentStep.title} (Modified: ${forkInput})`,
          subsequentSteps: originalSubsequentSteps.map((step, idx) => ({
            step: currentDialog.index + 2 + idx,
            title: `${step.title} (Regenerated based on modification)`
          })),
          result: `Based on the modified reasoning path: ${typeof displayScenario.outcomes[0] === 'string' 
            ? displayScenario.outcomes[0] 
            : displayScenario.outcomes[0].content || displayScenario.outcomes[0]} (Updated)`
        };

        // Create a new fork path
        const newForkPath = {
          pathId: Date.now(),
          forkInput: forkInput,
          steps: {},
          result: mockResponse.result
        };

        // Add modified current step to fork path
        newForkPath.steps[currentDialog.index] = {
          ...currentStep,
          title: mockResponse.currentStep,
          step: currentStep.step
        };

        // Add subsequent steps to fork path
        mockResponse.subsequentSteps.forEach((regeneratedStep, idx) => {
          const originalIndex = currentDialog.index + 1 + idx;
          newForkPath.steps[originalIndex] = {
            ...displayScenario.reasoningSteps[originalIndex],
            step: regeneratedStep.step,
            title: regeneratedStep.title
          };
        });

        // Add fork path to the step's fork paths list
        setForkPaths(prev => ({
          ...prev,
          [currentDialog.index]: [...(prev[currentDialog.index] || []), newForkPath]
        }));

        // Update current step (for immediate display) - increment fork count
        const originalForkCount = currentStep.forks || 0;
        setModifiedSteps(prev => ({
          ...prev,
          [currentDialog.index]: {
            ...currentStep,
            title: mockResponse.currentStep,
            forks: originalForkCount + 1
          }
        }));

        // Update subsequent steps
        mockResponse.subsequentSteps.forEach((regeneratedStep, idx) => {
          const originalIndex = currentDialog.index + 1 + idx;
          setModifiedSteps(prev => ({
            ...prev,
            [originalIndex]: {
              ...displayScenario.reasoningSteps[originalIndex],
              step: regeneratedStep.step,
              title: regeneratedStep.title
            }
          }));
        });

        // Update result
        setModifiedResult(mockResponse.result);

      } else {
        // Fork result
        const currentDisplaySteps = getDisplaySteps();
        const allSteps = currentDisplaySteps.map((step, idx) => `${idx + 1}. ${step.title}`).join('\n');
        const originalResult = typeof displayScenario.outcomes[0] === 'string' 
          ? displayScenario.outcomes[0] 
          : displayScenario.outcomes[0].content || displayScenario.outcomes[0];

        const context = `
Scenario: ${displayScenario.title}

Reasoning steps:
${allSteps}

Current result: ${originalResult}

User's modification request: ${forkInput}

Please regenerate the result incorporating the user's modification.
Return only the regenerated result text.
`;

        // For demo: simulate AI response
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In production: const aiResponse = await callGemini(context, systemInstruction);
        const mockResult = `${originalResult} (Modified: ${forkInput})`;
        
        setModifiedResult(mockResult);
      }

      setForkInput('');
      setShowForkDialog(null);
      setShowSaveBanner(true);
    } catch (error) {
      console.error('Error regenerating with AI:', error);
      // Fallback to simple modification
      if (currentDialog.type === 'step') {
        const currentDisplaySteps = getDisplaySteps();
        setModifiedSteps(prev => ({
          ...prev,
          [currentDialog.index]: {
            ...currentDisplaySteps[currentDialog.index],
            title: `${currentDisplaySteps[currentDialog.index].title} (Modified: ${forkInput})`,
            forks: 0
          }
        }));
      } else {
        const resultText = typeof displayScenario.outcomes[0] === 'string' 
          ? displayScenario.outcomes[0] 
          : displayScenario.outcomes[0].content || displayScenario.outcomes[0];
        setModifiedResult(`${resultText} (Modified: ${forkInput})`);
      }
      setShowSaveBanner(true);
    } finally {
      setIsRegenerating(false);
      setShowForkDialog(null);
    }
  };

  const handleSave = (isPrivate) => {
    const now = new Date();
    // Prepare the saved outcome with full path information
    const savedOutcome = {
      id: Date.now(), // Generate unique ID
      content: modifiedResult || (typeof displayScenario.outcomes[0] === 'string' 
        ? displayScenario.outcomes[0] 
        : displayScenario.outcomes[0].content || displayScenario.outcomes[0]),
      scenario: scenario ? `Scenario ${scenario.id}` : (outcome ? outcome.scenario : 'Scenario A'),
      creator: 'You', // Current user
      creatorAvatar: 'AT', // User avatar initials
      creatorName: 'Alex Thinker', // User name
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      likes: 0,
      dislikes: 0,
      isPrivate: isPrivate,
      isUserCreated: true,
      // Save the modified path information
      modifiedSteps: { ...modifiedSteps },
      modifiedResult: modifiedResult,
      opportunityId: opportunity.id,
      scenarioId: scenario?.id || (outcome ? outcome.scenario.split(' ')[1] : null)
    };

    // Call the save callback to persist the path
    if (onSave) {
      onSave(savedOutcome, isPrivate);
    }

    // Mark as saved and store path info
    setIsSaved(true);
    setSavedPathInfo({ 
      isPrivate,
      creator: savedOutcome.creator,
      creatorAvatar: savedOutcome.creatorAvatar,
      creatorName: savedOutcome.creatorName,
      updatedAt: savedOutcome.updatedAt
    });
    
    // Clear modifications (but keep the display, as user stays on page)
    // We don't clear modifiedSteps/modifiedResult here because we want to keep showing the saved path
    // Instead, we just mark it as saved so hasUnsavedModifications becomes false
    
    // Close banner
    setShowSaveBanner(false);
    
    // Stay on current page - do not navigate
  };

  const handleBack = () => {
    // Only show confirmation if there are unsaved modifications
    if (hasUnsavedModifications) {
      setShowBackConfirm(true);
    } else {
      onBack && onBack();
    }
  };

  const handleConfirmBack = () => {
    setShowBackConfirm(false);
    setModifiedSteps({});
    setModifiedResult(null);
    onBack && onBack();
  };

  // Format time ago helper
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  // Get fork paths for a specific step
  const getForkPathsForStep = (stepIndex) => {
    return forkPaths[stepIndex] || [];
  };

  // Get current path index for a step (defaults to 0 for original path)
  const getCurrentPathIndex = (stepIndex) => {
    return currentPathIndex[stepIndex] || 0;
  };

  // Track path changes for animation - stores the step index that was switched
  const [lastSwitchedStepIndex, setLastSwitchedStepIndex] = useState(null);
  
  // Switch to next fork path (left swipe)
  const switchToNextPath = (stepIndex) => {
    const paths = getForkPathsForStep(stepIndex);
    const currentIndex = getCurrentPathIndex(stepIndex);
    if (currentIndex < paths.length) {
      setCurrentPathIndex(prev => ({
        ...prev,
        [stepIndex]: currentIndex + 1
      }));
      setLastSwitchedStepIndex(stepIndex); // Track which step was switched
    }
  };

  // Switch to previous fork path (right swipe)
  const switchToPreviousPath = (stepIndex) => {
    const currentIndex = getCurrentPathIndex(stepIndex);
    if (currentIndex > 0) {
      setCurrentPathIndex(prev => ({
        ...prev,
        [stepIndex]: currentIndex - 1
      }));
      setLastSwitchedStepIndex(stepIndex); // Track which step was switched
    }
  };
  
  // Reset lastSwitchedStepIndex after animation completes
  useEffect(() => {
    if (lastSwitchedStepIndex !== null) {
      const timer = setTimeout(() => {
        setLastSwitchedStepIndex(null);
      }, 300); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [lastSwitchedStepIndex]);

  // Touch handlers for swipe
  const handleTouchStart = (e, stepIndex) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e, stepIndex) => {
    if (!touchStartX.current || !touchStartY.current) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartX.current - touchEndX;
    const diffY = Math.abs(touchStartY.current - touchEndY);

    // Only handle horizontal swipes (more horizontal than vertical)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next path
        switchToNextPath(stepIndex);
      } else {
        // Swipe right - previous path
        switchToPreviousPath(stepIndex);
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Get display steps with fork path support
  const getDisplayStep = (stepIndex) => {
    const paths = getForkPathsForStep(stepIndex);
    const currentIndex = getCurrentPathIndex(stepIndex);
    const originalStep = modifiedSteps[stepIndex] || displayScenario.reasoningSteps[stepIndex];
    const forkCount = paths.length || (originalStep.forks || 0);
    
    // If currentIndex is 0, show original/modified step
    if (currentIndex === 0) {
      return {
        ...originalStep,
        forks: forkCount
      };
    }
    
    // Otherwise show the fork path step
    const path = paths[currentIndex - 1];
    if (path && path.steps && path.steps[stepIndex]) {
      return {
        ...path.steps[stepIndex],
        forks: forkCount
      };
    }
    
    return {
      ...originalStep,
      forks: forkCount
    };
  };

  // Get display steps - when a path is switched, all subsequent steps should also switch
  const getDisplaySteps = () => {
    if (!displayScenario || !displayScenario.reasoningSteps || !Array.isArray(displayScenario.reasoningSteps)) {
      return [];
    }
    
    const steps = [];
    let activeForkPath = null; // Track the active fork path from the first switched step
    
    for (let i = 0; i < displayScenario.reasoningSteps.length; i++) {
      const stepForkPaths = getForkPathsForStep(i);
      const currentPathIdx = getCurrentPathIndex(i);
      
      // If we're on a fork path for this step, use it and set as active path
      if (currentPathIdx > 0 && stepForkPaths[currentPathIdx - 1]) {
        const forkPath = stepForkPaths[currentPathIdx - 1];
        activeForkPath = forkPath; // Set this as the active fork path
        
        // Use the step from this fork path
        if (forkPath.steps[i]) {
          steps.push({
            ...forkPath.steps[i],
            forks: stepForkPaths.length || displayScenario.reasoningSteps[i].forks || 0
          });
          continue;
        }
      }
      
      // For subsequent steps, if we have an active fork path, use its steps
      if (activeForkPath && activeForkPath.steps[i]) {
        steps.push({
          ...activeForkPath.steps[i],
          forks: getForkPathsForStep(i).length || displayScenario.reasoningSteps[i].forks || 0
        });
        continue;
      }
      
      // Default: use original or modified step
      const originalStep = modifiedSteps[i] || displayScenario.reasoningSteps[i];
      const forkCount = getForkPathsForStep(i).length || originalStep.forks || 0;
      steps.push({
        ...originalStep,
        forks: forkCount
      });
    }
    
    return steps;
  };

  // Get display result - should also switch based on active fork path
  // Use the same logic as getDisplaySteps to find the active fork path
  const getDisplayResult = () => {
    if (!displayScenario) {
      return modifiedResult || '';
    }
    
    // Find the active fork path using the same logic as getDisplaySteps
    let activeForkPath = null;
    if (displayScenario.reasoningSteps && displayScenario.reasoningSteps.length > 0) {
      for (let i = 0; i < displayScenario.reasoningSteps.length; i++) {
        const stepForkPaths = getForkPathsForStep(i);
        const currentPathIdx = getCurrentPathIndex(i);
        
        // If we're on a fork path for this step, use it and set as active path
        if (currentPathIdx > 0 && stepForkPaths[currentPathIdx - 1]) {
          activeForkPath = stepForkPaths[currentPathIdx - 1];
          // Don't break - continue to find the last active fork path (most recent switch)
          // This ensures if user switches step 1, then step 3, we use step 3's path result
        }
      }
    }
    
    // If we have an active fork path with a result, use it
    if (activeForkPath && activeForkPath.result) {
      return activeForkPath.result;
    }
    
    // Otherwise use modified or default result
    if (displayScenario.outcomes && displayScenario.outcomes.length > 0) {
      const defaultResult = typeof displayScenario.outcomes[0] === 'string' 
        ? displayScenario.outcomes[0] 
        : displayScenario.outcomes[0].content || displayScenario.outcomes[0];
      return modifiedResult || defaultResult;
    }
    
    return modifiedResult || '';
  };

  const displayResult = getDisplayResult();
  const displaySteps = getDisplaySteps();
  
  // Initialize likes/dislikes for current result when it changes
  useEffect(() => {
    if (!displayResult) return;
    
    // Initialize if not exists
    setResultLikes(prev => {
      if (displayResult in prev) return prev; // Already initialized
      
      // If this is the original outcome, use its likes/dislikes
      if (outcome && (
        (typeof outcome.content === 'string' && outcome.content === displayResult) ||
        (outcome.content && outcome.content === displayResult)
      )) {
        return { ...prev, [displayResult]: outcome.likes || 0 };
      } else {
        // Otherwise initialize to 0
        return { ...prev, [displayResult]: 0 };
      }
    });
    
    setResultDislikes(prev => {
      if (displayResult in prev) return prev; // Already initialized
      
      // If this is the original outcome, use its likes/dislikes
      if (outcome && (
        (typeof outcome.content === 'string' && outcome.content === displayResult) ||
        (outcome.content && outcome.content === displayResult)
      )) {
        return { ...prev, [displayResult]: outcome.dislikes || 0 };
      } else {
        // Otherwise initialize to 0
        return { ...prev, [displayResult]: 0 };
      }
    });
  }, [displayResult, outcome]);
  
  // Get current result's likes/dislikes
  const currentResult = displayResult;
  const likes = resultLikes[currentResult] || 0;
  const dislikes = resultDislikes[currentResult] || 0;
  const userLikeStatus = resultUserLikeStatus[currentResult] || null;

  // Handle like/dislike clicks - based on current result
  const handleLike = () => {
    if (userLikeStatus === 'like') {
      // Already liked, remove like
      setResultLikes(prev => ({ ...prev, [currentResult]: Math.max(0, (prev[currentResult] || 0) - 1) }));
      setResultUserLikeStatus(prev => ({ ...prev, [currentResult]: null }));
    } else {
      // Add like, remove dislike if exists
      setResultLikes(prev => ({ ...prev, [currentResult]: (prev[currentResult] || 0) + 1 }));
      if (userLikeStatus === 'dislike') {
        setResultDislikes(prev => ({ ...prev, [currentResult]: Math.max(0, (prev[currentResult] || 0) - 1) }));
      }
      setResultUserLikeStatus(prev => ({ ...prev, [currentResult]: 'like' }));
    }
  };

  const handleDislike = () => {
    if (userLikeStatus === 'dislike') {
      // Already disliked, remove dislike
      setResultDislikes(prev => ({ ...prev, [currentResult]: Math.max(0, (prev[currentResult] || 0) - 1) }));
      setResultUserLikeStatus(prev => ({ ...prev, [currentResult]: null }));
    } else {
      // Add dislike, remove like if exists
      setResultDislikes(prev => ({ ...prev, [currentResult]: (prev[currentResult] || 0) + 1 }));
      if (userLikeStatus === 'like') {
        setResultLikes(prev => ({ ...prev, [currentResult]: Math.max(0, (prev[currentResult] || 0) - 1) }));
      }
      setResultUserLikeStatus(prev => ({ ...prev, [currentResult]: 'dislike' }));
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md p-4 flex items-center gap-4 border-b border-gray-200">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-slate-600"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="font-semibold text-slate-900">Reasoning Path</span>
      </div>

      {/* Save Banner */}
      {showSaveBanner && (
        <div className="sticky top-[73px] z-15 bg-purple-50 border-b border-purple-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-sm font-semibold text-purple-900 mb-1">
                You've made changes to this path. Save it or publish it?
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleSave(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-300 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors"
                >
                  <Save size={16} />
                  Save privately
                </button>
                <button
                  onClick={() => handleSave(false)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                >
                  <Share2 size={16} />
                  Publish publicly
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSaveBanner(false)}
              className="p-1 rounded-full hover:bg-purple-100 text-purple-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${showSaveBanner ? 'pb-24' : 'pb-24'} scrollbar-hide`}>
        <div className="p-5 space-y-0">
          {/* Root Node - Scenario Title */}
          <div className="bg-white rounded-xl border-2 border-purple-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              {displayScenario?.title || 'Untitled Scenario'}
            </h2>
          </div>

          {/* Reasoning Steps with Arrow Connections */}
          <div className="space-y-0">
            {displaySteps.map((step, index) => {
              const stepForkPaths = getForkPathsForStep(index);
              const currentPathIdx = getCurrentPathIndex(index);
              const hasForks = stepForkPaths.length > 0;
              const nextPath = stepForkPaths[currentPathIdx]; // Current viewing path
              const previewPath = stepForkPaths[currentPathIdx + 1]; // Next path to preview (if exists)
              
              return (
                <React.Fragment key={index}>
                  {/* Arrow connector */}
                  <div className="flex justify-center py-2">
                    <div className="flex flex-col items-center">
                      <div className="w-0.5 h-4 bg-purple-300"></div>
                      <ArrowDown className="text-purple-400" size={20} />
                      <div className="w-0.5 h-4 bg-purple-300"></div>
                    </div>
                  </div>
                  
                  {/* Step card container with swipe support */}
                  <div className="relative">
                    <div className="flex items-stretch gap-0">
                      {/* Preview previous fork path card (if exists) - only shows right border */}
                      {hasForks && currentPathIdx > 0 && (
                        <div 
                          className="bg-white rounded-l-xl border-r-2 border-t-2 border-b-2 border-gray-300 w-2 shrink-0 cursor-pointer"
                          onClick={() => switchToPreviousPath(index)}
                          title="Click to view previous path"
                        />
                      )}
                      
                      {/* Main step card */}
                      <div 
                        key={`step-${index}-${lastSwitchedStepIndex !== null && index >= lastSwitchedStepIndex ? Date.now() : 'static'}`}
                        className={`bg-white rounded-xl border border-gray-200 p-4 touch-pan-y flex-1 relative ${
                          lastSwitchedStepIndex !== null && index >= lastSwitchedStepIndex ? 'animate-fade-in' : ''
                        }`}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchEnd={(e) => handleTouchEnd(e, index)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                            {step.step}
                          </div>
                          <div className="flex-1 min-w-0">
                            {/* Branches at top */}
                            {(step.forks > 0 || hasForks) && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="text-xs text-slate-500">
                                  {step.forks || stepForkPaths.length} branch{(step.forks || stepForkPaths.length) !== 1 ? 'es' : ''}
                                </div>
                              </div>
                            )}
                            
                            <div className="text-sm text-slate-700 leading-relaxed mb-4">
                              {step.title}
                            </div>
                            
                            {/* News support/oppose section and Fork button in same row */}
                            <div className="flex items-center justify-between gap-3 relative z-20 pr-2">
                              {(() => {
                                const stepNews = MOCK_STEP_NEWS[index] || { supporting: [], opposing: [] };
                                const supportingCount = stepNews.supporting.length;
                                const opposingCount = stepNews.opposing.length;
                                
                                if (supportingCount === 0 && opposingCount === 0) {
                                  // If no news, only show Fork button
                                  return (
                                    <div className="flex items-center justify-end gap-3 ml-auto">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          handleForkStep(index);
                                        }}
                                        onMouseDown={(e) => e.stopPropagation()}
                                        className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium relative z-30 px-2 py-1 rounded hover:bg-purple-50 transition-colors bg-white/80"
                                      >
                                        <GitBranch size={14} />
                                        <span>Fork</span>
                                      </button>
                                    </div>
                                  );
                                }
                                
                                return (
                                  <>
                                    <div className="flex items-center gap-2 -ml-2">
                                      <div className="text-xs text-slate-500">Source</div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          setShowNewsOverlay({ stepIndex: index });
                                          setNewsOverlayTab(supportingCount > 0 ? 'supporting' : 'opposing');
                                        }}
                                        className="flex items-center overflow-hidden rounded-full border border-gray-200 h-6"
                                      >
                                        {supportingCount > 0 && (
                                          <span className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 border-r border-emerald-200 hover:bg-emerald-100 transition-colors leading-none flex items-center">
                                            {supportingCount} support
                                          </span>
                                        )}
                                        {opposingCount > 0 && (
                                          <span className="px-3 py-1 text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors leading-none flex items-center">
                                            {opposingCount} challenge
                                          </span>
                                        )}
                                      </button>
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleForkStep(index);
                                      }}
                                      onMouseDown={(e) => e.stopPropagation()}
                                      className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-700 font-medium relative z-30 px-2 py-1 rounded hover:bg-purple-50 transition-colors bg-white/80 shrink-0"
                                    >
                                      <GitBranch size={14} />
                                      <span>Fork</span>
                                    </button>
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Clickable area on the right side to switch to next path - only on the far right edge, avoiding Fork button */}
                        {hasForks && previewPath && currentPathIdx < stepForkPaths.length - 1 && (
                          <div 
                            className="absolute right-0 top-0 bottom-0 w-10 cursor-pointer hover:bg-purple-50/30 transition-colors z-0 pointer-events-auto"
                            onClick={(e) => {
                              // Only trigger if click is not on Fork button or its container
                              const target = e.target;
                              const clickedButton = target.closest('button');
                              const clickedForkContainer = target.closest('.flex.items-center.justify-end');
                              
                              if (clickedButton || (clickedForkContainer && clickedForkContainer.querySelector('button'))) {
                                e.stopPropagation();
                                return;
                              }
                              switchToNextPath(index);
                            }}
                            onMouseDown={(e) => {
                              const target = e.target;
                              const clickedButton = target.closest('button');
                              const clickedForkContainer = target.closest('.flex.items-center.justify-end');
                              
                              if (clickedButton || (clickedForkContainer && clickedForkContainer.querySelector('button'))) {
                                e.stopPropagation();
                              }
                            }}
                            title="Click to view next path"
                          />
                        )}
                        
                        {/* Clickable area on the left side to switch to previous path - only on the far left edge */}
                        {hasForks && currentPathIdx > 0 && (
                          <div 
                            className="absolute left-0 top-0 bottom-0 w-8 cursor-pointer hover:bg-purple-50/30 transition-colors z-0"
                            onClick={() => switchToPreviousPath(index)}
                            title="Click to view previous path"
                          />
                        )}
                      </div>
                      
                      {/* Preview next fork path card (if exists) - only shows left border */}
                      {hasForks && previewPath && currentPathIdx < stepForkPaths.length - 1 && (
                        <div 
                          className="bg-white rounded-r-xl border-l-2 border-t-2 border-b-2 border-gray-300 w-2 shrink-0 cursor-pointer"
                          onClick={() => switchToNextPath(index)}
                          title="Click to view next path"
                        />
                      )}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            
            {/* Arrow connector to Result */}
            {displaySteps.length > 0 && (
              <div className="flex justify-center py-2">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-4 bg-purple-300"></div>
                  <ArrowDown className="text-purple-400" size={20} />
                  <div className="w-0.5 h-4 bg-purple-300"></div>
                </div>
              </div>
            )}
            
            {/* Result Area - As a special card after reasoning steps */}
            <div 
              key={`result-${lastSwitchedStepIndex !== null ? Date.now() : 'static'}`}
              className={`bg-gradient-to-br from-purple-50 via-purple-50/50 to-cyan-50 rounded-xl border-2 border-purple-300 p-5 shadow-lg relative overflow-hidden ${
                lastSwitchedStepIndex !== null ? 'animate-fade-in' : ''
              }`}
            >
              {/* Private indicator in top-right corner */}
              {savedPathInfo?.isPrivate && isSaved && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 text-xs text-purple-600 bg-white/80 px-2 py-1 rounded-full border border-purple-200">
                  <Lock size={12} />
                  <span>Private</span>
                </div>
              )}
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-200/20 rounded-full blur-xl"></div>
              
              <div className="relative z-10 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                    Result
                  </div>
                </div>
                <div className="text-base font-semibold text-slate-900 leading-relaxed mb-4">
                  {displayResult}
                </div>
                
                {/* News support/oppose section and Fork button for Result */}
                <div className="flex items-center justify-between gap-3 relative z-20 pr-2 mb-3">
                  {(() => {
                    const resultNews = MOCK_STEP_NEWS.result || { supporting: [], opposing: [] };
                    const supportingCount = resultNews.supporting.length;
                    const opposingCount = resultNews.opposing.length;
                    
                    if (supportingCount > 0 || opposingCount > 0) {
                      return (
                        <div className="flex items-center gap-2 -ml-2">
                          <div className="text-xs text-slate-500">Source</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setShowNewsOverlay({ stepIndex: 'result' });
                              setNewsOverlayTab(supportingCount > 0 ? 'supporting' : 'opposing');
                            }}
                            className="flex items-center overflow-hidden rounded-full border border-gray-200 h-6"
                          >
                            {supportingCount > 0 && (
                              <span className="px-3 py-1 text-xs font-medium bg-emerald-50 text-emerald-600 border-r border-emerald-200 hover:bg-emerald-100 transition-colors leading-none flex items-center">
                                {supportingCount} support
                              </span>
                            )}
                            {opposingCount > 0 && (
                              <span className="px-3 py-1 text-xs font-medium bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors leading-none flex items-center">
                                {opposingCount} challenge
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  <button
                    onClick={handleForkResult}
                    className="flex items-center gap-1.5 text-xs text-purple-700 hover:text-purple-800 font-medium relative z-30 px-2 py-1 rounded hover:bg-purple-50 transition-colors bg-white/80 shrink-0"
                  >
                    <GitBranch size={14} />
                    <span>Fork</span>
                  </button>
                </div>
                
                {/* Creator info - only show if saved */}
                {isSaved && savedPathInfo && (
                  <div className="flex items-center gap-2 pt-2 border-t border-purple-200/50">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                      {savedPathInfo.creatorAvatar || 'AT'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-700 truncate">
                        {savedPathInfo.creatorName || savedPathInfo.creator || 'You'}
                      </div>
                      {savedPathInfo.updatedAt && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Clock size={10} />
                          <span>{formatTimeAgo(new Date(savedPathInfo.updatedAt))}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Overlay */}
      {showNewsOverlay && (() => {
        const isResult = showNewsOverlay.stepIndex === 'result';
        const currentStep = isResult ? null : displaySteps[showNewsOverlay.stepIndex];
        const stepDescription = isResult ? '' : (MOCK_STEP_DESCRIPTIONS[showNewsOverlay.stepIndex] || '');
        const resultContent = isResult ? displayResult : null;
        
        return (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{isResult ? 'Result' : 'Reasoning Step'}</h3>
                  <button
                    onClick={() => setShowNewsOverlay(null)}
                    className="p-1 rounded-full hover:bg-gray-100 text-slate-600"
                  >
                    <X size={20} />
                  </button>
                </div>
                {currentStep && (
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">
                      {currentStep.title}
                    </h4>
                    {stepDescription && (
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {stepDescription}
                      </p>
                    )}
                  </div>
                )}
              </div>
            
            {/* Tab Switcher */}
            <div className="px-4 pt-3 pb-0">
              <h3 className="text-lg font-bold text-slate-900 mb-3">Source</h3>
            </div>
            {(() => {
              const newsKey = showNewsOverlay.stepIndex === 'result' ? 'result' : showNewsOverlay.stepIndex;
              const stepNews = MOCK_STEP_NEWS[newsKey] || { supporting: [], opposing: [] };
              const supportingCount = stepNews.supporting.length;
              const opposingCount = stepNews.opposing.length;
              
              return (
                <div className="flex border-b border-gray-200">
                  {supportingCount > 0 && (
                    <button
                      onClick={() => setNewsOverlayTab('supporting')}
                      className={`flex-1 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
                        newsOverlayTab === 'supporting'
                          ? 'border-emerald-500 text-emerald-600 bg-emerald-50/50'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Support ({supportingCount})
                    </button>
                  )}
                  {opposingCount > 0 && (
                    <button
                      onClick={() => setNewsOverlayTab('opposing')}
                      className={`flex-1 px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
                        newsOverlayTab === 'opposing'
                          ? 'border-rose-500 text-rose-600 bg-rose-50/50'
                          : 'border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Challenge ({opposingCount})
                    </button>
                  )}
                </div>
              );
            })()}
            
            <div className="flex-1 overflow-y-auto p-4">
              {(() => {
                const stepNews = MOCK_STEP_NEWS[showNewsOverlay.stepIndex] || { supporting: [], opposing: [] };
                let newsList = newsOverlayTab === 'supporting' ? stepNews.supporting : stepNews.opposing;
                
                // Sort by timestamp (most recent first)
                newsList = [...newsList].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
                
                if (newsList.length === 0) {
                  return (
                    <div className="text-center py-8 text-slate-500 text-sm">
                      No {newsOverlayTab === 'supporting' ? 'support' : 'challenge'} news found.
                    </div>
                  );
                }
                
                return (
                  <div className="space-y-3">
                    {newsList.map((news) => (
                      <button
                        key={news.id}
                        onClick={() => {
                          if (onNewsClick) {
                            // Create a mock news card object for navigation
                            const newsCard = {
                              id: news.id,
                              newsTitle: news.title,
                              category: "Tech",
                              imageGradient: news.imageGradient || "from-blue-500 to-purple-600"
                            };
                            onNewsClick(newsCard);
                          }
                          setShowNewsOverlay(null);
                        }}
                        className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300 flex items-start gap-3"
                      >
                        {/* Square news cover image */}
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${news.imageGradient || 'from-blue-500 to-purple-600'} shrink-0`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 mb-1 line-clamp-2">
                            {news.title}
                          </div>
                          <div className="text-xs text-slate-500">
                            {news.updatedAt}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        );
      })()}

      {/* Fork Dialog */}
      {(showForkDialog || isRegenerating) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {isRegenerating ? (
              <div className="text-center py-8">
                <Loader2 className="animate-spin mx-auto mb-4 text-purple-600" size={32} />
                <p className="text-sm text-slate-600">
                  Regenerating {showForkDialog?.type === 'step' || (showForkDialog === null && isRegenerating) ? 'step and subsequent steps' : 'result'} with AI...
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  This may take a few seconds...
                </p>
              </div>
            ) : (
              showForkDialog && (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900">
                      {showForkDialog.type === 'step' ? 'Fork from this step' : 'Fork Result'}
                    </h3>
                    <button
                      onClick={() => !isRegenerating && setShowForkDialog(null)}
                      disabled={isRegenerating}
                      className="p-1 rounded-full hover:bg-gray-100 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your change will regenerate the path from this step onward.
                    </label>
                    <textarea
                      value={forkInput}
                      onChange={(e) => setForkInput(e.target.value)}
                      placeholder="What would you change or challenge here?"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={4}
                      disabled={isRegenerating}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowForkDialog(null)}
                      disabled={isRegenerating}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleForkSubmit}
                      disabled={!forkInput.trim() || isRegenerating}
                      className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isRegenerating ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Regenerate path
                        </>
                      )}
                    </button>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}

      {/* Back Confirmation Dialog */}
      {showBackConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Discard Changes?
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Your modifications will not be saved if you go back.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowBackConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBack}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Like/Dislike Footer - replaces bottom navigation - only show if not private or not saved */}
      {!(savedPathInfo?.isPrivate && isSaved) && (
        <div className="sticky bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <div className="px-6 py-4 flex items-center justify-center gap-6">
            {/* Like Button - moved to left */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                userLikeStatus === 'like'
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                  : 'bg-gray-50 text-slate-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <ThumbsUp size={20} className={userLikeStatus === 'like' ? 'fill-current' : ''} />
              <span className="font-medium text-sm">{likes}</span>
            </button>

            {/* Dislike Button - moved to right */}
            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                userLikeStatus === 'dislike'
                  ? 'bg-rose-100 text-rose-700 border-2 border-rose-300'
                  : 'bg-gray-50 text-slate-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <ThumbsDown size={20} className={userLikeStatus === 'dislike' ? 'fill-current' : ''} />
              <span className="font-medium text-sm">{dislikes}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasoningPathView;
