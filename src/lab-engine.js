/** v0.5.4 D5-A: pure, page-RAM-only guided LAB state machine. No device state. */
export const LAB_IDS=Object.freeze(["peep","rate","fio2"]);
export const LAB_PHASES=Object.freeze(["not-started","predict-unanswered","predict-answered","observation","interpret-unanswered","interpret-answered","completed"]);
export function createLabSession(labId){
 if(!LAB_IDS.includes(labId))throw new RangeError("Unknown LAB: "+labId);
 return Object.freeze({labId,phase:"predict-unanswered",predictedChoice:null,interpretedChoice:null});
}
function step(session,required,next,patch={}){
 if(!session||session.phase!==required)throw new Error("LAB phase gate: expected "+required);
 return Object.freeze({...session,...patch,phase:next});
}
function validateChoice(choice,optionIds){
 if(!Array.isArray(optionIds)||new Set(optionIds).size!==optionIds.length||!optionIds.includes(choice))throw new RangeError("Invalid LAB option");
}
export function submitLabPrediction(session,choice,optionIds){
 if(session?.phase!=="predict-unanswered")throw new Error("Prediction already submitted or not available");
 validateChoice(choice,optionIds);
 return step(session,"predict-unanswered","predict-answered",{predictedChoice:choice});
}
export function beginLabObservation(session){return step(session,"predict-answered","observation");}
export function beginLabInterpretation(session){return step(session,"observation","interpret-unanswered");}
export function submitLabInterpretation(session,choice,optionIds){
 if(session?.phase!=="interpret-unanswered")throw new Error("Interpretation already submitted or not available");
 validateChoice(choice,optionIds);
 return step(session,"interpret-unanswered","interpret-answered",{interpretedChoice:choice});
}
export function completeLab(session){return step(session,"interpret-answered","completed");}
export function labHasObservation(session){
 return Boolean(session)&&["observation","interpret-unanswered","interpret-answered","completed"].includes(session.phase);
}
export function labHasPredictionFeedback(session){
 return Boolean(session)&&!["predict-unanswered","not-started"].includes(session.phase);
}
export function labHasInterpretationFeedback(session){
 return Boolean(session)&&["interpret-answered","completed"].includes(session.phase);
}
