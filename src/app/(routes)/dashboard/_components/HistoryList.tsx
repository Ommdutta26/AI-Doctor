"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import AddNewSessionDialog from "./AddNewSessionDialog";
import HistoryTable from "./HistoryTable";
import { SessionDetail } from "../medical-agent/[sessionId]/page";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    try {
      const result = await axios.get("/api/session-chat?sessionId=all");
      setHistoryList(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex flex-col justify-center items-center p-8 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 shadow-md gap-4">
          <Image
            src={"/medical-assistance.png"}
            alt="medical assistance"
            height={150}
            width={150}
            className="rounded-full"
          />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            No Recent Consultations
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Looks like you have not consulted with any doctors yet.
          </p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Recent Consultations
          </h3>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
};

export default HistoryList;
