"use client";

import React from "react";
import { AIDoctorAgents } from "../../../../../shared/list";
import DoctorAgentCard from "./DoctorAgentCard";

// DoctorsAgentList.tsx
// DoctorsAgentList.tsx
function DoctorsAgentList() {
  return (
    <div className="mt-5">
      <h2 className="text-2xl font-bold text-white mb-6">
        AI Specialist Doctors & Agents
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {AIDoctorAgents.map((doctor, index) => (
          <DoctorAgentCard key={index} doctorAgent={doctor} />
        ))}
      </div>
    </div>
  );
}



export default DoctorsAgentList;
