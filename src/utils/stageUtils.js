export const PROJECT_STAGES = [
  { key: 'Planning', label: 'Planning', color: 'bg-gray-500', icon: 'FileText' },
  { key: 'Demo', label: 'Demolition', color: 'bg-red-500', icon: 'Hammer' },
  { key: 'Rough-In', label: 'Rough-In', color: 'bg-yellow-500', icon: 'Wrench' },
  { key: 'Finishes', label: 'Finishes', color: 'bg-blue-500', icon: 'Paintbrush' },
  { key: 'Complete', label: 'Complete', color: 'bg-green-500', icon: 'CheckCircle' },
];

export const getStageInfo = (stageKey) => {
  return PROJECT_STAGES.find(stage => stage.key === stageKey) || PROJECT_STAGES[0];
};

export const getStageProgress = (stageKey) => {
  const stageIndex = PROJECT_STAGES.findIndex(stage => stage.key === stageKey);
  return stageIndex >= 0 ? ((stageIndex + 1) / PROJECT_STAGES.length) * 100 : 0;
};

export const getNextStage = (currentStageKey) => {
  const currentIndex = PROJECT_STAGES.findIndex(stage => stage.key === currentStageKey);
  if (currentIndex >= 0 && currentIndex < PROJECT_STAGES.length - 1) {
    return PROJECT_STAGES[currentIndex + 1];
  }
  return null;
};

export const getPreviousStage = (currentStageKey) => {
  const currentIndex = PROJECT_STAGES.findIndex(stage => stage.key === currentStageKey);
  if (currentIndex > 0) {
    return PROJECT_STAGES[currentIndex - 1];
  }
  return null;
};