import { Play, Info } from 'lucide-react'

interface HeroProps {
  onPlayFirst: () => void
}

export function Hero({ onPlayFirst }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-netflix-red/10 rounded-full blur-3xl animate-pulse-custom"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-red-600/10 rounded-full blur-3xl animate-pulse-custom animation-delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-slideIn">
          <span className="gradient-text">VideoSource</span>
        </h1>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white animate-fadeIn animation-delay-300">
          Stream Unlimited
        </h2>
        
        <h3 className="text-2xl md:text-4xl font-light mb-8 text-netflix-light-gray animate-fadeIn animation-delay-500">
          Movies & TV Shows
        </h3>
        
        <p className="text-xl md:text-2xl text-netflix-light-gray mb-12 max-w-3xl mx-auto animate-fadeIn animation-delay-700">
          Discover and watch your favorite content with our modern streaming platform powered by Vidsrc integration
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fadeIn animation-delay-1000">
          <button 
            onClick={onPlayFirst}
            className="bg-netflix-red hover:bg-red-600 text-white px-12 py-4 rounded-xl flex items-center space-x-3 text-xl font-semibold transition-all duration-300 btn-primary shadow-glow-lg"
          >
            <Play className="w-7 h-7 fill-current" />
            <span>Start Watching</span>
          </button>
          
          <button className="glass text-white px-12 py-4 rounded-xl flex items-center space-x-3 text-xl font-semibold hover:bg-white/20 transition-all duration-300">
            <Info className="w-6 h-6" />
            <span>More Info</span>
          </button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
