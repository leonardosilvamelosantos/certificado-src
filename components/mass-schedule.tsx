"use client"

import { useState } from "react"
import { Church, X, Clock, Calendar } from "lucide-react"

export function MassSchedule() {
  const [isOpen, setIsOpen] = useState(false)

  const schedule = [
    { dates: "16, 17, 22, 23 e 24 de Maio", times: ["04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h"] }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? "bg-bordo rotate-90" : "bg-gold-dark hover:bg-gold hover:scale-110"
        } text-white`}
      >
        {isOpen ? <X size={28} /> : <Church size={28} />}
      </button>

      {/* Painel de Horários */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-72 bg-white/95 backdrop-blur-md border border-gold/30 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="bg-bordo p-4 text-white">
            <h3 className="font-serif text-lg flex items-center gap-2">
              <Church size={20} className="text-gold" />
              Horários de Missa
            </h3>
            <p className="text-xs text-white/80 mt-1">Festividade de Santa Rita 2026</p>
          </div>
          
          <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
            {schedule.map((item, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 text-bordo font-semibold text-sm">
                  <Calendar size={14} />
                  <span>Dias {item.dates}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {item.times.map((time) => (
                    <div 
                      key={time}
                      className="flex items-center justify-center gap-1 bg-amber-50 border border-gold/20 py-1.5 rounded-lg text-xs font-medium text-bordo-dark"
                    >
                      <Clock size={10} />
                      {time}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/50 border-t border-gold/10 text-center">
            <p className="text-[10px] text-muted-foreground italic">
              "Onde dois ou mais estiverem reunidos..."
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
