// utils/metricUtils.ts

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
  