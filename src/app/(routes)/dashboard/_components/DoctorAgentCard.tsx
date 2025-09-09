"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
};

type props = {
  doctorAgent: doctorAgent;
};

// DoctorAgentCard.tsx
// DoctorAgentCard.tsx
function DoctorAgentCard({ doctorAgent }: props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: "New Query",
        selectedDoctor: doctorAgent,
      });

      const sessionId = result.data?.[0]?.SessionChartTable?.sessionId;
      if (sessionId) router.push("/dashboard/medical-agent/" + sessionId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 flex flex-col items-center text-center text-white">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute top-3 right-3 bg-black text-white px-2 py-1 rounded-full text-xs">
          Premium
        </Badge>
      )}

      <div className="w-24 h-24 mb-3 relative">
        <Image
          src={doctorAgent.image}
          alt={doctorAgent.specialist}
          fill
          className="object-cover rounded-full border-2 border-gray-700 shadow-sm"
        />
      </div>

      <h3 className="font-semibold text-lg">{doctorAgent.specialist}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {doctorAgent.description}
      </p>

      <Button
        className="mt-3 px-4 py-2 text-sm bg-black hover:bg-blue-700 flex items-center gap-1"
        onClick={onStartConsultation}
        disabled={loading}
      >
        {loading ? <Loader className="animate-spin h-4 w-4" /> : "Start"}
      </Button>
    </div>
  );
}


export default DoctorAgentCard;
