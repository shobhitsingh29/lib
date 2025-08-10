"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/lib/store"
import SwipeCard from "@/components/SwipeCard"
import ProgressBar from "@/components/ProgressBar"
import Badge from "@/components/Badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, RotateCcw, Filter, MapPin } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { getTranslation } from "@/lib/i18n"

const germanStates = [
  { id: "baden-wuerttemberg", name: "Baden-Württemberg", emoji: "🏰" },
  { id: "bayern", name: "Bayern", emoji: "🍺" },
  { id: "berlin", name: "Berlin", emoji: "🐻" },
  { id: "brandenburg", name: "Brandenburg", emoji: "🌲" },
  { id: "bremen", name: "Bremen", emoji: "⚓" },
  { id: "hamburg", name: "Hamburg", emoji: "🚢" },
  { id: "hessen", name: "Hessen", emoji: "🏛️" },
  { id: "mecklenburg-vorpommern", name: "Mecklenburg-Vorpommern", emoji: "🏖️" },
  { id: "niedersachsen", name: "Niedersachsen", emoji: "🐎" },
  { id: "nordrhein-westfalen", name: "Nordrhein-Westfalen", emoji: "⚡" },
  { id: "rheinland-pfalz", name: "Rheinland-Pfalz", emoji: "🍷" },
  { id: "saarland", name: "Saarland", emoji: "⚒️" },
  { id: "sachsen", name: "Sachsen", emoji: "🎭" },
  { id: "sachsen-anhalt", name: "Sachsen-Anhalt", emoji: "🏰" },
  { id: "schleswig-holstein", name: "Schleswig-Holstein", emoji: "🌊" },
  { id: "thueringen", name: "Thüringen", emoji: "🌿" },
]

export default function PracticePage() {
  const {
    questions,
    stateQuestions,
    setQuestions,
    setStateQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userProgress,
    selectedCategory,
    selectedState,
    setSelectedCategory,
    setSelectedState,
    answerQuestion,
    flagQuestion,
    unflagQuestion,
    addXP,
    updateStreak,
    addBadge,
    language,
  } = useStore()

  const [showAnswer, setShowAnswer] = useState(false)
  const [lastAnswer, setLastAnswer] = useState<{ correct: boolean; selectedIndex: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCorrect, setShowCorrect] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const t = getTranslation(language)

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true)

        // Load main questions
        const response = await fetch("/data/questions.json")
        if (!response.ok) throw new Error(`HTTP ${response.status}`)
        const data = await response.json()
        if (!Array.isArray(data)) throw new Error(`Expected array, got ${typeof data}`)
        setQuestions(data)

        // Load state questions
        const stateResponse = await fetch("/data/state-questions.json")
        if (stateResponse.ok) {
          const stateData = await stateResponse.json()
          if (selectedState && stateData[selectedState]) {
            setStateQuestions(stateData[selectedState])
          }
        }
      } catch (error) {
        console.error("Failed to load questions:", error)
        const fallbackQuestions = [
          {
            id: "q001",
            category: "Politics",
            question: "What is the capital of Germany?",
            options: ["Berlin", "Munich", "Frankfurt", "Hamburg"],
            answerIndex: 0,
            explanation: "Berlin has been the federal capital of Germany since reunification in 1990.",
          },
        ]
        setQuestions(fallbackQuestions)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [setQuestions, setStateQuestions, selectedState])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        nextQuestion()
      } else if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        previousQuestion()
      } else if (event.key >= "1" && event.key <= "4" && !showAnswer) {
        const optionIndex = parseInt(event.key) - 1
        if (currentQuestion && optionIndex < currentQuestion.options.length) {
          handleAnswerSelect(optionIndex)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, showAnswer, currentQuestion])

  const allQuestions = [...questions, ...stateQuestions]
  const filteredQuestions = selectedCategory
    ? allQuestions.filter((q) => q.category === selectedCategory)
    : allQuestions
  const currentQuestion = filteredQuestions[currentIndex]
  const categories = [...new Set(allQuestions.map((q) => q.category))]

  const handleFlag = () => {
    if (!currentQuestion) return
    if (userProgress.flaggedQuestions.includes(currentQuestion.id)) {
      unflagQuestion(currentQuestion.id)
    } else {
      flagQuestion(currentQuestion.id)
    }
  }

  const nextQuestion = () => {
    setShowAnswer(false)
    setShowCorrect(false)
    setLastAnswer(null)
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Optionally handle end of questions, e.g., show a summary
      alert("You've reached the end of the questions!")
      setCurrentIndex(0) // Loop back to the start
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setShowAnswer(false)
      setShowCorrect(false)
      setLastAnswer(null)
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      nextQuestion()
    } else {
      previousQuestion()
    }
  }

  const handleAnswerSelect = (selectedAnswerIndex: number) => {
    if (showAnswer || !currentQuestion) return

    const isCorrect = selectedAnswerIndex === currentQuestion.answerIndex

    // Record answer
    answerQuestion(currentQuestion.id, selectedAnswerIndex, isCorrect)

    if (isCorrect) {
      addXP(10)
      updateStreak(true)
      setShowCorrect(true)

      // Check for streak badges
      if (userProgress.streak === 5) addBadge("streak-5")
      if (userProgress.streak === 10) addBadge("streak-10")

      // Check for XP badges
      if (userProgress.xp >= 100 && !userProgress.badges.includes("xp-100")) addBadge("xp-100")
      if (userProgress.xp >= 500 && !userProgress.badges.includes("xp-500")) addBadge("xp-500")
    } else {
      updateStreak(false)
      setShowCorrect(false)
    }

    setLastAnswer({ correct: isCorrect, selectedIndex: selectedAnswerIndex })
    setShowAnswer(true)

    // Auto-advance after showing answer (reduced time)
    setTimeout(() => {
      nextQuestion()
    }, 1500)
  }

  const resetProgress = () => {
    setCurrentIndex(0)
    setShowAnswer(false)
    setLastAnswer(null)
    setShowCorrect(false)
    // Add logic to reset streak, XP, etc. if needed
    // For now, assuming store handles resetting progress if necessary
  }

  if (loading || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white flex items-center justify-center relative overflow-hidden">
        {/* INSANE loading background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <Card className="w-full max-w-md border-2 border-cyan-400/50 bg-black/80 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-cyan-500/25">
          <CardContent className="p-8 text-center relative z-10">
            <div className="text-8xl mb-6 animate-bounce">🚀</div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-400 border-t-transparent mx-auto mb-8"></div>
            <p className="text-cyan-300 text-2xl font-black animate-pulse">{t.loadingQuestions}</p>
            <p className="text-pink-400 text-lg font-bold mt-4 animate-bounce">{t.getReady}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-pink-900 text-white overflow-hidden relative">
      {/* INSANE vibey background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s", animationDuration: "6s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s", animationDuration: "8s" }}
        ></div>

        {/* Floating neon elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-pink-500 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-32 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {/* VIBEY Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-2 border-red-400/50 px-6 py-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all transform hover:scale-110 backdrop-blur-sm font-black">
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.back.toUpperCase()}
            </Button>
          </Link>

          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                {t.practiceMode.toUpperCase()}
              </span>
            </h1>
            <div className="text-lg text-pink-300 font-bold">{t.practiceSubtitle} 🚀</div>
          </div>

          <Button
            onClick={resetProgress}
            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 border-0"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t.reset.toUpperCase()}
          </Button>
        </div>

        {/* NEON Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="border-2 border-cyan-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-300 text-sm font-bold uppercase tracking-wider">{t.progress}</p>
                  <p className="text-3xl font-black text-white">
                    {currentIndex + 1}/{filteredQuestions.length}
                  </p>
                </div>
                <div className="text-4xl group-hover:scale-125 transition-transform animate-pulse">🎯</div>
              </div>
              <div className="mt-4">
                <ProgressBar
                  current={currentIndex + 1}
                  total={filteredQuestions.length}
                  label=""
                  showNumbers={false}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-yellow-500/25 hover:shadow-xl hover:shadow-yellow-500/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-300 text-sm font-bold uppercase tracking-wider">{t.xp}</p>
                  <p className="text-3xl font-black text-yellow-400">{userProgress.xp}</p>
                </div>
                <div className="text-4xl group-hover:scale-125 transition-transform animate-bounce">⚡</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-300 text-sm font-bold uppercase tracking-wider">{t.streak}</p>
                  <p className="text-3xl font-black text-orange-400">{userProgress.streak}</p>
                </div>
                <div className="text-4xl group-hover:scale-125 transition-transform animate-pulse">🔥</div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-400/50 bg-black/60 backdrop-blur-xl hover:bg-black/80 transition-all duration-300 group shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-bold uppercase tracking-wider">{t.accuracy}</p>
                  <p className="text-3xl font-black text-green-400">
                    {userProgress.questionsAnswered > 0
                      ? Math.round((userProgress.correctAnswers / userProgress.questionsAnswered) * 100)
                      : 0}
                    %
                  </p>
                </div>
                <div
                  className="text-4xl group-hover:scale-125 transition-transform animate-spin"
                  style={{ animationDuration: "3s" }}
                >
                  📊
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INSANE Filter Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Category Filter */}
          <Card className="border-2 border-purple-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-purple-500/25">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-6 h-6 text-purple-400 animate-pulse" />
                <h3 className="text-xl font-black text-purple-300 uppercase tracking-wider">{t.filterByCategory}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null)
                    setCurrentIndex(0)
                  }}
                  className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-105 ${
                    !selectedCategory
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50 border-2 border-cyan-400"
                      : "bg-black/50 text-cyan-300 hover:bg-black/80 hover:text-white border-2 border-cyan-400/30"
                  }`}
                >
                  🌟 {t.allCategories}
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setCurrentIndex(0)
                    }}
                    className={`px-4 py-2 rounded-lg font-bold transition-all transform hover:scale-105 ${
                      selectedCategory === category
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/50 border-2 border-purple-400"
                        : "bg-black/50 text-purple-300 hover:bg-black/80 hover:text-white border-2 border-purple-400/30"
                    }`}
                  >
                    🔥 {category}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* State Filter */}
          <Card className="border-2 border-pink-400/50 bg-black/60 backdrop-blur-xl shadow-lg shadow-pink-500/25">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <MapPin className="w-6 h-6 text-pink-400 animate-bounce" />
                <h3 className="text-xl font-black text-pink-300 uppercase tracking-wider">{t.selectState}</h3>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                <button
                  onClick={() => {
                    setSelectedState(null)
                    setCurrentIndex(0)
                  }}
                  className={`px-3 py-2 rounded-lg font-bold transition-all transform hover:scale-105 text-sm ${
                    !selectedState
                      ? "bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg shadow-pink-500/50 border-2 border-pink-400"
                      : "bg-black/50 text-pink-300 hover:bg-black/80 hover:text-white border-2 border-pink-400/30"
                  }`}
                >
                  🇩🇪 {t.allGermany}
                </button>
                {germanStates.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => {
                      setSelectedState(state.id)
                      setCurrentIndex(0)
                    }}
                    className={`px-3 py-2 rounded-lg font-bold transition-all transform hover:scale-105 text-sm ${
                      selectedState === state.id
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black shadow-lg shadow-yellow-500/50 border-2 border-yellow-400"
                        : "bg-black/50 text-yellow-300 hover:bg-black/80 hover:text-white border-2 border-yellow-400/30"
                    }`}
                  >
                    {state.emoji} {state.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Card Area */}
        <div className="flex justify-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentQuestion.id}-${showAnswer}`}
              initial={{ opacity: 0, y: 50, scale: 0.9, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.9, rotateY: 15 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 25 }}
            >
              <SwipeCard
                question={currentQuestion}
                onSwipe={handleSwipe}
                onFlag={handleFlag}
                isFlagged={userProgress.flaggedQuestions.includes(currentQuestion.id)}
                showAnswer={showAnswer}
                onAnswerSelect={handleAnswerSelect}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Answer Feedback */}
        {showAnswer && lastAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <Card
              className={`w-full max-w-md border-4 shadow-2xl backdrop-blur-xl relative overflow-hidden ${
                lastAnswer.correct
                  ? "border-green-400 bg-gradient-to-br from-green-900/50 to-emerald-900/50 shadow-green-500/50"
                  : "border-red-400 bg-gradient-to-br from-red-900/50 to-pink-900/50 shadow-red-500/50"
              }`}
            >
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              <CardContent className="p-8 text-center relative z-10">
                <div className="text-8xl mb-4 animate-bounce">{lastAnswer.correct ? "🎉" : "💪"}</div>
                <div
                  className={`text-4xl font-black mb-4 animate-pulse ${lastAnswer.correct ? "text-green-400" : "text-red-400"}`}
                >
                  {lastAnswer.correct ? t.crushingIt : t.keepGrinding}
                </div>
                <p className="text-2xl text-white font-bold">
                  {lastAnswer.correct ? t.xpEarned : t.learnFromMistakes}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Badges */}
        {userProgress.badges.length > 0 && (
          <div className="flex justify-center">
            <Card className="w-full max-w-md border-2 border-yellow-400/50 bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl shadow-lg shadow-yellow-500/25">
              <CardHeader>
                <CardTitle className="text-center text-yellow-400 font-black text-2xl animate-pulse">{t.achievements}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-4">
                  {userProgress.badges.slice(-3).map((badge, index) => (
                    <div
                      key={badge}
                      className="hover:scale-125 transition-transform cursor-pointer animate-bounce"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <Badge type={badge} earned size="sm" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center mt-12 space-y-6">
          <div className="text-3xl font-black animate-pulse">
            <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
              {t.howToPractice.toUpperCase()}
            </span>
          </div>
          <div className="space-y-3 text-lg max-w-2xl mx-auto">
            <p className="text-cyan-300 font-bold">💡 {t.swipeInstructions}</p>
            <p className="text-pink-300 font-bold">➡️ {t.swipeRight}</p>
            <p className="text-yellow-300 font-bold">⬅️ {t.swipeLeft}</p>
            <p className="text-green-300 font-bold">⌨️ {t.keyboardShortcuts}</p>
          </div>
          <div className="text-2xl font-black text-white animate-bounce mt-8">{t.letsDominate} 🚀</div>
        </div>
      </div>
    </div>
  )
}