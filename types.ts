export type DifficultyLevel = 'Easy' | 'Medium' | 'Advanced';

export interface GenerationConfig {
  grade: string;
  topic: string;
  writingTopic: string;
  contextText: string;
  difficulty: DifficultyLevel;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface GeneratedAssessment {
  rawText: string;
  timestamp: number;
}