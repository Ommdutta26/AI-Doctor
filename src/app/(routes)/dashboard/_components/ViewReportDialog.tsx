import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { SessionDetail } from '../medical-agent/[sessionId]/page'
import moment from 'moment'

type Props = {
  record: SessionDetail
}

function ViewReportDialog({ record }: Props) {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'link'}>View Report</Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle asChild>
              <h2 className="text-center text-3xl font-bold mb-6">
                Medical Voice AI Agent Report
              </h2>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-8">
                {/* Section: Video Info */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">Video Info</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">Doctor Specialization:</span> {record?.selectedDoctor?.specialist}</p>
                    <p><span className="font-medium">Consult Date:</span> {moment(new Date(record?.createdOn)).format("LLL")}</p>
                  </div>
                </div>

                {/* Section: Notes */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">User Notes</h2>
                  <p className="text-sm">{record?.notes || "No notes provided."}</p>
                </div>

                {/* Section: Chief Complaint */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">Chief Complaint</h2>
                  <p className="text-sm">{record?.report?.chiefComplaint || "N/A"}</p>
                </div>

                {/* Section: Symptoms */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">Symptoms</h2>
                  <ul className="list-disc list-inside text-sm">
                    {record?.report?.symptoms?.length > 0 ? (
                      record.report.symptoms.map((symptom: string, idx: number) => (
                        <li key={idx}>{symptom}</li>
                      ))
                    ) : (
                      <li>No symptoms reported.</li>
                    )}
                  </ul>
                </div>

                {/* Section: Medications */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">Medications Mentioned</h2>
                  <ul className="list-disc list-inside text-sm">
                    {record?.report?.medicationsMentioned?.length > 0 ? (
                      record.report.medicationsMentioned.map((med: string, idx: number) => (
                        <li key={idx}>{med}</li>
                      ))
                    ) : (
                      <li>No medications mentioned.</li>
                    )}
                  </ul>
                </div>

                {/* Section: Recommendations */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">Recommendations</h2>
                  <ul className="list-disc list-inside text-sm">
                    {record?.report?.recommendations?.length > 0 ? (
                      record.report.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))
                    ) : (
                      <li>No recommendations provided.</li>
                    )}
                  </ul>
                </div>

                {/* Section: Summary */}
                <div>
                  <h2 className="text-blue-600 text-lg font-semibold border-b border-blue-500 pb-1 mb-2">Summary</h2>
                  <p className="text-sm">{record?.report?.summary || "No summary available."}</p>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ViewReportDialog
