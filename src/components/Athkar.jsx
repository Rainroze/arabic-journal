import React, { useState, useEffect } from 'react';

const morningAthkar = [
  { text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', count: 1 },
  { text: 'اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ', count: 1 },
  { text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100 },
  { text: 'لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ', count: 100 },
  { text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3 },
];

const eveningAthkar = [
  { text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ', count: 1 },
  { text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ', count: 1 },
  { text: 'أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ', count: 100 },
  { text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', count: 3 },
  { text: 'حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7 },
];

const AthkarCounter = ({ thikr, onComplete }) => {
  const [count, setCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleClick = () => {
    if (count < thikr.count) {
      setCount(count + 1);
      if (count + 1 === thikr.count) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }
  };

  return (
    <div className={`athkar-item ${isCompleted ? 'completed' : ''}`}>
      <div className="athkar-text">{thikr.text}</div>
      <div className="athkar-counter">
        <button 
          onClick={handleClick}
          disabled={isCompleted}
          className={`counter-button ${isCompleted ? 'completed' : ''}`}
        >
          {count}/{thikr.count}
        </button>
      </div>
    </div>
  );
};

const Athkar = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('morning');
  const [progress, setProgress] = useState({ morning: 0, evening: 0 });

  const handleThikrComplete = (type) => {
    setProgress(prev => ({
      ...prev,
      [type]: prev[type] + 1
    }));
  };

  return (
    <div className="athkar-container">
      <div className="athkar-modal">
        <div className="athkar-header">
          <h2 className="athkar-title">الأذكار</h2>
          <button className="athkar-close" onClick={onClose}>×</button>
        </div>
        <div className="athkar-tabs">
          <button 
            className={`tab-button ${activeTab === 'morning' ? 'active' : ''}`}
            onClick={() => setActiveTab('morning')}
          >
            أذكار الصباح
          </button>
          <button 
            className={`tab-button ${activeTab === 'evening' ? 'active' : ''}`}
            onClick={() => setActiveTab('evening')}
          >
            أذكار المساء
          </button>
        </div>

        <div className="progress-bar">
          <div 
            className="progress"
            style={{ 
              width: `${(progress[activeTab] / (activeTab === 'morning' ? morningAthkar.length : eveningAthkar.length)) * 100}%`
            }}
          />
        </div>

        <div className="athkar-list">
          {activeTab === 'morning' ? (
            morningAthkar.map((thikr, index) => (
              <AthkarCounter 
                key={index} 
                thikr={thikr} 
                onComplete={() => handleThikrComplete('morning')}
              />
            ))
          ) : (
            eveningAthkar.map((thikr, index) => (
              <AthkarCounter 
                key={index} 
                thikr={thikr} 
                onComplete={() => handleThikrComplete('evening')}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Athkar;
