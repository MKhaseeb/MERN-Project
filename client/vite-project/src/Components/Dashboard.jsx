import React, { useState } from "react";
import { ApplicationBoard } from "./ApplicationBoard";
import { JobDetail } from "./JobDetail";

export const Dashboard = ({ userId }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <div>
      <ApplicationBoard
        userId={userId}
        onJobClick={(job) => setSelectedJob(job)}
      />

      {selectedJob && (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};
