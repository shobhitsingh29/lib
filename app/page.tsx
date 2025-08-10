"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { getTranslation } from "@/lib/i18n"
import LanguageSelector from "@/components/LanguageSelector"

export default function HomePage() {
  const { language } = useStore()
  const t = getTranslation(language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      {/* Modern background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "6s", animationDuration: "12s" }}
        ></div>

        {/* Static emojis that only animate on hover */}
        <div className="absolute top-20 left-20 text-3xl hover:animate-spin transition-transform cursor-pointer">
          🚀
        </div>
        <div className="absolute top-40 right-32 text-2xl hover:scale-125 transition-transform cursor-pointer">⚡</div>
        <div className="absolute bottom-32 left-32 text-4xl hover:animate-pulse transition-transform cursor-pointer">
          🔥
        </div>
        <div className="absolute bottom-20 right-20 text-2xl hover:scale-110 transition-transform cursor-pointer">
          🎯
        </div>
      </div>

      <div className="relative z-10">
        {/* Language Selector */}
        <div className="absolute top-6 right-6">
          <LanguageSelector />
        </div>

        {/* Hero Section */}
        <div className="min-h-screen flex items-center justify-center px-4 relative">
          <div className="text-center max-w-6xl mx-auto">
            {/* Floating badge */}
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full text-lg font-black mb-12 shadow-2xl hover:scale-105 transition-transform relative overflow-hidden">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>🇩🇪 {t.officialPrep} 🇩🇪</span>
            </div>

            {/* Main title with smooth effects */}
            <div className="mb-12 relative">
              <h1 className="text-8xl md:text-9xl font-black mb-4 leading-none relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-yellow-300 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                  LEBEN
                </span>
              </h1>

              <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  IN DEUTSCHLAND
                </span>
              </h1>

              {/* Subtitle */}
              <div className="text-2xl md:text-4xl font-bold text-white mb-8 leading-relaxed">
                <span className="hover:scale-110 transition-transform inline-block cursor-pointer">🚀</span>
                <span className="mx-2">{t.heroSubtitle}</span>
                <span className="hover:scale-110 transition-transform inline-block cursor-pointer ml-2">🎯</span>
              </div>
            </div>

            {/* Stats with hover effects */}
            <div className="flex justify-center gap-8 mb-16">
              <div className="text-center group cursor-pointer">
                <div className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-300">🔥</div>
                <div className="text-4xl font-black text-yellow-400 mb-1 group-hover:scale-110 transition-transform">
                  50+
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">{t.totalQuestions}</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-300">⚡</div>
                <div className="text-4xl font-black text-green-400 mb-1 group-hover:scale-110 transition-transform">
                  33
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">TEST LENGTH</div>
              </div>
              <div className="text-center group cursor-pointer">
                <div className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-300">⏰</div>
                <div className="text-4xl font-black text-pink-400 mb-1 group-hover:scale-110 transition-transform">
                  60
                </div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">MINUTES</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link href="/practice">
                <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black px-12 py-6 text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0 relative overflow-hidden group">
                  <span className="relative z-10">
                    🎮 {t.start.toUpperCase()} {t.practice.toUpperCase()}
                  </span>
                </Button>
              </Link>
              <Link href="/test">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-6 text-2xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0 relative overflow-hidden group">
                  <span className="relative z-10">🏆 {t.test.toUpperCase()}</span>
                </Button>
              </Link>
            </div>

            {/* Scroll indicator */}
            <div className="hover:scale-110 transition-transform cursor-pointer">
              <div className="text-4xl">👇</div>
              <div className="text-lg text-gray-400 mt-2">SCROLL FOR MORE</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 relative">
              <h2 className="text-6xl font-black mb-6 relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  {t.chooseWeapon}
                </span>
              </h2>
              <p className="text-2xl text-gray-300">Four epic ways to dominate the citizenship test 💪</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Practice Card */}
              <Link href="/practice" className="group">
                <Card className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-2 border-cyan-500/50 hover:border-cyan-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-cyan-500/50">
                  <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12 translate-x-4 -translate-y-4">
                    📚
                  </div>
                  <CardContent className="p-8 relative">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">🎯</div>
                    <h3 className="text-3xl font-black text-cyan-400 mb-4">{t.practice.toUpperCase()}</h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors">
                      {t.swipeLearn}: 50+ questions with instant feedback 🔥
                    </p>
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform">
                      {t.start.toUpperCase()}! 🚀
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Test Card */}
              <Link href="/test" className="group">
                <Card className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border-2 border-orange-500/50 hover:border-orange-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-orange-500/50">
                  <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12 translate-x-4 -translate-y-4">
                    ⏱️
                  </div>
                  <CardContent className="p-8 relative">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">⚡</div>
                    <h3 className="text-3xl font-black text-orange-400 mb-4">{t.testMode.toUpperCase()}</h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors">
                      {t.testSubtitle}! 33 questions, 60 minutes. Can you handle it? 😤
                    </p>
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform">
                      {t.start.toUpperCase()}! 💪
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Review Card */}
              <Link href="/review" className="group">
                <Card className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border-2 border-yellow-500/50 hover:border-yellow-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-yellow-500/50">
                  <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12 translate-x-4 -translate-y-4">
                    🏃
                  </div>
                  <CardContent className="p-8 relative">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">🧠</div>
                    <h3 className="text-3xl font-black text-yellow-400 mb-4">{t.review.toUpperCase()}</h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors">
                      Study your mistakes, track progress, become unstoppable! 📈
                    </p>
                    <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black px-6 py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform">
                      LEVEL UP! ⬆️
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Settings Card */}
              <Link href="/settings" className="group">
                <Card className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-500/50 hover:border-purple-400 transition-all duration-500 group-hover:scale-105 backdrop-blur-sm overflow-hidden relative transform hover:shadow-2xl hover:shadow-purple-500/50">
                  <div className="absolute top-0 right-0 text-6xl opacity-20 transform rotate-12 translate-x-4 -translate-y-4">
                    ⚙️
                  </div>
                  <CardContent className="p-8 relative">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform">🎮</div>
                    <h3 className="text-3xl font-black text-purple-400 mb-4">{t.settings.toUpperCase()}</h3>
                    <p className="text-gray-300 text-lg mb-6 leading-relaxed group-hover:text-white transition-colors">
                      Customize everything! Dark mode, language, stats, and more! ✨
                    </p>
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-center group-hover:scale-105 transition-transform">
                      CUSTOMIZE! 🎨
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="py-24 px-4 bg-gradient-to-r from-purple-900 via-pink-900 to-red-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative max-w-6xl mx-auto text-center">
            <div className="text-8xl mb-8 hover:scale-125 transition-transform cursor-pointer">🇩🇪</div>

            <div className="relative mb-8">
              <h2 className="text-6xl md:text-8xl font-black mb-4 leading-tight relative hover:scale-105 transition-transform duration-500">
                <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-red-500 bg-clip-text text-transparent">
                  READY TO BECOME
                </span>
              </h2>

              <span className="text-6xl md:text-8xl font-black bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 inline-block">
                A GERMAN CITIZEN?
              </span>
            </div>

            <p className="text-3xl text-white mb-12 font-bold leading-relaxed max-w-4xl mx-auto">
              🎮 Join 25,000+ students who are CRUSHING the citizenship test with our addictive swipe-based learning!
              <br />
              <span className="text-yellow-300">No boring textbooks. No endless lectures. Just pure FUN! 🔥</span>
            </p>

            <Link href="/practice">
              <Button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black px-16 py-8 text-3xl font-black rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 border-0 relative overflow-hidden group">
                <span className="relative z-10">🚀 {t.start.toUpperCase()} NOW - IT'S FREE! 🚀</span>
              </Button>
            </Link>

            <div className="mt-8 text-xl text-gray-300">⏰ Join now and get instant access to 50+ questions!</div>
          </div>
        </div>
      </div>
    </div>
  )
}
