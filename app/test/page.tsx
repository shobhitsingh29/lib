"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function TestPage() {
  const {
    questions,
    setQuestions,
    startTest,
    endTest,
    testMode,
    testStartTime,
    testAnswers,
    answerQuestion,
    addBadge,
  } = useStore()

  const [testQuestions, setTestQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({})
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    // Load questions and start test with better error handling
    const loadQuestions = async () => {
      try {
        console.log("🔥 LOADING EPIC TEST QUESTIONS...")
        const response = await fetch("/data/questions.json")

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const text = await response.text()
        let data
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          console.error("JSON parse error:", parseError)
          throw new Error(`Invalid JSON: ${parseError.message}`)
        }

        if (!Array.isArray(data)) {
          throw new Error("Expected an array of questions")
        }

        console.log("🚀 Successfully loaded", data.length, "INSANE questions for test!")
        setQuestions(data)
        // Select 310 random questions for the test
        const shuffled = [...data].sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, Math.min(310, data.length))
        setTestQuestions(selected)
        startTest()
      } catch (err) {
        console.error("Failed to load questions:", err)
        // Fallback: create some sample questions if loading fails
        const fallbackQuestions = [
          {
            id: "q001",
            category: "Politics",
            question: "What is the capital of Germany?",
            options: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
            answerIndex: 0,
            explanation: "Berlin has been the federal capital of Germany since reunification in 1990.",
          },
          {
            id: "q002",
            category: "History",
            question: "When was the Berlin Wall built?",
            options: ["1959", "1961", "1963", "1965"],
            answerIndex: 1,
            explanation: "The Berlin Wall was built on August 13, 1961, to separate East and West Berlin.",
          },
          {
            id: "q003",
            category: "Politics",
            question: "How many federal states (Bundesländer) does Germany have?",
            options: ["14", "15", "16", "17"],
            answerIndex: 2,
            explanation: "Germany consists of 16 federal states (Bundesländer).",
          },
        ]
        console.log("💪 Using fallback questions for test")
        setQuestions(fallbackQuestions)
        setTestQuestions(fallbackQuestions)
        startTest()
      }
    }

    // Load questions and start test mode
    if (questions.length === 0) {
      loadQuestions();
    }

    startTest()
  }, [questions.length, setQuestions, startTest])

  useEffect(() => {
    if (!testMode || !testStartTime) return

    const timer = setInterval(() => {
      const elapsed = Math.floor((Date.now() - testStartTime) / 1000)
      const remaining = Math.max(0, 60 * 60 - elapsed)
      setTimeRemaining(remaining)

      if (remaining === 0) {
        handleSubmitTest()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [testMode, testStartTime])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }))
  }

  const handleSubmitTest = () => {
    let correctCount = 0

    testQuestions.forEach((question, index) => {
      const selectedIndex = selectedAnswers[index]
      const correct = selectedIndex === question.answerIndex
      if (correct) correctCount++

      answerQuestion(question.id, selectedIndex ?? -1, correct)
    })

    // Award badge if passed (155 or more correct out of 310)
    if (correctCount >= 155) {
      addBadge("test-master")
    }

    endTest()
    setShowResults(true)
  }

  const currentQuestion = testQuestions[currentIndex]
  const progress = testQuestions.length > 0 ? ((currentIndex + 1) / testQuestions.length) * 100 : 0;

  if (showResults) {
    const correctCount = testQuestions.reduce((count, question, index) => {
      return count + (selectedAnswers[index] === question.answerIndex ? 1 : 0)
    }, 0)

    const passed = correctCount >= 155
    const percentage = Math.round((correctCount / testQuestions.length) * 100)

    return (
      <div className="min-h-screen bg-black text-white overflow-hidden relative">
        {/* INSANE animated background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>

          {/* Floating celebration elements */}
          <div className="absolute top-10 left-10 text-6xl animate-bounce">🎉</div>
          <div className="absolute top-20 right-20 text-5xl animate-spin" style={{ animationDuration: "3s" }}>
            ⭐
          </div>
          <div className="absolute bottom-20 left-20 text-4xl animate-pulse">🏆</div>
          <div className="absolute bottom-10 right-10 text-6xl animate-bounce" style={{ animationDelay: "1s" }}>
            🔥
          </div>

          {/* Moving orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Card
                className={`border-4 backdrop-blur-sm relative overflow-hidden ${passed ? "border-green-400 bg-gradient-to-br from-green-900/30 to-emerald-900/30" : "border-red-400 bg-gradient-to-br from-red-900/30 to-pink-900/30"}`}
              >
                <div className={`absolute inset-0 animate-pulse ${passed ? "bg-green-400/20" : "bg-red-400/20"}`}></div>
                <CardHeader className="text-center relative z-10">
                  <div className={`text-8xl mb-4 animate-bounce ${passed ? "text-green-400" : "text-red-400"}`}>
                    {passed ? "🎉" : "💪"}
                  </div>
                  <CardTitle className={`text-5xl font-black mb-4 ${passed ? "text-green-400" : "text-red-400"}`}>
                    {passed ? "🔥 CITIZENSHIP UNLOCKED! 🔥" : "💪 KEEP GRINDING! 💪"}
                  </CardTitle>
                  <p className="text-2xl text-white font-bold animate-pulse">
                    {passed ? "⚡ YOU'RE READY FOR GERMANY! ⚡" : "🎯 PRACTICE MORE TO DOMINATE! 🎯"}
                  </p>
                </CardHeader>
                <CardContent className="space-y-8 relative z-10">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="group cursor-pointer">
                      <div className="text-4xl font-black text-green-400 mb-2 group-hover:scale-125 transition-transform">
                        {correctCount}
                      </div>
                      <div className="text-lg text-gray-300 font-bold">🎯 CORRECT</div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="text-4xl font-black text-red-400 mb-2 group-hover:scale-125 transition-transform">
                        {testQuestions.length - correctCount}
                      </div>
                      <div className="text-lg text-gray-300 font-bold">💥 MISSED</div>
                    </div>
                    <div className="group cursor-pointer">
                      <div className="text-4xl font-black text-blue-400 mb-2 group-hover:scale-125 transition-transform">
                        {percentage}%
                      </div>
                      <div className="text-lg text-gray-300 font-bold">📊 SCORE</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-yellow-400">🎯 Required to pass: 155/310 (50%)</span>
                      <span className="text-cyan-400">
                        Your score: {correctCount}/{testQuestions.length} ({percentage}%)
                      </span>
                    </div>
                    <Progress value={(correctCount / testQuestions.length) * 100} className="h-4" />
                  </div>

                  <div className="flex space-x-4">
                    <Link href="/practice" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-black py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0">
                        🎮 PRACTICE MORE
                      </Button>
                    </Link>
                    <Link href="/review" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0">
                        🧠 REVIEW ANSWERS
                      </Button>
                    </Link>
                  </div>

                  <Link href="/" className="block">
                    <Button className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black py-4 text-xl rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0">
                      <ArrowLeft className="w-6 h-6 mr-3" />🏠 BACK TO HOME
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        {/* INSANE loading background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating loading emojis */}
          <div className="absolute top-20 left-20 text-4xl animate-bounce">⚡</div>
          <div className="absolute top-40 right-32 text-3xl animate-spin" style={{ animationDuration: "2s" }}>
            🔥
          </div>
          <div className="absolute bottom-32 left-32 text-5xl animate-pulse">🎯</div>
          <div className="absolute bottom-20 right-20 text-3xl animate-bounce" style={{ animationDelay: "1s" }}>
            💎
          </div>
        </div>

        <Card className="w-full max-w-md border-4 border-purple-500/50 bg-gradient-to-br from-purple-900/50 to-black/50 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
          <CardContent className="p-8 text-center relative z-10">
            <div className="text-8xl mb-6 animate-bounce">🎮</div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-8"></div>
            <p className="text-purple-300 text-2xl font-black animate-pulse">🔥 LOADING EPIC TEST CHALLENGE...</p>
            <p className="text-cyan-400 text-lg font-bold mt-4 animate-bounce" style={{ animationDelay: "0.5s" }}>
              🚀 PREPARE FOR MAXIMUM DIFFICULTY! 🚀
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* INSANE animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black"></div>

        {/* Floating elements */}
        <div
          className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rotate-45 animate-spin"
          style={{ animationDuration: "3s" }}
        ></div>
        <div
          className="absolute top-32 right-20 w-6 h-6 bg-pink-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute bottom-40 left-32 w-8 h-8 bg-green-400 rotate-45 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-20 right-40 w-3 h-3 bg-cyan-400 animate-ping"
          style={{ animationDelay: "1.5s" }}
        ></div>

        {/* Moving orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Floating emojis */}
        <div className="absolute top-20 left-20 text-3xl animate-bounce" style={{ animationDelay: "0s" }}>
          ⚡
        </div>
        <div className="absolute top-40 right-32 text-2xl animate-bounce" style={{ animationDelay: "1s" }}>
          🎯
        </div>
        <div className="absolute bottom-32 left-32 text-4xl animate-bounce" style={{ animationDelay: "2s" }}>
          🔥
        </div>
        <div className="absolute bottom-20 right-20 text-2xl animate-bounce" style={{ animationDelay: "3s" }}>
          💎
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header with MAXIMUM ENERGY */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-black px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-110 border-0">
              <ArrowLeft className="w-5 h-5 mr-2" />🏠 EXIT TEST
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-5xl font-black mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
                ⚡ TEST MODE ⚡
              </span>
            </h1>
            <div className="text-lg text-gray-300 animate-bounce">🎯 REAL EXAM SIMULATION! 🎯</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-red-900/50 to-pink-900/50 px-4 py-2 rounded-full border-2 border-red-500/50">
              <Clock className="w-5 h-5 text-red-400" />
              <span
                className={`font-mono text-xl font-black ${timeRemaining < 300 ? "text-red-400 animate-pulse" : "text-white"}`}
              >
                {formatTime(timeRemaining)}
              </span>
            </div>
            <div className="text-lg text-gray-300 font-bold">
              Question {currentIndex + 1} of {testQuestions.length}
            </div>
          </div>
        </div>

        {/* Progress with INSANE styling */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xl font-black text-cyan-400">🚀 PROGRESS</span>
            <span className="text-xl font-black text-purple-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-4 bg-gray-800 border-2 border-purple-500/50" />
        </div>

        {/* Question Card with MAXIMUM VIBE */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-purple-500/50 bg-gradient-to-br from-purple-900/30 to-black/50 backdrop-blur-sm shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>
            <CardHeader className="bg-gradient-to-r from-purple-900/50 to-black/50 border-b-2 border-purple-500/50 p-8 relative z-10">
              <div className="absolute top-2 right-2 text-3xl animate-bounce">🎯</div>
              <div className="flex justify-between items-start mb-6">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-6 py-3 rounded-full text-xl font-black animate-pulse">
                  🔥 {currentQuestion.category.toUpperCase()}
                </div>
                <div className="text-2xl font-black text-yellow-400">#{currentIndex + 1}</div>
              </div>
              <CardTitle className="text-3xl font-bold text-white leading-relaxed">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>

            <CardContent className="p-8 space-y-4 bg-gradient-to-b from-black/50 to-purple-900/30 relative z-10">
              {currentQuestion.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full text-left justify-start h-auto p-6 text-lg font-semibold border-2 transition-all transform hover:scale-105 ${
                    selectedAnswers[currentIndex] === index
                      ? "border-cyan-400 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-300 shadow-lg shadow-cyan-500/25"
                      : "border-gray-600 hover:border-purple-400 hover:bg-purple-900/30 text-gray-300"
                  }`}
                  onClick={() => handleAnswerSelect(currentIndex, index)}
                >
                  <span className="mr-4 font-black text-2xl w-8 text-yellow-400">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1">{option}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Navigation with GAMING ENERGY */}
          <div className="flex justify-between mt-8">
            <Button
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              ⬅️ PREVIOUS
            </Button>

            {currentIndex === testQuestions.length - 1 ? (
              <Button
                onClick={handleSubmitTest}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-black px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                disabled={Object.keys(selectedAnswers).length < testQuestions.length}
              >
                🏆 SUBMIT TEST
              </Button>
            ) : (
              <Button
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-black px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
                onClick={() => setCurrentIndex(Math.min(testQuestions.length - 1, currentIndex + 1))}
              >
                NEXT ➡️
              </Button>
            )}
          </div>

          {/* Answer Overview with MAXIMUM CHAOS */}
          <Card className="mt-8 border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 animate-pulse"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-center text-yellow-400 font-black text-2xl">🎮 ANSWER OVERVIEW 🎮</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-11 gap-2">
                {testQuestions.map((_, index) => (
                  <Button
                    key={index}
                    variant={currentIndex === index ? "default" : "outline"}
                    size="sm"
                    className={`h-12 w-12 p-0 text-sm font-black transition-all transform hover:scale-110 ${
                      selectedAnswers[index] !== undefined
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white shadow-lg shadow-green-500/25"
                        : "bg-gray-800 border-gray-600 text-gray-400"
                    } ${currentIndex === index ? "ring-4 ring-cyan-400 scale-110" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6 text-lg font-bold">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded border border-green-400"></div>
                    <span className="text-green-400">✅ ANSWERED</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-800 border border-gray-600 rounded"></div>
                    <span className="text-gray-400">❓ UNANSWERED</span>
                  </div>
                </div>
                <div className="text-cyan-400 animate-pulse">
                  🎯 {Object.keys(selectedAnswers).length} / {testQuestions.length} COMPLETED
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}