export interface TripRequirements {
  origin: string;
  destination: string;
  durationDays: number;
  startDate?: string;
  travelers: number;
  budget: {
    amount: number;
    currency: string;
  };
  interests: string[];
  travelPace: 'relaxed' | 'moderate' | 'packed';
  accommodationPreference: 'budget' | 'mid-range' | 'luxury' | 'heritage' | 'homestay' | 'flexible';
  transportationPreference: 'public/train' | 'flight' | 'private-cab' | 'rental' | 'flexible';
  specialConstraints: string[];
  isMissingRequiredInfo: boolean;
  missingFields: string[];
  clarifyingQuestion?: string;
}

export interface WeatherDay {
  day: number;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainProb: number;
  advice: string;
}

export interface ResearchPlace {
  id: string;
  name: string;
  category: 'nature' | 'heritage' | 'food' | 'adventure' | 'relaxation' | 'culture' | 'shopping';
  rating: number;
  ticketCostPerPerson: number;
  durationHours: number;
  openingHours: string;
  address: string;
  description: string;
  indoor: boolean;
  evidence: string;
}

export interface ResearchHotel {
  id: string;
  name: string;
  tier: 'budget' | 'mid-range' | 'luxury' | 'heritage';
  costPerNight: number;
  rating: number;
  location: string;
  amenities: string[];
  evidence: string;
}

export interface ResearchRestaurant {
  id: string;
  name: string;
  cuisine: string;
  avgCostPerPerson: number;
  rating: number;
  specialty: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  evidence: string;
}

export interface ResearchTransport {
  mode: string;
  route: string;
  costPerPerson: number;
  travelDurationHours: number;
  frequencyOrTiming: string;
  evidence: string;
}

export interface DestinationResearch {
  destination: string;
  coordinates: { lat: number; lng: number };
  weather: {
    forecast: WeatherDay[];
    source: string;
    isLiveApi: boolean;
  };
  places: ResearchPlace[];
  hotels: ResearchHotel[];
  restaurants: ResearchRestaurant[];
  transportOptions: ResearchTransport[];
  lastResearched: string;
}

export interface WhyChosenEvidence {
  userPreferenceMatch: string;
  budgetReason: string;
  distanceReason: string;
  weatherReason: string;
  sourceEvidence: string;
}

export interface ItineraryActivity {
  id: string;
  timeSlot: string;
  title: string;
  description: string;
  category: string;
  location: string;
  costPerPerson: number;
  travelTimeFromPreviousMin: number;
  transitModeFromPrevious: string;
  openingHours: string;
  indoor: boolean;
  whyChosen: WhyChosenEvidence;
}

export interface FoodSuggestion {
  name: string;
  cuisine: string;
  estCostPerPerson: number;
  whyChosen: string;
  specialty: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date?: string;
  theme: string;
  weatherNote: string;
  hotel: {
    name: string;
    costPerNight: number;
    location: string;
    whyChosen: string;
  };
  transportation: {
    mode: string;
    costTotal: number;
    note: string;
  };
  foodSuggestions: {
    breakfast: FoodSuggestion;
    lunch: FoodSuggestion;
    dinner: FoodSuggestion;
  };
  activities: ItineraryActivity[];
  dayCostBreakdown: {
    accommodation: number;
    activities: number;
    food: number;
    transport: number;
    total: number;
  };
}

export interface BudgetStatus {
  allocated: number;
  spent: number;
  diff: number; // positive = under budget, negative = over budget
  isOverBudget: boolean;
  severity: 'ok' | 'warning' | 'critical';
  message: string;
  remedies: string[];
}

export interface ValidationReport {
  isValid: boolean;
  budgetStatus: BudgetStatus;
  pacingStatus: {
    pace: string;
    avgActivitiesPerDay: number;
    isFeasible: boolean;
    issues: string[];
  };
  travelTimeStatus: {
    maxDailyTransitMin: number;
    totalTransitHours: number;
    backtrackingWarnings: string[];
  };
  weatherStatus: {
    conflicts: string[];
    resolutions: string[];
  };
  preferenceMatchScore: number; // 0 - 100
  matchedInterests: string[];
  unmatchedInterests: string[];
}

export interface ItineraryDiff {
  triggerChange: string;
  changedFields: string[];
  preservedDays: number[];
  modifiedDays: number[];
  costDelta: number;
  summary: string;
  itemizedChanges: string[];
}

export interface TripItinerary {
  id: string;
  version: number;
  title: string;
  summary: string;
  days: ItineraryDay[];
  totalCost: number;
  costBreakdown: {
    accommodation: number;
    activities: number;
    food: number;
    transport: number;
    buffer: number;
    total: number;
  };
  validation: ValidationReport;
  diffFromPrevious?: ItineraryDiff;
}

export type AgentWorkflowStep =
  | 'idle'
  | 'understanding'
  | 'researching'
  | 'planning'
  | 'validating'
  | 'completed'
  | 'replanning';

export interface ResearchLogEntry {
  tool: string;
  query: string;
  summary: string;
  source: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  workflowStep?: AgentWorkflowStep;
  tripStateSnapshot?: TripRequirements;
  itinerarySnapshot?: TripItinerary;
  validationReport?: ValidationReport;
  diff?: ItineraryDiff;
  researchLogs?: ResearchLogEntry[];
  suggestedQuickReplies?: string[];
}

export interface TestCaseResult {
  id: string;
  name: string;
  category: string;
  passed: boolean;
  durationMs: number;
  assertions: Array<{
    name: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
  logs: string[];
}

export interface EvaluationReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalAssertions: number;
  passedAssertions: number;
  executionTimeMs: number;
  results: TestCaseResult[];
  timestamp: string;
}
