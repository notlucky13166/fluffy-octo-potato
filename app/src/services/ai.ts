export interface GenerationJob {
  id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
}

export const mockGenerationStream = (onUpdate: (job: GenerationJob) => void) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress >= 100) {
      clearInterval(interval);
      onUpdate({ id: 'mock', status: 'completed', progress: 100 });
    } else {
      onUpdate({ id: 'mock', status: 'running', progress });
    }
  }, 600);

  return () => clearInterval(interval);
};
