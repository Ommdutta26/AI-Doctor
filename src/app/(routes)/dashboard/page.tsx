import React from "react";
import HistoryList from "./_components/HistoryList";
import DoctorsAgentList from "./_components/DoctorsAgentList";
import AddNewSessionDialog from "../dashboard/_components/AddNewSessionDialog";

function WorkSpace() {
  return (
    <div className="pt-28 max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Dashboard
        </h2>
        <AddNewSessionDialog />
      </div>

      {/* History List */}
      <section className="mb-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Session History
        </h3>
        <HistoryList />
      </section>

      {/* Doctors / Agents List */}
      <section className="mb-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
          Doctors & Agents
        </h3>
        <DoctorsAgentList />
      </section>
    </div>
  );
}

export default WorkSpace;
