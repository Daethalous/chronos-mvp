export interface Choice {
  text: string;
  consequence_type: 'divergence' | 'convergence';
  next_node_id: string | null; // null means game over or end of demo
  next_node_preview?: string;
}

export interface EventNode {
  node_id: string;
  parent_id: string | null;
  timeline_id: string; // 'alpha', 'beta', etc.
  year: number;
  age: number;
  description: string;
  image_prompt?: string;
  image_url?: string;
  is_historical_fact: boolean;
  choices: {
    left: Choice;
    right: Choice;
  };
  status_effect?: {
    wealth?: number;
    popularity?: number;
    health?: number;
    sanity?: number;
  };
}

export interface GameState {
  currentNodeId: string;
  history: string[]; // List of visited node IDs
  stats: {
    wealth: number;
    popularity: number;
    health: number;
    sanity: number;
  };
}
