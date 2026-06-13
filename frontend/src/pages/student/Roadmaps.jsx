import React, { useState } from 'react';
import { Route as RouteIcon, Map, Target, Lock, CheckCircle2, PlayCircle, Unlock, ChevronDown, ChevronUp } from 'lucide-react';

const Roadmaps = () => {
  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  // Initial mock data simulating a backend fetch
  const initialActiveRoadmap = {
    id: 'r1',
    title: '90-Day Exam Mastery',
    description: 'A structured plan to boost focus, improve retention, and tackle your board exams with confidence.',
    modules: [
      {
        id: 'm1',
        title: 'Module 1: The Foundation of Focus',
        lessons: [
          { id: 'l1_1', title: 'Understanding your attention span', completed: true },
          { id: 'l1_2', title: 'Eliminating digital distractions', completed: true },
        ]
      },
      {
        id: 'm2',
        title: 'Module 2: Advanced Study Techniques',
        lessons: [
          { id: 'l2_1', title: 'Mastering the Pomodoro Technique', completed: true },
          { id: 'l2_2', title: 'Active Recall vs Passive Reading', completed: false },
          { id: 'l2_3', title: 'Spaced Repetition Systems', completed: false },
        ]
      },
      {
        id: 'm3',
        title: 'Module 3: The Memory Palace',
        lessons: [
          { id: 'l3_1', title: 'Introduction to Spatial Memory', completed: false },
          { id: 'l3_2', title: 'Building your first Palace', completed: false },
        ]
      },
      {
        id: 'm4',
        title: 'Module 4: Exam Execution',
        lessons: [
          { id: 'l4_1', title: 'Time Management in the Hall', completed: false },
          { id: 'l4_2', title: 'Managing Exam Anxiety', completed: false },
        ]
      }
    ]
  };

  const [activeRoadmap, setActiveRoadmap] = useState(initialActiveRoadmap);
  const [expandedModule, setExpandedModule] = useState(null);
  const [availableRoadmaps, setAvailableRoadmaps] = useState([
    { id: 'r2', title: 'Public Speaking Foundation', desc: "Learn the core techniques Sajan uses on stage.", locked: true },
    { id: 'r3', title: 'Financial Literacy for Teens', desc: "Understand money, saving, and basic investing.", locked: true },
  ]);

  // Calculate dynamic progress
  const allLessons = activeRoadmap.modules.flatMap(m => m.lessons);
  const completedLessons = allLessons.filter(l => l.completed).length;
  const progressPercent = allLessons.length === 0 ? 0 : Math.round((completedLessons / allLessons.length) * 100);

  // Find the next milestone (first incomplete lesson)
  let nextMilestone = null;
  for (const mod of activeRoadmap.modules) {
    const nextLesson = mod.lessons.find(l => !l.completed);
    if (nextLesson) {
      nextMilestone = { moduleTitle: mod.title, lessonTitle: nextLesson.title };
      break;
    }
  }

  const toggleLesson = (moduleId, lessonId) => {
    setActiveRoadmap(prev => {
      const newModules = prev.modules.map(mod => {
        if (mod.id !== moduleId) return mod;
        return {
          ...mod,
          lessons: mod.lessons.map(lesson => 
            lesson.id === lessonId ? { ...lesson, completed: !lesson.completed } : lesson
          )
        };
      });
      return { ...prev, modules: newModules };
    });
  };

  const unlockRoadmap = (id) => {
    setAvailableRoadmaps(prev => prev.map(rm => rm.id === id ? { ...rm, locked: false } : rm));
  };

  const enterTerritory = (roadmap) => {
    // Generate dummy modules for the new roadmap
    const newRoadmap = {
      id: roadmap.id,
      title: roadmap.title,
      description: roadmap.desc,
      modules: [
        {
          id: 'm1',
          title: 'Module 1: The Basics',
          lessons: [
            { id: 'l1_1', title: 'Introduction & Setup', completed: false },
            { id: 'l1_2', title: 'Core Principles', completed: false }
          ]
        },
        {
          id: 'm2',
          title: 'Module 2: Advanced Techniques',
          lessons: [
            { id: 'l2_1', title: 'Deep Dive', completed: false },
            { id: 'l2_2', title: 'Practical Application', completed: false }
          ]
        }
      ]
    };
    // Swap the current one back into available and set the new one as active
    setAvailableRoadmaps(prev => [
      ...prev.filter(rm => rm.id !== roadmap.id),
      { id: activeRoadmap.id, title: activeRoadmap.title, desc: activeRoadmap.description, locked: false }
    ]);
    setActiveRoadmap(newRoadmap);
    setExpandedModule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1000px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FF6B35]/10 mb-4 border border-[#FF6B35]/20 shadow-[0_0_15px_rgba(255,107,53,0.2)]">
          <Map className="w-8 h-8 text-[#FF6B35]" />
        </div>
        <h2 className="text-[32px] font-poppins font-bold text-white tracking-tight">
          My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#f9a826]">Roadmaps</span>
        </h2>
        <p className="text-[15px] font-inter mt-2 text-[#9ca3af] max-w-xl mx-auto">
          Navigate your personal growth journey. Follow the glowing path to unlock new skills and achievements.
        </p>
      </div>

      {/* Active Roadmap Hero Card */}
      <div className="rounded-[24px] p-6 lg:p-8 mb-12 relative overflow-hidden bg-black/40 border border-[#2D2D44] backdrop-blur-md shadow-2xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle at top right, #FF6B35, transparent 60%)' }} />
        
        <div className="flex flex-col md:flex-row gap-8 relative z-10 items-center">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[11px] font-inter font-bold uppercase tracking-widest px-3 py-1 rounded-full text-[#FF6B35] bg-[#FF6B35]/10 border border-[#FF6B35]/20">
                Current Quest
              </span>
            </div>
            <h3 className="text-[28px] font-poppins font-bold text-white mt-1 leading-tight">{activeRoadmap.title}</h3>
            <p className="text-[15px] font-inter mt-3 mb-6 text-[#9ca3af] max-w-md">
              {activeRoadmap.description}
            </p>
            <div className="mb-2">
              <div className="flex justify-between items-end mb-2">
                <span className="text-[13px] font-inter font-medium text-[#9ca3af]">Quest Progress</span>
                <span className="text-[16px] font-poppins font-bold text-[#FF6B35]">{progressPercent}%</span>
              </div>
              <div className="w-full max-w-md h-3 rounded-full overflow-hidden bg-[#1f2937] shadow-inner">
                <div className="h-full rounded-full transition-all duration-1000 ease-out relative" 
                     style={{ width: `${Math.max(2, progressPercent)}%`, background: 'linear-gradient(90deg, #E55A28, #FF6B35)' }}>
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 blur-[2px]"></div>
                </div>
              </div>
            </div>
            
            {progressPercent === 100 && (
              <div className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-poppins font-bold text-white bg-gradient-to-r from-[#10B981] to-[#059669] shadow-[0_4px_14px_rgba(16,185,129,0.3)] animate-pulse">
                <CheckCircle2 className="w-5 h-5" /> Quest Complete!
              </div>
            )}
          </div>

          {nextMilestone && progressPercent < 100 && (
            <div className="w-full md:w-[280px] rounded-2xl p-6 flex-shrink-0 flex flex-col justify-center relative overflow-hidden group bg-white/5 border border-white/10 hover:border-[#FF6B35]/50 transition-colors duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF6B35] to-transparent"></div>
              <h4 className="text-[12px] font-poppins font-bold text-[#9ca3af] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#FF6B35]" /> Next Objective
              </h4>
              <p className="text-[16px] font-poppins font-semibold text-white leading-snug mb-2 group-hover:text-[#FF6B35] transition-colors">
                {nextMilestone.lessonTitle}
              </p>
              <p className="text-[13px] font-inter text-[#6b7280]">
                {nextMilestone.moduleTitle.split(':')[0]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Visual Timeline Map */}
      <div className="mb-20">
        <h3 className="text-[22px] font-poppins font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
          <RouteIcon className="w-6 h-6 text-[#FF6B35]" /> The Path Ahead
        </h3>
        
        <div className="relative max-w-4xl mx-auto px-4 md:px-0">
          {/* Main vertical line for desktop (centered) and mobile (left) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 md:-ml-[2px] bg-[#1f2937] rounded-full z-0"></div>
          
          {/* Glowing progress line */}
          <div className="absolute left-8 md:left-1/2 top-0 md:-ml-[2px] w-1 bg-[#FF6B35] rounded-full z-0 transition-all duration-1000 shadow-[0_0_10px_rgba(255,107,53,0.8)]"
               style={{ height: `${progressPercent}%` }}></div>

          <div className="flex flex-col gap-12 md:gap-0 relative z-10">
            {activeRoadmap.modules.map((mod, index) => {
              const isEven = index % 2 === 0;
              const moduleLessons = mod.lessons.length;
              const completedInModule = mod.lessons.filter(l => l.completed).length;
              const isModuleComplete = completedInModule === moduleLessons;
              const isModuleStarted = completedInModule > 0;
              const isExpanded = expandedModule === mod.id;

              // Node status colors
              let nodeColor = '#1f2937'; // Locked/Not started
              let borderColor = '#374151';
              let iconColor = '#6b7280';
              if (isModuleComplete) {
                nodeColor = '#10B981'; // Completed (Green)
                borderColor = '#059669';
                iconColor = '#ffffff';
              } else if (isModuleStarted || (index === 0 && !isModuleStarted)) {
                nodeColor = '#FF6B35'; // Active (Orange)
                borderColor = '#E55A28';
                iconColor = '#ffffff';
              }

              return (
                <div key={mod.id} className={`flex flex-col md:flex-row items-start md:items-center w-full ${isEven ? 'md:flex-row-reverse' : ''} group`}>
                  
                  {/* Space filler for the opposite side on desktop */}
                  <div className="hidden md:block md:w-1/2"></div>
                  
                  {/* The Node on the timeline */}
                  <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full border-4 border-[var(--color-bg)] shadow-[0_0_0_2px_rgba(0,0,0,0.5)] transform -translate-x-1/2 z-20 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                       style={{ background: nodeColor, borderColor: '#111' }}>
                    {isModuleComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span className="text-[14px] font-bold text-white">{index + 1}</span>
                    )}
                  </div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-14 md:text-right' : 'md:pl-14'}`}>
                    <div 
                      className={`rounded-2xl p-5 transition-all duration-300 cursor-pointer backdrop-blur-sm relative overflow-hidden`}
                      style={{ 
                        background: isModuleComplete ? 'rgba(16,185,129,0.05)' : isModuleStarted ? 'rgba(255,107,53,0.05)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${isModuleComplete ? 'rgba(16,185,129,0.3)' : isModuleStarted ? 'rgba(255,107,53,0.3)' : 'rgba(255,255,255,0.05)'}`,
                        boxShadow: isModuleStarted && !isModuleComplete ? '0 0 20px rgba(255,107,53,0.05)' : 'none'
                      }}
                    >
                      {/* Interactive click area to expand/collapse */}
                      <div onClick={() => setExpandedModule(isExpanded ? null : mod.id)} className="flex flex-col gap-2">
                        <div className={`text-[12px] font-poppins font-bold tracking-wider uppercase flex items-center gap-2 ${isEven ? 'md:justify-end' : ''}`}
                             style={{ color: isModuleComplete ? '#10B981' : isModuleStarted ? '#FF6B35' : '#6b7280' }}>
                          Phase {index + 1}
                          <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px]">
                            {completedInModule}/{moduleLessons} Completed
                          </div>
                        </div>
                        <h4 className="text-[18px] font-poppins font-bold text-white">{mod.title.split(': ')[1] || mod.title}</h4>
                        
                        <div className={`flex items-center gap-1 text-[#9ca3af] text-[12px] mt-1 ${isEven ? 'md:justify-end' : ''}`}>
                          {isExpanded ? 'Hide Quests' : 'View Quests'} {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </div>
                      </div>

                      {/* Expanded Lessons */}
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
                          {mod.lessons.map((lesson) => (
                            <div key={lesson.id} 
                                 onClick={() => toggleLesson(mod.id, lesson.id)}
                                 className="flex items-center justify-between p-3 rounded-xl cursor-pointer group/lesson transition-all hover:bg-white/5"
                                 style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div className="flex items-center gap-3 text-left w-full">
                                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
                                     style={{ 
                                       border: lesson.completed ? 'none' : '1.5px solid #4b5563', 
                                       background: lesson.completed ? (isModuleComplete ? '#10B981' : '#FF6B35') : 'transparent' 
                                     }}>
                                  {lesson.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <span className={`text-[14px] font-inter transition-colors ${lesson.completed ? 'text-[#6b7280] line-through' : 'text-[#e5e7eb] group-hover/lesson:text-white'}`}>
                                  {lesson.title}
                                </span>
                              </div>
                              {!lesson.completed && (
                                <PlayCircle className="w-4 h-4 text-[#FF6B35] opacity-0 group-hover/lesson:opacity-100 transition-opacity shrink-0" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Available Paths / Locked Regions */}
      <div>
        <h3 className="text-[22px] font-poppins font-bold text-white mb-6 flex items-center gap-3">
          <Lock className="w-6 h-6 text-[#9ca3af]" /> Undiscovered Territories
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableRoadmaps.map((rm) => (
            <div key={rm.id} className="rounded-[20px] p-6 relative overflow-hidden group border border-[#2D2D44] bg-[#0a0a0a] transition-all duration-300 hover:border-[#4b5563]">
              {/* Topographic map background hint */}
              <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwVjB6bTIwIDIwYzAtNS41MjMgNC40NzctMTAgMTAtMTBWMGMtMTEuMDQ2IDAtMjAgOC45NTQtMjAgMjBTMCA0MCAxMS4wNDYgNDAgMjAgMjkuMDU0IDIwIDIwek0wIDIwQzAgOC45NTQgOC45NTQgMCAyMCAwdi0yMGMtMTEuMDQ2IDAtMjAgOC45NTQtMjAgMjBTMC0yMCAxMS4wNDYtMjAgMjAtMjBaIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuNSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')]"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[#1f2937] border border-[#374151]">
                    {rm.locked ? <Map className="w-6 h-6 text-[#6b7280]" /> : <Map className="w-6 h-6 text-[#FF6B35]" />}
                  </div>
                  <div className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/50 border border-[#374151] text-[#6b7280]">
                    Locked Area
                  </div>
                </div>
                
                <h4 className="text-[18px] font-poppins font-bold text-white mb-2">{rm.title}</h4>
                <p className="text-[14px] font-inter text-[#9ca3af] mb-6 min-h-[44px]">{rm.desc}</p>
                
                {rm.locked ? (
                  <button onClick={() => unlockRoadmap(rm.id)}
                          className="w-full py-3 rounded-xl font-poppins font-semibold text-[14px] flex items-center justify-center gap-2 bg-[#1f2937] text-white hover:bg-[#374151] hover:text-[#FF6B35] transition-colors border border-[#374151]">
                    <Unlock className="w-4 h-4" /> Unlock Territory
                  </button>
                ) : (
                  <button onClick={() => enterTerritory(rm)}
                          className="w-full py-3 rounded-xl font-poppins font-bold text-[14px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#E55A28] text-white shadow-[0_4px_14px_rgba(255,107,53,0.3)] hover:scale-[1.02] transition-transform">
                    Enter Territory
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
