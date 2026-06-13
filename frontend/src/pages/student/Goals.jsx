import React, { useState, useEffect } from 'react';
import { Target, Edit2, Calendar, Clock, Check, Save, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Goals = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  
  const [goal, setGoal] = useState({
    title: userProfile?.onboardingData?.goal90Day || 'Score 95% in Final Board Exams',
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(goal.title);

  const [weeklyActions, setWeeklyActions] = useState([
    { id: 1, text: 'Complete Chapter 4 & 5 of Physics', completed: false },
    { id: 2, text: 'Take 2 Full-length Mock Tests', completed: true },
    { id: 3, text: 'Review all incorrect mock test answers', completed: false }
  ]);
  const [isAddingAction, setIsAddingAction] = useState(false);
  const [newActionText, setNewActionText] = useState('');

  const [habits, setHabits] = useState([
    { id: 1, name: 'Meditation (10 mins)', checked: false, streak: 12 },
    { id: 2, name: 'Read Notes before sleep', checked: true, streak: 5 },
    { id: 3, name: 'Drink 3L Water', checked: false, streak: 21 }
  ]);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newHabitText, setNewHabitText] = useState('');

  useEffect(() => {
    if (userProfile?.uid) { /* fetch from Firestore */ }
  }, [userProfile]);

  const toggleAction = (id) => setWeeklyActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  const toggleHabit = (id) => setHabits(prev => prev.map(h => h.id === id ? { ...h, checked: !h.checked, streak: h.checked ? Math.max(0, h.streak - 1) : h.streak + 1 } : h));
  
  const saveGoal = () => {
    setGoal(prev => ({ ...prev, title: tempTitle }));
    setIsEditing(false);
  };

  const addAction = () => {
    if (newActionText.trim()) {
      setWeeklyActions(prev => [...prev, { id: Date.now(), text: newActionText.trim(), completed: false }]);
      setNewActionText('');
      setIsAddingAction(false);
    }
  };

  const addHabit = () => {
    if (newHabitText.trim()) {
      setHabits(prev => [...prev, { id: Date.now(), name: newHabitText.trim(), checked: false, streak: 0 }]);
      setNewHabitText('');
      setIsAddingHabit(false);
    }
  };

  const daysRemaining = Math.max(0, Math.ceil((goal.targetDate - new Date()) / (1000 * 60 * 60 * 24)));
  
  // Calculate dynamic progress
  const totalItems = weeklyActions.length + habits.length;
  const completedItems = weeklyActions.filter(a => a.completed).length + habits.filter(h => h.checked).length;
  const progressPercent = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  const cardStyle = { background: '#0a0a0a', border: '1px solid #1f2937' };

  if (!goal.title && !isEditing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 mt-12">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6"
          style={{ background: 'rgba(242,101,34,0.1)', border: '1px solid rgba(242,101,34,0.2)' }}>
          <Target className="w-10 h-10" style={{ color: '#f26522' }} />
        </div>
        <h3 className="text-[22px] font-poppins font-bold text-center text-white">No 90-Day Goal Set Yet</h3>
        <p className="text-[14px] font-inter text-center mt-2 max-w-sm" style={{ color: '#9ca3af' }}>
          Let's get crystal clear on where you're going. Sajan will help you set a powerful goal.
        </p>
        <button className="mt-8 px-8 py-3 rounded-xl font-inter font-bold text-white animated-gradient transition-all hover:opacity-90 hover:-translate-y-0.5"
          style={{ boxShadow: 'var(--shadow-orange)' }}
          onClick={() => setIsEditing(true)}>
          Set My Goal Manually
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto w-full px-4 lg:px-6 py-6 lg:py-8">

      {/* Main Goal Card */}
      <div className="rounded-[20px] p-6 mb-6 relative overflow-hidden" style={cardStyle}>
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at top right, rgba(242,101,34,0.15) 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-inter font-bold uppercase tracking-widest px-3 py-1 rounded-full"
              style={{ color: '#f26522', background: 'rgba(242,101,34,0.12)', border: '1px solid rgba(242,101,34,0.2)' }}>
              My 90-Day Goal
            </span>
            {!isEditing && (
              <button className="transition-colors p-2 rounded-lg hover:bg-white/5" style={{ color: '#6b7280' }}
                onClick={() => setIsEditing(true)}
                onMouseEnter={e => e.currentTarget.style.color = '#f26522'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {isEditing ? (
            <div className="flex items-center gap-3">
              <input 
                type="text" 
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
                className="w-full bg-[#050505] border border-[#1f2937] text-white px-4 py-2 rounded-xl focus:outline-none focus:border-[#f26522]"
                autoFocus
              />
              <button onClick={saveGoal} className="bg-[#f26522] text-white p-2.5 rounded-xl hover:bg-[#d4541a] transition-colors shrink-0">
                <Save className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <h2 className="text-[22px] font-poppins font-bold text-white leading-snug">{goal.title}</h2>
          )}

          <div className="mt-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[13px] font-inter font-medium" style={{ color: '#9ca3af' }}>Overall Progress</span>
              <span className="text-[14px] font-inter font-bold" style={{ color: '#f26522' }}>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: '#1f2937' }}>
              <div className="h-full rounded-full animated-gradient transition-all duration-1000"
                style={{ width: `${Math.max(2, progressPercent)}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-5 text-[13px] font-inter font-medium">
            <div className="flex items-center gap-1.5" style={{ color: '#9ca3af' }}>
              <Calendar className="w-4 h-4" />
              Target: {goal.targetDate.toLocaleDateString()}
            </div>
            <div className={`flex items-center gap-1.5`}
              style={{ color: daysRemaining < 14 ? '#F59E0B' : '#9ca3af' }}>
              <Clock className="w-4 h-4" />
              {daysRemaining} days remaining
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Actions */}
        <div className="rounded-[16px] p-5 flex flex-col" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[16px] font-poppins font-semibold text-white">This Week's Actions</h3>
            <button onClick={() => setIsAddingAction(true)}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ background: 'rgba(242,101,34,0.1)', color: '#f26522' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,101,34,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(242,101,34,0.1)'}>
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="flex flex-col">
              {weeklyActions.map((action, idx) => (
                <div key={action.id}
                  className="flex items-start gap-3 py-3 cursor-pointer group"
                  style={{ borderBottom: idx !== weeklyActions.length - 1 ? '1px solid #1f2937' : 'none' }}
                  onClick={() => toggleAction(action.id)}>
                  <div className="w-5 h-5 rounded-[6px] mt-0.5 flex items-center justify-center shrink-0 transition-colors"
                    style={{ border: action.completed ? 'none' : '1.5px solid #374151', background: action.completed ? '#f26522' : 'transparent' }}>
                    {action.completed && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <span className="text-[14px] font-inter pt-0.5 transition-colors group-hover:text-white"
                    style={{ color: action.completed ? '#6b7280' : '#e5e7eb', textDecoration: action.completed ? 'line-through' : 'none' }}>
                    {action.text}
                  </span>
                </div>
              ))}
              {weeklyActions.length === 0 && !isAddingAction && (
                <p className="text-[13px] font-inter text-center py-6" style={{ color: '#6b7280' }}>
                  No actions set yet. Add a new action for this week!
                </p>
              )}
            </div>
            
            {isAddingAction && (
              <div className="mt-3 flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="e.g., Read Chapter 1"
                  value={newActionText}
                  onChange={(e) => setNewActionText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addAction()}
                  className="flex-1 bg-[#050505] border border-[#1f2937] text-white px-3 py-2 rounded-lg text-[13px] focus:outline-none focus:border-[#f26522]"
                  autoFocus
                />
                <button onClick={addAction} className="bg-[#f26522] text-white p-2 rounded-lg hover:bg-[#d4541a]">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => setIsAddingAction(false)} className="bg-[#1f2937] text-white p-2 rounded-lg hover:bg-[#374151]">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Daily Habits */}
          <div className="rounded-[16px] p-5 flex flex-col" style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-poppins font-semibold text-white">Daily Habits</h3>
              <button onClick={() => setIsAddingHabit(true)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: 'rgba(242,101,34,0.1)', color: '#f26522' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(242,101,34,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(242,101,34,0.1)'}>
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col gap-1">
                {habits.map((habit) => (
                  <div key={habit.id} onClick={() => toggleHabit(habit.id)}
                    className="flex items-center justify-between py-2 px-2 rounded-lg cursor-pointer transition-colors"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors"
                        style={{ border: habit.checked ? 'none' : '1.5px solid #374151', background: habit.checked ? '#10B981' : 'transparent' }}>
                        {habit.checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                      </div>
                      <span className="text-[14px] font-inter transition-colors"
                        style={{ color: habit.checked ? '#6b7280' : '#e5e7eb', textDecoration: habit.checked ? 'line-through' : 'none' }}>
                        {habit.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-poppins font-bold text-white px-2 py-0.5 rounded-full"
                      style={{ background: habit.checked ? 'linear-gradient(135deg,#10B981,#059669)' : 'linear-gradient(135deg,#f26522,#d4541a)' }}>
                      {habit.streak}d
                    </span>
                  </div>
                ))}
                {habits.length === 0 && !isAddingHabit && (
                  <p className="text-[13px] font-inter text-center py-4" style={{ color: '#6b7280' }}>No habits tracked yet.</p>
                )}
              </div>
              
              {isAddingHabit && (
                <div className="mt-3 flex items-center gap-2 px-2">
                  <input 
                    type="text" 
                    placeholder="e.g., Drink Water"
                    value={newHabitText}
                    onChange={(e) => setNewHabitText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addHabit()}
                    className="flex-1 bg-[#050505] border border-[#1f2937] text-white px-3 py-2 rounded-lg text-[13px] focus:outline-none focus:border-[#f26522]"
                    autoFocus
                  />
                  <button onClick={addHabit} className="bg-[#f26522] text-white p-2 rounded-lg hover:bg-[#d4541a]">
                    <Check className="w-4 h-4" />
                  </button>
                  <button onClick={() => setIsAddingHabit(false)} className="bg-[#1f2937] text-white p-2 rounded-lg hover:bg-[#374151]">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Check-in Card */}
          <div className="rounded-[16px] p-5" style={{ background: 'rgba(242,101,34,0.06)', border: '1px solid rgba(242,101,34,0.2)' }}>
            <h3 className="text-[16px] font-poppins font-semibold" style={{ color: '#f26522' }}>
              How's your progress this week, {userProfile?.name?.split(' ')[0] || 'champ'}? 👋
            </h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {['Going great! 🔥', 'Struggling a bit 😔', 'Need help 🆘', 'I crushed it! 🎯'].map(btn => (
                <button key={btn} onClick={() => navigate('/student/chat', { state: { initialMessage: btn, isGoalCheckin: true } })}
                  className="text-[13px] font-inter font-medium px-4 py-2 rounded-full transition-all"
                  style={{ border: '1px solid rgba(242,101,34,0.3)', color: '#f26522', background: 'transparent' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#f26522'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#f26522'; }}>
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
