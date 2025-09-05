import { useState } from "react";

import Questionlist from "../../componetns/ExamAQ/Questionlist";

const ExamQA = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6 p-6">
      <Questionlist />
    </div>
  );
};

export default ExamQA;
