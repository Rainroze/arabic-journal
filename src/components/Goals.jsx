import React, { useState, useEffect } from 'react';

const GoalTypes = {
  DAILY: 'يومي',
  MONTHLY: 'شهري',
  YEARLY: 'سنوي'
};

const Goals = ({ onClose, getTheme }) => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : {
      daily: [],
      monthly: [],
      yearly: []
    };
  });

  const [activeTab, setActiveTab] = useState('daily');
  const [newGoal, setNewGoal] = useState('');
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (!newGoal.trim()) return;

    setGoals(prev => ({
      ...prev,
      [activeTab]: [
        ...prev[activeTab],
        {
          id: Date.now(),
          text: newGoal,
          completed: false,
          createdAt: new Date().toISOString()
        }
      ]
    }));
    setNewGoal('');
  };

  const handleToggleGoal = (goalId) => {
    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(goal =>
        goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
      )
    }));
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].filter(goal => goal.id !== goalId)
    }));
  };

  const handleEditGoal = (goal) => {
    setEditingGoal(goal);
    setNewGoal(goal.text);
  };

  const handleUpdateGoal = () => {
    if (!newGoal.trim() || !editingGoal) return;

    setGoals(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(goal =>
        goal.id === editingGoal.id ? { ...goal, text: newGoal } : goal
      )
    }));
    setNewGoal('');
    setEditingGoal(null);
  };

  return (
    <div className="goals-container">
      <div className="goals-modal">
        <div className="goals-header">
          <h2 className="goals-title">أهدافي</h2>
          <button className="goals-close" onClick={onClose}>×</button>
        </div>

        <div className="goals-tabs">
          <button
            className={`tab-button ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            أهداف يومية
          </button>
          <button
            className={`tab-button ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
          >
            أهداف شهرية
          </button>
          <button
            className={`tab-button ${activeTab === 'yearly' ? 'active' : ''}`}
            onClick={() => setActiveTab('yearly')}
          >
            أهداف سنوية
          </button>
        </div>

        <div className="goals-content">
          <div className="goals-input-container">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder={`أضف هدفاً ${GoalTypes[activeTab.toUpperCase()]}اً جديداً`}
              className="goals-input"
              onKeyPress={(e) => e.key === 'Enter' && (editingGoal ? handleUpdateGoal() : handleAddGoal())}
              style={{
                backgroundColor: getTheme().cardBg,
                color: getTheme().text,
                border: `1px solid ${getTheme().borderColor}`
              }}
            />
            <button
              onClick={editingGoal ? handleUpdateGoal : handleAddGoal}
              className="goals-add-button"
              style={{
                backgroundColor: getTheme().buttonBg,
                color: getTheme().buttonText
              }}
            >
              {editingGoal ? 'تحديث' : 'إضافة'}
            </button>
          </div>

          <div className="goals-list">
            {goals[activeTab].map(goal => (
              <div
                key={goal.id}
                className={`goal-item ${goal.completed ? 'completed' : ''}`}
                style={{
                  backgroundColor: getTheme().cardBg,
                  borderColor: getTheme().borderColor
                }}
              >
                <div className="goal-content">
                  <input
                    type="checkbox"
                    checked={goal.completed}
                    onChange={() => handleToggleGoal(goal.id)}
                    className="goal-checkbox"
                  />
                  <span
                    className="goal-text"
                    style={{ color: getTheme().text }}
                  >
                    {goal.text}
                  </span>
                </div>
                <div className="goal-actions">
                  <button
                    onClick={() => handleEditGoal(goal)}
                    className="goal-edit-button"
                    style={{
                      backgroundColor: getTheme().buttonBg,
                      color: getTheme().buttonText
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="goal-delete-button"
                    style={{
                      backgroundColor: 'var(--danger)',
                      color: '#fff'
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
