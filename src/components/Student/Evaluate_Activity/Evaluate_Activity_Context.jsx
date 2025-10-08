
import { createContext, useState } from "react";
import Evaluate_Activity from "./Evaluate_Activity.jsx"; 

const Evaluate_Activity_Context = createContext();

export function Evaluate_Activity_Provider({ children }) {
  const [showEvaluate, setShowEvaluate] = useState(false);

  const openEvaluate = () => {
    setShowEvaluate(true);
  };
  const closeEvaluate = () => setShowEvaluate(false);

  return (
    <Evaluate_Activity_Context.Provider value={{ openEvaluate, closeEvaluate }}>
      {children}
      {showEvaluate && <Evaluate_Activity onClose={closeEvaluate} />}
    </Evaluate_Activity_Context.Provider>
  );
}

export { Evaluate_Activity_Context };
