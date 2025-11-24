import { createContext, useState } from "react";
import Evaluate_Activity from "./Evaluate_Activity.jsx"; 

const Evaluate_Activity_Context = createContext();

export function Evaluate_Activity_Provider({ children }) {
  const [showEvaluate, setShowEvaluate] = useState(false);
  const [activityId, setActivityId] = useState(null);
  const [title, setTitle] = useState("");

  // mở popup, truyền id và title
  const openEvaluate = (id, activityTitle) => {
    setActivityId(id);
    setTitle(activityTitle);
    setShowEvaluate(true);
  };

  const closeEvaluate = () => setShowEvaluate(false);

  return (
    <Evaluate_Activity_Context.Provider 
      value={{ openEvaluate, closeEvaluate, activityId, title }}
    >
      {children}
      {showEvaluate && (
        <Evaluate_Activity
          onClose={closeEvaluate}
          activityId={activityId}
          title={title}
        />
      )}
    </Evaluate_Activity_Context.Provider>
  );
}

export { Evaluate_Activity_Context };
