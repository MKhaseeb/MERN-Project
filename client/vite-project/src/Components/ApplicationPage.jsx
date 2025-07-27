import React, { useState } from "react";
import { ApplicationBoard } from "./ApplicationBoard";
import { JobDetail } from "./JobDetail";

const ApplicationPage = ({ userId }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <>
      <ApplicationBoard userId={userId} onJobClick={(job) => setSelectedJob(job)} />

      {selectedJob && (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
};

export default ApplicationPage;
