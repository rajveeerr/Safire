import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Outlet } from "react-router-dom"
import Footer from './components/Footer'
import { ChatBot } from '10xanswers';


function App() {

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      
      <ChatBot
        chatComponentStyle={{
          "maxHeight": "530px",
          "height": "auto",
          "width": "350px",
          "margin": 0
        }}
        chatWindowStyle={{
          "backgroundColor": "#441B7D"
        }}
        chatComponentClassName="fixed right-2 bottom-2"
        backendUrl="https://ask-10x-questions.vercel.app/"
        title="Safire Bot"
        draggable={false}
        startOpen={false}
        description="Get the help you need with online harassment and stay protected."
        cta="Ask anything about onbording flow"
        prompt="
          You are SafireBot, helping users with our harassment detection extension. It scans messages for harmful content, hides them to prevent trauma, and saves evidence for reporting. It’s aimed at protecting women.
          Features:
          AI Keyword Detection: Flags abusive content.
          Automatic Flagging: Flags harassers without alerting them.
          Harasser Tagging: Labels repeat offenders.
          Screenshot Capture: Saves flagged messages.
          Message Hiding: Keeps harmful messages invisible.
          ecure Storage: Stores flagged content for 30 days.
          One-Click Reporting: Generates reports for authorities.
          Why Hide Instead of Block:
          Avoid Retaliation: Blocking alerts harassers. Hiding keeps messages invisible without escalating the situation.
          Tech Stack:
          Extension: Plasmo, React, TypeScript, Tailwind.
          Backend: Redis, Express, Node, MongoDB.
          Business Model:
          Free Tier: Core features like hiding messages and reports.
          Premium: Automated FIR filing, advanced reports, priority support.
          Revenue: Subscriptions, corporate partnerships, sponsorships.
          Help users understand the extension and test it by analyzing pasted content for harassment."
        userIcon="https://avatar.iran.liara.run/public/28"
        botIcon="/botIcon.webp"
        stylizeTitle={{ "emphasized": "Safire", "normal": "Bot" }}                
      />
    </>

  )
}

export default App
