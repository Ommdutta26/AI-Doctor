"use client"

import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard'
import { Circle, PhoneCall, PhoneOff, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Vapi from '@vapi-ai/web'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export type SessionDetail = {
  id: number,
  notes: string,
  sessionId: string,
  report: JSON,
  selectedDoctor: doctorAgent,
  createdOn: string
}

type Message = {
  role: string,
  text: string
}

function MedicalVoiceAgent() {
  const { sessionId } = useParams()
  const [callStarted, setCallStarted] = useState(false)
  const [sessionDetails, setSessionDetails] = useState<SessionDetail>()
  const [vapiInstance, setVapiInstance] = useState<any>()
  const [liveTranscript, setLiveTranscript] = useState<string>()
  const [currentRole, setCurrentRole] = useState<string>()
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [startLoading, setStartLoading] = useState<boolean>(false)
  const [callTime, setCallTime] = useState<number>(0)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)
  const router = useRouter()

  useEffect(() => {
    sessionId && GetSessionDetails()
  }, [sessionId])

  const GetSessionDetails = async () => {
    const result = await axios.get('/api/session-chat?sessionId=' + sessionId)
    if (Array.isArray(result.data) && result.data.length > 0) {
      setSessionDetails(result.data[0])
    } else {
      console.warn("No session details found for this sessionId:", sessionId)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleCallStart = () => {
    setCallStarted(true)
    setStartLoading(false)
    const id = setInterval(() => {
      setCallTime(prev => prev + 1)
    }, 1000)
    setIntervalId(id)
  }

  const handleCallEnd = () => {
    setCallStarted(false)
    if (intervalId) clearInterval(intervalId)
    setIntervalId(null)
  }

  const GenerateReport = async () => {
    const result = await axios.post('/api/medical-report', {
      messages: messages,
      sessionDetails: sessionDetails,
      sessionId: sessionId
    })
    return result.data
  }

  const handleMessage = (message: any) => {
    if (message.type === 'transcript') {
      if (message.transcriptType === 'partial') {
        setLiveTranscript(message.transcript)
        setCurrentRole(message.role)
      } else if (message.transcriptType === 'final') {
        setMessages((prev) => [...prev, { role: message.role, text: message.transcript }])
        setLiveTranscript("")
        setCurrentRole(undefined)
      }
    }
  }

  const StartCall = () => {
    if (!sessionDetails) return
    setStartLoading(true)

    const vapi = new Vapi('46c224f3-6688-4a0e-bbbc-5e8c012bbfbf')
    setVapiInstance(vapi)

    const VapiAgentConfig: any = {
      name: "AI Medical Voice Agent",
      firstMessage: "Hi there! I'm your AI medical assistant. I'm here to help you.",
      transcriber: {
        provider: "assemblyai" as const,
        language: "en-US"
      },
      voice: {
        provider: "playht" as const,
        voiceId: sessionDetails.selectedDoctor.voiceId
      },
      model: {
        provider: "openai" as const,
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetails.selectedDoctor.agentPrompt
          }
        ]
      }
    }

    // Start Vapi with properly typed config
    vapi.start(VapiAgentConfig)
    vapi.on('call-start', handleCallStart)
    vapi.on('call-end', handleCallEnd)
    vapi.on('message', handleMessage)
  }

  const EndCall = async () => {
    setLoading(true)
    if (!vapiInstance) return
    vapiInstance.off('call-start', handleCallStart)
    vapiInstance.off('call-end', handleCallEnd)
    vapiInstance.off('message', handleMessage)
    vapiInstance.stop()
    setCallStarted(false)
    setVapiInstance(null)
    if (intervalId) clearInterval(intervalId)
    setIntervalId(null)
    setCallTime(0)
    await GenerateReport()
    setLoading(false)
    toast.success("Your report has been generated")
    router.replace('/dashboard')
  }

  return (
    <div className='p-10 border rounded-3xl bg-secondary'>
      <div className='flex justify-between items-center'>
        <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'>
          <Circle className={`h-4 w-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />
          {callStarted ? 'Connected...' : 'Not Connected'}
        </h2>
        <h2 className='font-bold text-xl text-gray-400'>{formatTime(callTime)}</h2>
      </div>

      {sessionDetails && (
        <div className='flex items-center flex-col mt-10'>
          <Image
            src={sessionDetails.selectedDoctor.image}
            alt={sessionDetails.selectedDoctor.specialist}
            width={120}
            height={120}
            className='h-[100px] w-[100px] object-cover rounded-full'
          />
          <h2 className='mt-2 text-lg'>{sessionDetails.selectedDoctor.specialist}</h2>
          <p className='text-sm text-gray-400'>AI medical Voice Agent</p>

          <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
            {messages.slice(-4).map((msg, index) => (
              <p key={index} className='mb-1'>
                <span className='font-bold capitalize'>{msg.role}:</span> {msg.text}
              </p>
            ))}
            {liveTranscript && (
              <h2 className='text-lg'>
                <span className='font-semibold capitalize'>{currentRole}:</span> {liveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button onClick={StartCall} className='mt-20' disabled={startLoading}>
              {startLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Starting...
                </>
              ) : (
                <>
                  <PhoneCall className='mr-2' /> Start Call
                </>
              )}
            </Button>
          ) : (
            <Button onClick={EndCall} variant='destructive' className='mt-20' disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Ending...
                </>
              ) : (
                <>
                  <PhoneOff className='mr-2' /> Disconnect
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default MedicalVoiceAgent
