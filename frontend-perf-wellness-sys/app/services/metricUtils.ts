// utils/metricUtils.ts

export const checkboxValueMappings: Record<string, Record<string, number>> = {
  "injury reports": {
    "Reported to Supervisor": 3,
    "First Aid Given": 2,
    "Doctor Visit": 1,
  },
  "physical strain reports": {
    "Reported to Supervisor": 3,
    "First Aid Given": 2,
    "Doctor Visit": 1,
  },
  "sick days": {
    "Remote Work": 3,
    "Called In": 2,
    "Medical Certificate": 1,
  }
};

export const radioValueMappings: Record<string, Record<string, number>> = {
  "injury report": {
    "None": 4,
    "Minor": 3,
    "Moderate": 2,
    "Severe": 1,
  },
  "weather exposure": {
    "None": 4,
    "Cold": 3,
    "Heat": 2,
    "Rain": 1,
  }
};

export const dropdownValueMappings: Record<string, Record<string, number>> = {
  "stress level": {
    "Low": 1,
    "Medium": 2,
    "High": 3,
  },
  "energy level": {
    "Low": 1,
    "Medium": 2,
    "High": 3,
  },
  "work-life balance": {
    "Sad": 1,
    "Stressed": 2,
    "Neutral": 3,
    "Happy": 4,
    "Energetic": 5,
  },
  "your work life balance": {
    "Sad": 1,
    "Stressed": 2,
    "Neutral": 3,
    "Happy": 4,
    "Energetic": 5,
  },
  "job satisfaction": {
    "Very Dissatisfied": 1,
    "Dissatisfied": 2,
    "Neutral": 3,
    "Satisfied": 4,
    "Very Satisfied": 5,
  },
  "your job satisfaction": {
    "Very Dissatisfied": 1,
    "Dissatisfied": 2,
    "Neutral": 3,
    "Satisfied": 4,
    "Very Satisfied": 5,
  },
  "Call Response Time": {
    "Worse": 1,
    "Bad": 2,
    "Good": 3,
  }
};

export const DROPDOWN_OPTIONS = {
    "stress level": ["Low", "Medium", "High"],
    "work-life balance": ["Happy", "Neutral", "Sad", "Stressed", "Energetic"],
    "your work life balance": ["Happy", "Neutral", "Sad", "Stressed", "Energetic"],
    "job satisfaction": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    "your job satisfaction": ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
    "energy level": ["Low", "Medium", "High"],
    "Call Response Time": ["Good", "Bad", "Worse"]
  };
  
export const CHECKBOX_METRICS = [
    "completed_training",
    "exercise_completed",
    "medication_taken",
    "injury reports",
    "sick days",
    "physical strain reports"
  ];

  
  
  // Optional: define the options for radio buttons and checkboxes
export const RADIO_OPTIONS: Record<string, string[]> = {
    "injury report": ["None", "Minor", "Moderate", "Severe"],
    "weather exposure": ["None", "Cold", "Heat", "Rain"],
  };
  
export const CHECKBOX_OPTIONS: Record<string, string[]> = {
    "injury reports": ["Reported to Supervisor", "First Aid Given", "Doctor Visit"],
    "physical strain reports": ["Reported to Supervisor", "First Aid Given", "Doctor Visit"],
    "sick days": ["Called In", "Medical Certificate", "Remote Work"],
  };
  
  
export const RADIO_METRICS = ["injury report", "weather exposure"];
  
export const NUMERIC_METRICS = ["sleep_hours", "water_intake", "steps_count"];
  
export const getMetricType = (metricName: string): 'numeric' | 'dropdown' | 'radio' | 'checkbox' | 'text' => {
    const name = metricName.toLowerCase();
  
    if (NUMERIC_METRICS.some(m => name.includes(m))) return 'numeric';
    if (CHECKBOX_METRICS.some(m => name.includes(m))) return 'checkbox';
    if (RADIO_METRICS.some(m => name.includes(m))) return 'radio';
    if (Object.keys(DROPDOWN_OPTIONS).some(key => name.includes(key.toLowerCase()))) return 'dropdown';
  
    return 'text';
  };


  export function mapTextToNumericValue(metricName: string, value: string): number {
    const name = metricName.toLowerCase();
  
    const findMapping = (
      mappings: Record<string, Record<string, number>>
    ): number | undefined => {
      const match = Object.entries(mappings).find(([key]) => name.includes(key.toLowerCase()));
      return match?.[1][value];
    };
  
    // Try dropdowns first
    let numeric = findMapping(dropdownValueMappings);
    if (numeric !== undefined) return numeric;
  
    // Then radio buttons
    numeric = findMapping(radioValueMappings);
    if (numeric !== undefined) return numeric;
  
    // Then checkbox options
    numeric = findMapping(checkboxValueMappings);
    if (numeric !== undefined) return numeric;
  
    // Fallback
    return 0; // or throw an error, or return NaN
  }
  
  