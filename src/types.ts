export interface ResetInput {
  feeling: string;
  trigger: string;
  location: string;
  task: string;
  time: string;
  intensity: 'mild' | 'moderate' | 'intense';
}

export type ResetCategory = 'sensory' | 'movement' | 'dopamine' | 'body-double' | 'initiation';

export interface ResetResponse {
  title: string;
  intervention: string;
  whyItWorks: string;
  then: string;
  category: ResetCategory;
  durationSeconds: number;
}

export interface PresetChip {
  id: string;
  label: string;
  emoji?: string;
  value: string;
}

export interface PresetGroup {
  label: string;
  chips: PresetChip[];
}
