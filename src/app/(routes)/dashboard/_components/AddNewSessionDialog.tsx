"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";

const AddNewSessionDialog = () => {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const router = useRouter();

  const onClickNext = async () => {
    try {
      setLoading(true);
      const result = await axios.post("/api/suggested-doctors", {
        notes: note,
      });
      setSuggestedDoctors(result.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: selectedDoctor,
      });
      const sessionId = result.data?.[0]?.SessionChartTable?.sessionId;
      if (sessionId) {
        setTimeout(() => {
          router.push("/dashboard/medical-agent/" + sessionId);
        }, 100);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transform transition-all shadow-md">
            Start a Consultation
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-3xl rounded-2xl bg-white dark:bg-gray-900 p-6 md:p-10 shadow-xl overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {suggestedDoctors ? "Select a Doctor" : "Add Basic Details"}
            </DialogTitle>
            <DialogDescription asChild>
              {!suggestedDoctors ? (
                <div className="mt-4">
                  <h2 className="text-gray-600 dark:text-gray-300 mb-2">
                    Add Symptoms or any other details
                  </h2>
                  <Textarea
                    placeholder="Describe your symptoms here..."
                    className="h-44 resize-none rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {suggestedDoctors.map((doctor, index) => (
                      <SuggestedDoctorCard
                        key={index}
                        doctorAgent={doctor}
                        setSelectedDoctorAgent={setSelectedDoctor}
                      />
                    ))}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button variant={"outline"} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                Cancel
              </Button>
            </DialogClose>

            {!suggestedDoctors ? (
              <Button
                disabled={!note || loading}
                onClick={onClickNext}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105 transform transition-all shadow-md flex items-center gap-2"
              >
                Next {loading && <Loader2 className="animate-spin w-5 h-5" />}
                {!loading && <ArrowRight />}
              </Button>
            ) : (
              <Button
                disabled={loading || !selectedDoctor}
                onClick={onStartConsultation}
                className="bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-105 transform transition-all shadow-md flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight />}
                Start Consultation
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewSessionDialog;
