# AI Doctor

AI Doctor is a web application that allows users to enter their symptoms and get connected with the most suitable doctors for consultation. The platform leverages OpenAI to intelligently match patients with suggested doctors and provides a seamless consultation experience.  

## Features

- **Symptom Input:** Users can enter their symptoms into the system.  
- **Doctor Matching:** OpenAI suggests the most appropriate doctors based on the entered symptoms.If the user wants they can directly consult to doctors they want such as general physician,ENT etc  
- **Consultation Calls:** Users can start a consultation call with the selected doctor. The app integrates **VAPI AI** for handling the call.  
- **Post-Consultation Report:** After the call ends, an AI-generated report is created, including:
  - Consultation date and time  
  - Symptoms discussed  
  - Prescribed medications  
  - Precautions to take  

## Technology Stack

- **Frontend:** Next.js  
- **AI Integration:** OpenAI for doctor suggestion and report generation  
- **Voice Calls:** VAPI AI integration  

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ommdutta26/AI-Doctor.git
