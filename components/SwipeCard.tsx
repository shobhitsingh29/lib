
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
  onSwipe: (direction: "left" | "right") => void
  onFlag: () => void
  isFlagged: boolean
  showAnswer?: boolean
  onAnswerSelect?: (index: number) => void
}

export default function SwipeCard({ question, onSwipe, onFlag, isFlagged, showAnswer = false, onAnswerSelect }: SwipeCardProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragDirection, setDragDirection] = useState<"left" | "right" | null>(null)

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false)
    setDragDirection(null)

    const threshold = 50 // Lower threshold for better mobile experience
    const velocity = info.velocity.x
    const offset = info.offset.x

    // Allow swiping for navigation if an answer has been selected or answer is shown
    if ((selectedOption !== null || showAnswer) && (Math.abs(offset) > threshold || Math.abs(velocity) > 300)) {
      const direction = offset > 0 ? "right" : "left"
      onSwipe(direction)
    }
  }

  const handleDrag = (event: any, info: PanInfo) => {
    // Only show drag indicators if answer is selected or shown
    if (selectedOption !== null || showAnswer) {
      setIsDragging(true)
      const direction = info.offset.x > 0 ? "right" : "left"
      setDragDirection(direction)
    }
  }

  const handleOptionClick = (index: number) => {
    if (showAnswer) return
    setSelectedOption(index)
    if (onAnswerSelect) {
      onAnswerSelect(index)
    }
  }

  return (
    <motion.div
      className="relative w-full max-w-4xl mx-auto"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      dragMomentum={false}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.01 }}
      animate={{
        x: 0,
        rotate: 0,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      style={{ 
        touchAction: "pan-x",
        WebkitUserSelect: "none",
        userSelect: "none"
      }}
    >
      <Card
        className={`relative overflow-hidden border-4 bg-gradient-to-br from-black/90 to-purple-900/90 backdrop-blur-xl shadow-2xl ${
          isDragging && (selectedOption !== null || showAnswer)
            ? "cursor-grabbing border-cyan-400 shadow-cyan-500/50"
            : "cursor-grab border-purple-400/50 shadow-purple-500/25"
        } hover:border-pink-400/50 hover:shadow-pink-500/25 transition-all duration-300`}
      >
        {/* Swipe indicators - only show when answer is selected */}
        {isDragging && (selectedOption !== null || showAnswer) && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 flex items-center justify-center z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: dragDirection === "right" ? 1 : 0 }}
            >
              <div className="bg-blue-500 rounded-full p-6 shadow-xl">
                <span className="text-white text-2xl font-bold">→ Next</span>
              </div>
            </motion.div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center z-10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: dragDirection === "left" ? 1 : 0 }}
            >
              <div className="bg-purple-500 rounded-full p-6 shadow-xl">
                <span className="text-white text-2xl font-bold">← Previous</span>
              </div>
            </motion.div>
          </>
        )}

        <CardHeader className="bg-gradient-to-r from-purple-900/80 to-black/80 border-b border-purple-400/30 p-4 md:p-6 relative">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold">
                {question.category.toUpperCase()}
              </Badge>
              {question.image && (
                <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-1 md:px-3 md:py-1 text-xs font-semibold">
                  <ImageIcon className="w-3 h-3 mr-1" />IMAGE
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onFlag}
              className={`hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-2 transition-all touch-manipulation ${
                isFlagged ? "text-yellow-400 bg-yellow-500/20" : "text-gray-400"
              }`}
            >
              <Flag className="w-4 h-4" />
            </Button>
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-white leading-relaxed">{question.question}</h3>

          {/* Improved Image Display */}
          {question.image && (
            <div className="mb-4 md:mb-6 relative">
              <div className="relative rounded-lg overflow-hidden border border-gray-600 bg-white/10 backdrop-blur-sm">
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <Image
                    src={question.image}
                    alt="Question image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
                </div>
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                  <span className="text-cyan-400 font-bold text-xs">📸 Reference Image</span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 md:p-8 space-y-3 md:space-y-4 bg-gradient-to-b from-black/80 to-purple-900/80">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={showAnswer}
              whileHover={{ scale: 1.02, x: 5 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full text-left p-4 md:p-6 text-base md:text-lg font-semibold border-2 rounded-xl transition-all duration-300 touch-manipulation min-h-[60px] md:min-h-[auto] ${
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
                <span className="mr-3 md:mr-4 font-black text-xl md:text-2xl w-6 md:w-8 text-yellow-400 flex-shrink-0">{String.fromCharCode(65 + index)}</span>
                <span className="flex-1 leading-relaxed">{option}</span>
                {showAnswer && index === question.answerIndex && (
                  <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    <span className="text-2xl md:text-3xl animate-bounce">🎉</span>
                  </div>
                )}
                {showAnswer && selectedOption === index && index !== question.answerIndex && (
                  <XCircle className="w-5 h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0" />
                )}
              </div>
            </motion.button>
          ))}

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl border-2 border-blue-400/50 shadow-lg shadow-blue-500/25 relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 text-2xl md:text-3xl animate-bounce">💡</div>
              <div className="flex items-start gap-3 md:gap-4">
                <Lightbulb className="w-6 h-6 md:w-8 md:h-8 text-yellow-400 mt-1 flex-shrink-0 animate-pulse" />
                <div>
                  <h4 className="font-black text-yellow-400 mb-2 md:mb-3 text-lg md:text-xl">🧠 EXPLANATION</h4>
                  <p className="text-blue-100 leading-relaxed text-base md:text-lg font-medium">{question.explanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="text-center pt-4 border-t border-purple-400/30">
            <p className="text-gray-300 text-xs md:text-sm font-medium px-2">
              {selectedOption === null && !showAnswer ? (
                <>
                  <span className="animate-pulse">📝</span> Select an answer to continue
                </>
              ) : (
                <>
                  <span className="animate-bounce">👆</span> Swipe <span className="text-blue-400 font-bold">RIGHT</span> for next • <span className="text-purple-400 font-bold">LEFT</span> for previous
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
