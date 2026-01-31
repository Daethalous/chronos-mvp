import { EventNode } from '../types';

export const INITIAL_STATS = {
  wealth: 50,
  popularity: 50,
  health: 80,
  sanity: 80,
};

export const MOCK_NODES: Record<string, EventNode> = {
  'root': {
    node_id: 'root',
    parent_id: null,
    timeline_id: 'alpha',
    year: 1980,
    age: 34,
    description: 'Your father suggests you focus on collecting rent in Brooklyn and Queens, but you see potential in the dilapidated Commodore Hotel in midtown Manhattan. It\'s a huge gamble.',
    is_historical_fact: true,
    choices: {
      left: {
        text: 'Listen to father, play it safe',
        consequence_type: 'divergence',
        next_node_id: 'queens_king',
        next_node_preview: 'You stayed in your comfort zone...'
      },
      right: {
        text: 'Take the risk, renovate it!',
        consequence_type: 'convergence',
        next_node_id: 'trump_tower',
        next_node_preview: 'The Grand Hyatt project launches, your first step towards empire.'
      }
    },
    status_effect: {
      wealth: -10,
      popularity: 5
    }
  },
  'queens_king': {
    node_id: 'queens_king',
    parent_id: 'root',
    timeline_id: 'beta',
    year: 1985,
    age: 39,
    description: 'You became the "King of Apartments" in Queens, living a wealthy but mundane life. A Hollywood crew wants to rent your apartment for a movie and invites you for a cameo.',
    is_historical_fact: false,
    choices: {
      left: {
        text: 'Refuse, I am a businessman',
        consequence_type: 'divergence',
        next_node_id: 'local_landlord_end',
        next_node_preview: 'You lived an ordinary life.'
      },
      right: {
        text: 'Agree, I want to be a star',
        consequence_type: 'divergence',
        next_node_id: 'hollywood_star',
        next_node_preview: 'You accidentally became famous and started an acting career.'
      }
    },
    status_effect: {
      wealth: 5,
      popularity: -5
    }
  },
  'trump_tower': {
    node_id: 'trump_tower',
    parent_id: 'root',
    timeline_id: 'alpha',
    year: 1983,
    age: 37,
    description: 'The Grand Hyatt is a massive success. Now you want to build your flagship building - Trump Tower. The architect suggests a subtle limestone facade to blend in.',
    is_historical_fact: true,
    choices: {
      left: {
        text: 'Agree, subtle luxury',
        consequence_type: 'divergence',
        next_node_id: 'architect_trump',
        next_node_preview: 'The building is praised, but lacks iconic status.'
      },
      right: {
        text: 'No! I want gold and glass!',
        consequence_type: 'convergence',
        next_node_id: 'plaza_deal',
        next_node_preview: 'The tower becomes a Fifth Avenue landmark.'
      }
    },
    status_effect: {
      wealth: -20,
      popularity: 20
    }
  },
  'plaza_deal': {
    node_id: 'plaza_deal',
    parent_id: 'trump_tower',
    timeline_id: 'alpha',
    year: 1988,
    age: 42,
    description: 'You have fame. Now, the legendary Plaza Hotel is for sale, but the price is ridiculously high.',
    is_historical_fact: true,
    choices: {
      left: {
        text: 'Too expensive, pass',
        consequence_type: 'divergence',
        next_node_id: 'prudent_investor',
        next_node_preview: 'You avoided the subsequent bankruptcy crisis.'
      },
      right: {
        text: 'Buy it! It\'s the Mona Lisa!',
        consequence_type: 'convergence',
        next_node_id: 'apprentice_era',
        next_node_preview: 'You bought it, but debt followed.'
      }
    },
    status_effect: {
      wealth: -30,
      popularity: 15
    }
  },
  'apprentice_era': {
    node_id: 'apprentice_era',
    parent_id: 'plaza_deal',
    timeline_id: 'alpha',
    year: 2004,
    age: 58,
    description: 'After the ups and downs of the 90s, NBC producer Mark Burnett pitches you a reality show "The Apprentice".',
    is_historical_fact: true,
    choices: {
      left: {
        text: 'Reality TV is trashy',
        consequence_type: 'divergence',
        next_node_id: 'real_estate_only',
        next_node_preview: 'You focused on real estate, fading from public view.'
      },
      right: {
        text: 'You\'re Fired!',
        consequence_type: 'convergence',
        next_node_id: 'election_2016',
        next_node_preview: 'You became a household TV star across America.'
      }
    },
    status_effect: {
      wealth: 10,
      popularity: 30
    }
  },
  'election_2016': {
    node_id: 'election_2016',
    parent_id: 'apprentice_era',
    timeline_id: 'alpha',
    year: 2015,
    age: 69,
    description: 'Your fame has peaked. The GOP primary field is chaotic. Will you officially announce your run for President?',
    is_historical_fact: true,
    choices: {
      left: {
        text: 'Forget it, strictly business',
        consequence_type: 'divergence',
        next_node_id: 'kingmaker',
        next_node_preview: 'You became a GOP mega-donor.'
      },
      right: {
        text: 'Make America Great Again!',
        consequence_type: 'convergence',
        next_node_id: 'president_trump',
        next_node_preview: 'You descended the golden escalator and changed history.'
      }
    },
    status_effect: {
      wealth: -10,
      popularity: 50
    }
  },
  // Endings / Divergences
  'local_landlord_end': {
    node_id: 'local_landlord_end',
    parent_id: 'queens_king',
    timeline_id: 'beta',
    year: 2020,
    age: 74,
    description: '[ENDING: Unknown Millionaire] You retire in Queens, wealthy but the world never knows the name Donald Trump.',
    is_historical_fact: false,
    choices: {
      left: { text: 'Restart', consequence_type: 'divergence', next_node_id: null },
      right: { text: 'Restart', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'hollywood_star': {
    node_id: 'hollywood_star',
    parent_id: 'queens_king',
    timeline_id: 'gamma',
    year: 1990,
    age: 44,
    description: '[ENDING: Hollywood Superstar] Your unique charisma made you an action star, even winning an Oscar.',
    is_historical_fact: false,
    choices: {
      left: { text: 'Restart', consequence_type: 'divergence', next_node_id: null },
      right: { text: 'Restart', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'president_trump': {
    node_id: 'president_trump',
    parent_id: 'election_2016',
    timeline_id: 'alpha',
    year: 2017,
    age: 70,
    description: '[ENDING: 45th President] You are sworn in. History is forever changed. (MVP Demo End)',
    is_historical_fact: true,
    choices: {
      left: { text: 'End', consequence_type: 'convergence', next_node_id: null },
      right: { text: 'End', consequence_type: 'convergence', next_node_id: null }
    }
  },
  'architect_trump': {
    node_id: 'architect_trump',
    parent_id: 'trump_tower',
    timeline_id: 'delta',
    year: 1990,
    age: 44,
    description: '[ENDING: Respected Developer] Your buildings are praised for taste, but you never achieved cult status.',
    is_historical_fact: false,
    choices: {
      left: { text: 'Restart', consequence_type: 'divergence', next_node_id: null },
      right: { text: 'Restart', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'prudent_investor': {
    node_id: 'prudent_investor',
    parent_id: 'plaza_deal',
    timeline_id: 'epsilon',
    year: 2000,
    age: 54,
    description: '[ENDING: Wall Street Tycoon] You pivoted to safer investments, avoiding bankruptcy but missing super-stardom.',
    is_historical_fact: false,
    choices: {
      left: { text: 'Restart', consequence_type: 'divergence', next_node_id: null },
      right: { text: 'Restart', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'real_estate_only': {
    node_id: 'real_estate_only',
    parent_id: 'apprentice_era',
    timeline_id: 'zeta',
    year: 2010,
    age: 64,
    description: '[ENDING: Real Estate Mogul] You continue to dominate real estate, but to the public, you are just another rich guy.',
    is_historical_fact: false,
    choices: {
      left: { text: 'Restart', consequence_type: 'divergence', next_node_id: null },
      right: { text: 'Restart', consequence_type: 'divergence', next_node_id: null }
    }
  },
  'kingmaker': {
    node_id: 'kingmaker',
    parent_id: 'election_2016',
    timeline_id: 'eta',
    year: 2016,
    age: 70,
    description: '[ENDING: The Kingmaker] You funded another candidate to victory, becoming the most powerful shadow figure in Washington.',
    is_historical_fact: false,
    choices: {
      left: { text: 'Restart', consequence_type: 'divergence', next_node_id: null },
      right: { text: 'Restart', consequence_type: 'divergence', next_node_id: null }
    }
  }
};
