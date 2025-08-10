"use client"

import { motion, type PanInfo } from "framer-motion"
import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flag, CheckCircle, XCircle, Lightbulb, ImageIcon } from "lucide-react"
import type { Question } from "@/lib/store"
import Image from "next/image"

interface SwipeCardProps {
  question: Question
  onSwipe: (direction: "left" | "right", selectedIndex: number) => void
  onFlag: () => void
  isFlagged: boolean
  showAnswer?: boolean
}

export default function SwipeCard({ question, onSwipe, onFlag, isFlagged, showAnswer = false }: SwipeCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    setDragDirection(null)

    const threshold = 100
    const velocity = info.velocity.x
    const offset = info.offset.x

    if (Math.abs(offset) > threshold || Math.abs(velocity) > 500) {
      const direction = offset > 0 ? "right" : "left"
      if (selectedOption !== null) {
        onSwipe(direction, selectedOption)
      }
    }
  }

  const handleDrag = (event: any, info: PanInfo) => {
    setIsDragging(true)
    const direction = info.offset.x > 0 ? "right" : "left"
    setDragDirection(direction)
  }

  const handleOptionClick = (index: number) => {
    setSelectedOption(index)
    setTimeout(() => {
      const isCorrect = index === question.answerIndex
      onSwipe(isCorrect ? "right" : "left", index)
    }, 500)
  }

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.05, rotate: dragDirection === "right" ? 5 : -5 }}
      animate={{
        x: 0,
        rotate: isDragging ? (dragDirection === "right" ? 5 : -5) : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card
        className={`relative overflow-hidden border-4 bg-gradient-to-br from-black/90 to-purple-900/90 backdrop-blur-xl shadow-2xl ${
          isDragging
            ? "cursor-grabbing border-cyan-400 shadow-cyan-500/50"
            : "cursor-grab border-purple-400/50 shadow-purple-500/25"
        } hover:border-pink-400/50 hover:shadow-pink-500/25 transition-all duration-300`}
      >
        {/* INSANE Swipe indicators */}
        {isDragging && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-emerald-500/30 flex items-center justify-center z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: dragDirection === "right" ? 1 : 0 }}
            >
              <div className="bg-green-500 rounded-full p-8 shadow-2xl animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute top-10 left-10 text-6xl animate-spin">🎉</div>
              <div className="absolute bottom-10 right-10 text-5xl animate-bounce">✨</div>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 flex items-center justify-center z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: dragDirection === "left" ? 1 : 0 }}
            >
              <div className="bg-red-500 rounded-full p-8 shadow-2xl animate-bounce">
                <XCircle className="w-16 h-16 text-white" />
              </div>
              <div className="absolute top-10 left-10 text-6xl animate-spin">💥</div>
              <div className="absolute bottom-10 right-10 text-5xl animate-pulse">🔥</div>
            </motion.div>
          </>
        )}

        <CardHeader className="bg-gradient-to-r from-purple-900/80 to-black/80 border-b-2 border-purple-400/50 p-8 relative">
          <div className="absolute top-2 right-2 text-3xl animate-bounce">🎯</div>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-2 border-cyan-400/50 px-6 py-3 text-lg font-black animate-pulse shadow-lg shadow-cyan-500/25">
                🔥 {question.category.toUpperCase()}
              </Badge>
              {question.image && (
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-2 border-pink-400/50 px-4 py-2 text-sm font-black animate-pulse shadow-lg shadow-pink-500/25">
                  <ImageIcon className="w-4 h-4 mr-2" />📸 IMAGE
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlag}
              className={`hover:bg-yellow-500/20 border-2 border-yellow-500/50 rounded-full p-4 transition-all transform hover:scale-125 ${
                isFlagged ? "text-yellow-400 bg-yellow-500/20 shadow-lg shadow-yellow-500/25" : "text-gray-400"
              }`}
            >
              <Flag className="w-6 h-6" />
            </Button>
          </div>
          <h3 className="text-3xl font-bold text-white leading-relaxed mb-6">{question.question}</h3>

          {/* Image Display */}
          {question.image && (
            <div className="mb-6 relative">
              <div className="relative rounded-xl overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/25 bg-white/10 backdrop-blur-sm">
                <Image
                  src={question.image || "/placeholder.svg"}
                  alt="Question image"
                  width={800}
                  height={400}
                  className="w-full h-auto object-contain"
                  style={{ maxHeight: "400px" }}
                />
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                  <span className="text-cyan-400 font-bold text-sm">📸 OFFICIAL TEST IMAGE</span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-8 space-y-4 bg-gradient-to-b from-black/80 to-purple-900/80">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={showAnswer}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-6 text-lg font-semibold border-2 rounded-xl transition-all duration-300 ${
                selectedOption === index
                  ? "border-cyan-400 bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-300 shadow-lg shadow-cyan-500/25"
                  : "border-purple-400/50 hover:border-pink-400/50 hover:bg-purple-800/30 text-gray-300 hover:text-white"
              } ${
                showAnswer && index === question.answerIndex
                  ? "border-green-400 bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 shadow-lg shadow-green-500/25"
                  : showAnswer && selectedOption === index && index !== question.answerIndex
                    ? "border-red-400 bg-gradient-to-r from-red-900/50 to-pink-900/50 text-red-300 shadow-lg shadow-red-500/25"
                    : ""
              }`}
            >
              <div className="flex items-center">
                <span className="mr-4 font-black text-2xl w-8 text-yellow-400">{String.fromCharCode(65 + index)}</span>
                <span className="flex-1">{option}</span>
                {showAnswer && index === question.answerIndex && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                    <span className="text-3xl animate-bounce">🎉</span>
                  </div>
                )}
              </div>
            </motion.button>
          ))}

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-8 p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border-2 border-blue-400/50 shadow-lg shadow-blue-500/25 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-3xl animate-bounce">💡</div>
              <div className="flex items-start gap-4">
                <Lightbulb className="w-8 h-8 text-yellow-400 mt-1 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-black text-yellow-400 mb-3 text-xl">🧠 EXPLANATION</h4>
                  <p className="text-blue-100 leading-relaxed text-lg font-medium">{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {!showAnswer && (
            <div className="text-center pt-6 border-t-2 border-purple-400/50">
              <p className="text-pink-300 text-lg font-bold animate-pulse">
                💡 Select an answer, then swipe <span className="text-green-400">RIGHT</span> if correct or{" "}
                <span className="text-red-400">LEFT</span> if wrong! 🚀
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
