
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeDetails } from '../services/spoonacularService';
import { getTextToSpeech } from '../services/geminiService';
// FIX: Imported the shared `decode` utility function for consistency.
import { decodeAudioData, decode } from '../services/audioUtils';
import { Step } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, XMarkIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

const CookMode: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recipeTitle, setRecipeTitle] = useState('');
  const [isVoiceOn, setIsVoiceOn] = useState(true);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const playAudio = useCallback(async (base64Audio: string) => {
    if (!audioContextRef.current) {
        // Use webkitAudioContext for Safari compatibility
        // FIX: Cast window to `any` to allow access to `webkitAudioContext` for Safari compatibility without causing a TypeScript error.
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
    }
    const audioContext = audioContextRef.current;
    
    try {
      // FIX: Replaced inline base64 decoding with the shared `decode` utility.
      const byteArray = decode(base64Audio);
      
      const audioBuffer = await decodeAudioData(byteArray, audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  }, []);
  
  const speakStep = useCallback(async (stepText: string) => {
    if (!isVoiceOn) return;
    const base64Audio = await getTextToSpeech(stepText);
    if (base64Audio) {
      playAudio(base64Audio);
    }
  }, [isVoiceOn, playAudio]);

  useEffect(() => {
    if (!id) return;
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const data = await getRecipeDetails(id);
        if (data.analyzedInstructions.length > 0 && data.analyzedInstructions[0].steps.length > 0) {
          const initialSteps = data.analyzedInstructions[0].steps;
          setSteps(initialSteps);
          setRecipeTitle(data.title);
          speakStep(initialSteps[0].step);
        }
      } catch (error) {
        console.error("Failed to fetch recipe for cooking", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      speakStep(steps[nextStepIndex].step);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      speakStep(steps[prevStepIndex].step);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading Cook Mode...</div>;
  if (steps.length === 0) return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">No instructions available for this recipe.</div>;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="fixed inset-0 bg-gray-900 text-white flex flex-col">
      <header className="flex justify-between items-center p-4">
        <h1 className="text-lg font-bold truncate">{recipeTitle}</h1>
        <div className="flex items-center gap-4">
            <button onClick={() => setIsVoiceOn(v => !v)} className="text-gray-300 hover:text-white">
                {isVoiceOn ? <SpeakerWaveIcon className="h-6 w-6"/> : <SpeakerXMarkIcon className="h-6 w-6"/>}
            </button>
            <button onClick={() => navigate(`/recipe/${id}`)} className="text-gray-300 hover:text-white">
                <XMarkIcon className="h-6 w-6" />
            </button>
        </div>
      </header>
      
      <div className="w-full bg-gray-700 h-1">
        <div className="bg-orange-500 h-1" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-gray-400 font-semibold mb-4">STEP {currentStep + 1} OF {steps.length}</p>
        <h2 className="text-3xl md:text-5xl font-bold max-w-4xl">{steps[currentStep].step}</h2>
      </main>

      <footer className="flex justify-between items-center p-4">
        <button onClick={handlePrev} disabled={currentStep === 0} className="flex items-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors">
          <ChevronLeftIcon className="h-6 w-6" /> Previous
        </button>
        <button onClick={handleNext} disabled={currentStep === steps.length - 1} className="flex items-center gap-2 bg-orange-500 text-white font-bold py-3 px-6 rounded-lg disabled:opacity-50 hover:bg-orange-600 transition-colors">
          Next <ChevronRightIcon className="h-6 w-6" />
        </button>
      </footer>
    </div>
  );
};

export default CookMode;
