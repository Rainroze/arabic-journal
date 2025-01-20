import React, { useState, useEffect, useRef } from 'react'
import EmojiPicker from '@emoji-mart/react'
import emojiData from '@emoji-mart/data'
import moment from 'moment-hijri'
import 'moment/locale/ar-sa'
import Athkar from './components/Athkar'
import Goals from './components/Goals'

const TITLE_EMOJIS = [
  { emoji: '🎯', label: 'هدف', color: '#9C27B0' },
  { emoji: '⭐', label: 'نجمة', color: '#2196F3' },
  { emoji: '✨', label: 'تألق', color: '#4CAF50' },
  { emoji: '🌟', label: 'نجم', color: '#FF9800' },
  { emoji: '💪', label: 'قوة', color: '#E91E63' },
  { emoji: '🏆', label: 'إنجاز', color: '#673AB7' },
  { emoji: '👍', label: 'رائع', color: '#03A9F4' },
  { emoji: '🎨', label: 'إبداع', color: '#009688' }
];

const COLOR_PALETTE = [
  { color: '#9C27B0', label: 'بنفسجي' },
  { color: '#2196F3', label: 'أزرق' },
  { color: '#4CAF50', label: 'أخضر' },
  { color: '#FF9800', label: 'برتقالي' },
  { color: '#E91E63', label: 'وردي' },
  { color: '#673AB7', label: 'أرجواني' },
  { color: '#03A9F4', label: 'سماوي' },
  { color: '#009688', label: 'فيروزي' }
];

const BACKGROUND_COLORS = [
  { label: 'بنفسجي فاتح', value: '#f3e5f5' },
  { label: 'أبيض', value: '#ffffff' },
  { label: 'كريمي', value: '#fff3e0' },
  { label: 'وردي فاتح', value: '#fce4ec' },
  { label: 'أزرق فاتح', value: '#e3f2fd' },
  { label: 'أخضر فاتح', value: '#e8f5e9' },
  { label: 'رمادي فاتح', value: '#f5f5f5' },
  { label: 'أصفر فاتح', value: '#fffde7' },
  { label: 'برتقالي فاتح', value: '#fff3e0' },
  { label: 'أزرق سماوي', value: '#e0f7fa' },
  { label: 'أخضر نعناعي', value: '#e0f2f1' },
  { label: 'خوخي', value: '#fce4ec' },
  { label: 'ليموني', value: '#f0f4c3' },
  { label: 'زهري فاتح', value: '#f8bbd0' },
  { label: 'تركواز فاتح', value: '#e0f2f1' },
  { label: 'بيج فاتح', value: '#efebe9' }
]

const CATEGORIES = [
  'الكل',
  'عام',
  'شخصي',
  'عمل',
  'دراسة',
  'مهام',
  'أفكار',
  'مشاريع'
];

const initialNoteState = {
  id: '',
  title: '',
  content: '',
  backgroundColor: '#f3e5f5',
  category: 'عام',
  titleStyle: {
    bold: false,
    underline: false,
    color: '#2c3e50'
  },
  textStyle: {
    bold: false,
    underline: false,
    align: 'right',
    color: '#2c3e50'
  }
};

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories')
    try {
      return savedCategories ? JSON.parse(savedCategories) : ['عام', 'شخصي', 'عمل', 'أفكار']
    } catch (error) {
      return ['عام', 'شخصي', 'عمل', 'أفكار']
    }
  })

  const [searchTerm, setSearchTerm] = useState('')

  const [customThemeColor, setCustomThemeColor] = useState(() => {
    const saved = localStorage.getItem('customThemeColor')
    return saved || '#9c27b0'
  })

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  
  const [showDialog, setShowDialog] = useState(false)
  const [currentNote, setCurrentNote] = useState(initialNoteState)
  const [isEditing, setIsEditing] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize')
    return saved ? JSON.parse(saved) : 'medium'
  })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showAthkar, setShowAthkar] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const [searchDate, setSearchDate] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const filteredNotes = notes.filter(note => {
    return note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           note.content.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const fileInputRef = useRef(null)
  const settingsRef = useRef(null)
  const imageInputRef = useRef(null)

  const [showColorMenu, setShowColorMenu] = useState(false);

  const formatTitle = (style) => {
    setCurrentNote(prev => ({
      ...prev,
      titleStyle: {
        ...prev.titleStyle,
        ...style
      }
    }));
  };

  const handleTitleChange = (e) => {
    setCurrentNote(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleEmojiSelect = (emoji, color) => {
    setCurrentNote(prev => ({
      ...prev,
      title: prev.title.startsWith('🎯') || prev.title.startsWith('⭐') || 
             prev.title.startsWith('✨') || prev.title.startsWith('🌟') || 
             prev.title.startsWith('💪') || prev.title.startsWith('🏆') || 
             prev.title.startsWith('👍') || prev.title.startsWith('🎨') 
        ? `${emoji} ${prev.title.substring(2)}` 
        : `${emoji} ${prev.title}`,
      titleStyle: {
        ...prev.titleStyle,
        color: color
      }
    }));
  };

  const handleEmojiSelectInContent = (emoji) => {
    const textArea = document.querySelector('.note-content');
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;
    const content = currentNote.content;
    const newContent = content.substring(0, start) + emoji + content.substring(end);
    setCurrentNote(prev => ({
      ...prev,
      content: newContent
    }));
  };

  const generateThemeFromColor = (color) => {
    return {
      light: {
        background: `${color}10`,
        cardBg: '#ffffff',
        text: '#2c3e50',
        textSecondary: '#6c757d',
        buttonBg: color,
        buttonText: '#ffffff',
        borderColor: '#e9ecef',
        headerBg: color,
        headerText: '#ffffff',
        shadowColor: color + '1A',
        accentColor: color,
        gradientStart: color,
        gradientEnd: adjustColor(color, -20)
      },
      dark: {
        background: '#141824',
        cardBg: '#1e2433',
        text: '#e9ecef',
        textSecondary: '#adb5bd',
        buttonBg: color,
        buttonText: '#ffffff',
        borderColor: '#2a2a3e',
        headerBg: color,
        headerText: '#ffffff',
        shadowColor: 'rgba(0,0,0,0.3)',
        accentColor: adjustColor(color, 20),
        gradientStart: color,
        gradientEnd: adjustColor(color, -20)
      }
    }
  }

  // دالة لتعديل درجة اللون
  const adjustColor = (color, amount) => {
    const clamp = (num) => Math.min(255, Math.max(0, num))
    
    // تحويل اللون إلى RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    
    // تعديل القيم
    const newR = clamp(r + amount)
    const newG = clamp(g + amount)
    const newB = clamp(b + amount)
    
    // تحويل القيم الجديدة إلى hex
    const toHex = (n) => {
      const hex = n.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }
    
    return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
  }

  const getTheme = () => {
    return {
      background: darkMode ? '#121212' : '#f5f5f5',
      text: darkMode ? '#ffffff' : '#333333',
      cardBg: darkMode ? '#1e1e1e' : '#ffffff',
      buttonBg: darkMode ? '#333333' : '#f0f0f0',
      buttonText: darkMode ? '#ffffff' : '#333333',
      borderColor: darkMode ? '#333333' : '#e0e0e0',
      gradientStart: '#673AB7',
      gradientEnd: '#9C27B0',
      headerText: '#ffffff',
      inputBg: darkMode ? '#333333' : '#ffffff',
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار ملف صورة فقط');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      const imageUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });

      const resizedImageUrl = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 600;
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const resizedUrl = canvas.toDataURL(file.type, 0.7);
          resolve(resizedUrl);
        };
        img.src = imageUrl;
      });

      setCurrentNote(prev => ({
        ...prev,
        content: prev.content + `<img src="${resizedImageUrl}" />`
      }))
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      alert('حدث خطأ في رفع الصورة');
    }
  };

  const handleAddClick = () => {
    setCurrentNote(initialNoteState)
    setIsEditing(false)
    setShowDialog(true)
  }

  const handleEditClick = (note) => {
    setCurrentNote({
      ...note,
      titleStyle: note.titleStyle || initialNoteState.titleStyle,
      textStyle: note.textStyle || initialNoteState.textStyle
    })
    setIsEditing(true)
    setShowDialog(true)
  }

  const formatDate = (date) => {
    moment.locale('ar-sa')
    const hijriDate = moment(date).format('iYYYY/iM/iD')
    const gregorianDate = moment(date).format('YYYY/M/D')
    return `${hijriDate} هـ - ${gregorianDate} م`
  }

  const handleSaveNote = () => {
    if (!currentNote.title.trim()) {
      alert('الرجاء إدخال عنوان للمذكرة')
      return
    }

    const noteToSave = {
      ...currentNote,
      id: isEditing ? currentNote.id : Date.now(),
      date: new Date().toISOString(),
      formattedDate: formatDate(new Date())
    }

    const updatedNotes = isEditing
      ? notes.map(note => (note.id === currentNote.id ? noteToSave : note))
      : [noteToSave, ...notes]

    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    setShowDialog(false)
    setCurrentNote(initialNoteState)
    setIsEditing(false)
  };

  const handleDeleteNote = () => {
    const updatedNotes = notes.filter(note => note.id !== currentNote.id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
    setShowDialog(false);
    setShowDeleteConfirm(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  const handleFontSizeChange = (size) => {
    setFontSize(size)
  }

  const getFontSize = (factor = 1) => {
    switch (fontSize) {
      case 'small': return `calc(0.9rem * ${factor})`
      case 'large': return `calc(1.2rem * ${factor})`
      default: return `calc(1rem * ${factor})`
    }
  }

  const handleQuickEmoji = (emoji) => {
    setCurrentNote(prev => ({
      ...prev,
      content: prev.content + emoji
    }))
  }

  const handleBackgroundColorChange = (color) => {
    setCurrentNote(prev => ({
      ...prev,
      backgroundColor: color
    }))
  }

  const handleCategoryChange = (category) => {
    setCurrentNote(prev => ({
      ...prev,
      category
    }))
  }

  const exportNotes = () => {
    try {
      const notesToExport = filteredNotes
      const exportData = {
        notes: notesToExport,
        categories: categories,
        exportDate: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `مذكراتي-${new Date().toLocaleDateString('ar-SA')}.json`
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('خطأ في تصدير المذكرات:', error)
    }
  }

  const importNotes = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          setNotes(prevNotes => [...prevNotes, ...importedData.notes])
          setCategories(prevCategories => {
            const newCategories = new Set([...prevCategories, ...importedData.categories])
            return Array.from(newCategories)
          })
        } catch (error) {
          console.error('خطأ في استيراد المذكرات:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  const handleContentChange = (e) => {
    const value = e.target.value;
    requestAnimationFrame(() => {
      setCurrentNote(prev => ({
        ...prev,
        content: value
      }));
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.src = event.target.result;
          img.onload = () => {
            // الحد الأقصى للأبعاد
            const maxWidth = 800;
            const maxHeight = 600;
            
            let width = img.width;
            let height = img.height;
            
            // تقليل حجم الصورة إذا كانت كبيرة جداً
            if (width > maxWidth || height > maxHeight) {
              const ratio = Math.min(maxWidth / width, maxHeight / height);
              width *= ratio;
              height *= ratio;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            const optimizedImage = canvas.toDataURL('image/jpeg', 0.8);
            const imageTag = `\n<img src="${optimizedImage}" alt="صورة مرفقة" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;" />\n`;
            
            const textArea = document.querySelector('.note-content');
            const cursorPosition = textArea.selectionStart;
            const currentContent = currentNote.content;
            const newContent = currentContent.slice(0, cursorPosition) + imageTag + currentContent.slice(cursorPosition);
            
            setCurrentNote(prev => ({
              ...prev,
              content: newContent
            }));
          };
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
      }
    }
  };

  const handleAddImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = handleImageUpload
    input.click()
  }

  const renderNoteContent = (content) => {
    if (!content) return '';
    return content.split('\n').map((line, index) => {
      if (line.trim().startsWith('<img')) {
        return line;
      }
      return line + '\n';
    }).join('');
  };

  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode))
      localStorage.setItem('customThemeColor', customThemeColor)
      localStorage.setItem('fontSize', JSON.stringify(fontSize))
      localStorage.setItem('notes', JSON.stringify(notes))
      localStorage.setItem('categories', JSON.stringify(categories))
    } catch (error) {
      console.error('خطأ في حفظ البيانات:', error)
    }
  }, [darkMode, customThemeColor, fontSize, notes, categories])

  const handleNoteClick = (note) => {
    setCurrentNote({
      ...note,
    })
    setIsEditing(true)
    setShowDialog(true)
  }

  const formatText = (style) => {
    setCurrentNote(prev => ({
      ...prev,
      textStyle: {
        ...prev.textStyle,
        ...style
      }
    }));
  };

  return (
    <div className="app" style={{ 
      backgroundColor: getTheme().background,
      color: getTheme().text,
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: `linear-gradient(135deg, ${getTheme().gradientStart}, ${getTheme().gradientEnd})`,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: 'white',
              fontSize: '0.9rem'
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            ⚙️
          </button>
          <button
            onClick={() => setShowAthkar(!showAthkar)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            📿
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        <div style={{ 
          maxWidth: '600px', 
          margin: '0 auto 2rem',
          position: 'relative' 
        }}>
          <input
            type="text"
            placeholder="ابحث في المذكرات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 3rem',
              border: 'none',
              borderRadius: '12px',
              backgroundColor: getTheme().cardBg,
              color: getTheme().text,
              fontSize: '1rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              textAlign: 'right'
            }}
          />
          <span style={{
            position: 'absolute',
            left: '1rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '1.2rem',
            opacity: 0.6
          }}>
            🔍
          </span>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          margin: '2rem 0' 
        }}>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${getTheme().gradientStart}, ${getTheme().gradientEnd})`,
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            استيراد
          </button>
          <button
            onClick={exportNotes}
            style={{
              padding: '0.75rem 2rem',
              border: 'none',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${getTheme().gradientStart}, ${getTheme().gradientEnd})`,
              color: 'white',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            تصدير
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          padding: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          <button 
            className="add-note-button" 
            onClick={handleAddClick}
            style={{
              backgroundColor: getTheme().buttonBg,
              color: getTheme().buttonText,
              border: 'none',
              borderRadius: '12px',
              padding: '2rem',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              height: '200px',
              justifyContent: 'center'
            }}
          >
            <span style={{ fontSize: '2rem' }}>✏️</span>
            إضافة مذكرة جديدة
          </button>

          {filteredNotes.map(note => (
            <div
              key={note.id}
              onClick={() => handleNoteClick(note)}
              style={{
                backgroundColor: getTheme().cardBg,
                borderRadius: '12px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                ':hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }
              }}
            >
              <h3 style={{
                margin: '0 0 1rem 0',
                color: note.titleStyle?.color || getTheme().text,
                fontWeight: note.titleStyle?.bold ? 'bold' : 'normal',
                textDecoration: note.titleStyle?.underline ? 'underline' : 'none',
                fontSize: '1.2rem',
                textAlign: 'right',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                justifyContent: 'flex-end'
              }}>
                {note.title}
              </h3>
              <p style={{
                margin: 0,
                color: getTheme().text,
                opacity: 0.8,
                fontSize: '1rem',
                textAlign: 'right',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}>
                {note.content}
              </p>
              <div style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: getTheme().text,
                opacity: 0.6,
                fontSize: '0.9rem'
              }}>
                <span>{new Date(note.date).toLocaleDateString('ar-SA')}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="app-footer"></footer>

      {showDialog && (
        <div className="dialog-overlay" onClick={(e) => {
          if (e.target.className === 'dialog-overlay') {
            setShowDialog(false)
          }
        }}>
          <div className="dialog" style={{ 
            backgroundColor: getTheme().cardBg,
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => setShowDialog(false)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                backgroundColor: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getTheme().text,
                transition: 'all 0.2s ease',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                ':hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }
              }}
              title="إغلاق"
            >
              ✕
            </button>
            <div className="title-section" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                value={currentNote.title || ''}
                onChange={handleTitleChange}
                placeholder="عنوان المذكرة..."
                dir="rtl"
                style={{
                  width: '100%',
                  padding: '12px',
                  marginBottom: '12px',
                  backgroundColor: getTheme().inputBg,
                  color: currentNote.titleStyle?.color || getTheme().text,
                  border: `1px solid ${getTheme().borderColor}`,
                  borderRadius: '8px',
                  fontSize: '1.2rem',
                  fontWeight: currentNote.titleStyle?.bold ? 'bold' : 'normal',
                  textDecoration: currentNote.titleStyle?.underline ? 'underline' : 'none'
                }}
              />
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                {TITLE_EMOJIS.map(item => (
                  <button
                    key={item.emoji}
                    onClick={() => handleEmojiSelect(item.emoji, item.color)}
                    style={{
                      padding: '0.75rem',
                      border: 'none',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="format-toolbar" style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '8px',
              flexWrap: 'wrap'
            }}>
              {/* أزرار التنسيق */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => imageInputRef.current.click()}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: getTheme().buttonBg,
                    color: getTheme().buttonText,
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  📷 إضافة صورة
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                  ref={imageInputRef}
                />
              </div>

              {/* أزرار الإيموجي */}
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                {['😊', '❤️', '👍', '🌟', '✨', '🎯', '📝', '💡', '🎨', '📚'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelectInContent(emoji)}
                    style={{
                      padding: '0.5rem',
                      border: 'none',
                      borderRadius: '4px',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      fontSize: '1.2rem',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="note-content-wrapper" style={{
              border: `1px solid ${getTheme().borderColor}`,
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: getTheme().inputBg
            }}>
              <div
                className="note-content-display"
                style={{
                  minHeight: '200px',
                  color: getTheme().text,
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap'
                }}
                dangerouslySetInnerHTML={{ __html: renderNoteContent(currentNote.content) }}
              />
              <textarea
                className="note-content"
                value={currentNote.content}
                onChange={handleContentChange}
                placeholder="اكتب مذكرتك هنا..."
                dir="rtl"
                style={{
                  width: '100%',
                  minHeight: '200px',
                  padding: '1rem',
                  backgroundColor: 'transparent',
                  color: getTheme().text,
                  border: 'none',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '2rem',
              gap: '1rem'
            }}>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  ':hover': {
                    backgroundColor: '#c82333'
                  }
                }}
              >
                🗑️ حذف المذكرة
              </button>
              <button
                onClick={() => setShowDialog(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: getTheme().buttonBg,
                  color: getTheme().buttonText,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
              >
                إلغاء
              </button>
              <button
                onClick={handleSaveNote}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: getTheme().buttonBg,
                  color: getTheme().buttonText,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: getTheme().cardBg,
            padding: '2rem',
            borderRadius: '12px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center'
          }}>
            <h3 style={{ marginBottom: '1rem', color: getTheme().text }}>
              هل أنت متأكد من حذف هذه المذكرة؟
            </h3>
            <p style={{ marginBottom: '2rem', color: getTheme().text, opacity: 0.8 }}>
              لا يمكن التراجع عن هذا الإجراء
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={handleDeleteNote}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem',
                  ':hover': {
                    backgroundColor: '#c82333'
                  }
                }}
              >
                نعم، احذف المذكرة
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: getTheme().buttonBg,
                  color: getTheme().buttonText,
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '1rem'
                }}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {showAthkar && (
        <Athkar onClose={() => setShowAthkar(false)} getTheme={getTheme} />
      )}
      
      {showGoals && (
        <Goals onClose={() => setShowGoals(false)} getTheme={getTheme} />
      )}

      {showSettings && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: getTheme().cardBg,
          padding: '2rem',
          borderRadius: '15px',
          boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
          zIndex: 1000,
          maxWidth: '90%',
          width: '400px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }} ref={settingsRef}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              margin: 0,
              color: getTheme().text,
              fontSize: '1.5rem'
            }}>
              الإعدادات
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: '5px',
                color: getTheme().textSecondary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                ':hover': {
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: getTheme().text, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                style={{ cursor: 'pointer' }}
              />
              الوضع الداكن
            </label>
          </div>

          <div>
            <label style={{ display: 'block', color: getTheme().text, marginBottom: '8px' }}>
              حجم الخط
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  style={{
                    padding: '8px',
                    backgroundColor: fontSize === size ? getTheme().buttonBg : 'transparent',
                    color: fontSize === size ? getTheme().buttonText : getTheme().text,
                    border: `1px solid ${getTheme().borderColor}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    flex: 1,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {size === 'small' && 'صغير'}
                  {size === 'medium' && 'متوسط'}
                  {size === 'large' && 'كبير'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: getTheme().text, marginBottom: '8px' }}>
              لون السمة
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="color"
                value={customThemeColor}
                onChange={(e) => {
                  const newColor = e.target.value
                  setCustomThemeColor(newColor)
                  localStorage.setItem('customThemeColor', newColor)
                }}
                style={{
                  width: '50px',
                  height: '50px',
                  padding: '0',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
              <div style={{ 
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  fontSize: '0.9em',
                  color: getTheme().textSecondary
                }}>
                  اختر لون مخصص للتطبيق
                </div>
                <div style={{
                  display: 'flex',
                  gap: '8px'
                }}>
                  {['#9c27b0', '#1976d2', '#2e7d32', '#f57c00', '#d32f2f', '#00796b'].map(color => (
                    <button
                      key={color}
                      onClick={() => {
                        setCustomThemeColor(color)
                        localStorage.setItem('customThemeColor', color)
                      }}
                      style={{
                        width: '30px',
                        height: '30px',
                        backgroundColor: color,
                        border: customThemeColor === color ? 
                          `2px solid ${getTheme().buttonBg}` : '1px solid #ddd',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        padding: 0
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}

export default App;
