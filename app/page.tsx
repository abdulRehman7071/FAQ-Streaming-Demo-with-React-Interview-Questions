'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { simulateStream } from '@/lib/simulateString'
import data from '@/utils/data.json'

export default function FAQStreamingDemo() {
  const [currentIndex, setCurrentIndex] = useState(-1) // -1 indicates no selection
  const [selectedQuestion, setSelectedQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const answerEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    answerEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [answer])

  const handleQuestionChange = async (index: number) => {
    if (isStreaming) return

    setCurrentIndex(index)
    const value = data[index]?.question || ''
    setSelectedQuestion(value)
    setAnswer('')
    setIsStreaming(true)

    const selectedFaq = data[index]
    if (selectedFaq) {
      for await (const chunk of simulateStream(selectedFaq.answer)) {
        setAnswer(prev => prev + chunk)
      }
    }

    setIsStreaming(false)
  }

  const handleNextQuestion = () => {
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % data.length
    handleQuestionChange(nextIndex)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Streaming Text Demo: React Interview Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={selectedQuestion}
            onValueChange={value => {
              const index = data.findIndex(faq => faq.question === value)
              handleQuestionChange(index)
            }}
            disabled={isStreaming}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a question" />
            </SelectTrigger>
            <SelectContent>
              {data.map((faq, index) => (
                <SelectItem key={index} value={faq.question}>
                  {faq.question}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="h-[60vh] overflow-y-auto bg-white p-4 rounded-lg border">
            <h3 className="font-bold mb-2">{selectedQuestion}</h3>
            <p className="whitespace-pre-wrap">{answer}</p>
            <div ref={answerEndRef} />
          </div>
          <div className="text-center">
            {isStreaming ? (
              <Button disabled>Streaming...</Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                {currentIndex === -1 ? 'Select an option' : 'Next QnA'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <footer className="mt-6 text-center text-sm">
        <p>
          Created by{' '}
          <a 
            href="https://abdul-rehman.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black hover:underline"
          >
            Abdul Rehman
          </a>
        </p>
      </footer>
    </div>
  )
}
