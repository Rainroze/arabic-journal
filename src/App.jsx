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

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    try {
      return savedNotes ? JSON.parse(savedNotes) : []
    } catch (error) {
      console.error('خطأ في تحميل المذكرات:', error)
      return []
    }
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
  const [selectedCategory, setSelectedCategory] = useState('الكل')

  const [customThemeColor, setCustomThemeColor] = useState(() => {
    const saved = localStorage.getItem('customThemeColor')
    return saved || '#9c27b0'
  })

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  
  const [showDialog, setShowDialog] = useState(false)
  const [currentNote, setCurrentNote] = useState({ 
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
  })
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
  const [filteredNotes, setFilteredNotes] = useState([])
  const fileInputRef = useRef(null)
  const settingsRef = useRef(null)

  const [showColorMenu, setShowColorMenu] = useState(false);

  const [titleStyle, setTitleStyle] = useState({
    bold: false,
    underline: false,
    color: '#2c3e50'
  });

  const formatTitle = (style) => {
    const newStyle = {
      ...titleStyle,
      ...style
    };
    setTitleStyle(newStyle);
    
    // تحديث المذكرة الحالية مع النمط الجديد
    setCurrentNote(prev => ({
      ...prev,
      titleStyle: newStyle
    }));
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    requestAnimationFrame(() => {
      setCurrentNote(prev => ({
        ...prev,
        title: value
      }));
    });
  };

  const handleQuickEmojiTitle = (emoji) => {
    const cursorPosition = document.querySelector('.note-title-input').selectionStart;
    const currentTitle = currentNote.title;
    const newTitle = currentTitle.slice(0, cursorPosition) + emoji + currentTitle.slice(cursorPosition);
    setCurrentNote(prev => ({
      ...prev,
      title: newTitle
    }));
  };

  const handleEmojiSelect = (emojiData) => {
    const emoji = emojiData.native || emojiData;
    if (document.activeElement.classList.contains('note-title-input')) {
      handleQuickEmojiTitle(emoji);
    } else {
      const cursorPosition = document.querySelector('.note-content-textarea').selectionStart;
      const currentContent = currentNote.content;
      const newContent = currentContent.slice(0, cursorPosition) + emoji + currentContent.slice(cursorPosition);
      setCurrentNote(prev => ({
        ...prev,
        content: newContent
      }));
    }
    setShowEmojiPicker(false);
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
    const theme = generateThemeFromColor(customThemeColor)
    return darkMode ? theme.dark : theme.light
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
    setCurrentNote({ title: '', content: '', backgroundColor: '#f3e5f5', category: 'عام', titleStyle: { bold: false, underline: false, color: '#2c3e50' }, textStyle: { bold: false, underline: false, align: 'right', color: '#2c3e50' } })
    setIsEditing(false)
    setShowDialog(true)
  }

  const handleEditClick = (note) => {
    setCurrentNote(note)
    setTitleStyle(note.titleStyle || {
      bold: false,
      underline: false,
      color: getTheme().text
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
      titleStyle,
      date: new Date().toISOString(),
      formattedDate: formatDate(new Date())
    }

    const updatedNotes = isEditing
      ? notes.map(note => (note.id === currentNote.id ? noteToSave : note))
      : [...notes, { ...noteToSave, id: Date.now() }]

    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
    setShowDialog(false)
    setCurrentNote({ title: '', content: '', backgroundColor: '#f3e5f5', category: 'عام' })
    setIsEditing(false)
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('هل أنت متأكد من حذف هذه المذكرة؟')) {
      try {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
      } catch (error) {
        console.error('خطأ في حذف المذكرة:', error)
        alert('حدث خطأ في حذف المذكرة')
      }
    }
  }

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
      const notesToExport = searchTerm || selectedCategory !== 'الكل' ? filteredNotes : notes
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

  useEffect(() => {
    searchNotes()
  }, [searchTerm, selectedCategory, searchDate, notes])

  const searchNotes = () => {
    let filtered = [...notes]
    
    if (searchTerm) {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'الكل') {
      filtered = filtered.filter(note => note.category === selectedCategory)
    }

    if (searchDate) {
      filtered = filtered.filter(note => note.date?.includes(searchDate))
    }

    setFilteredNotes(filtered)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleNoteClick = (note) => {
    setCurrentNote({
      ...note,
    })
    setTitleStyle(note.titleStyle || {
      bold: false,
      underline: false,
      color: getTheme().text
    })
    setIsEditing(true)
    setShowDialog(true)
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`} style={{ 
      backgroundColor: getTheme().background,
      color: getTheme().text,
      fontSize: getFontSize(fontSize)
    }}>
      <header style={{
        width: '100%',
        background: `linear-gradient(135deg, ${getTheme().gradientStart}, ${getTheme().gradientEnd})`,
        padding: '1.5rem',
        borderRadius: 'var(--border-radius)',
        marginBottom: 'var(--grid-gap)',
        color: getTheme().headerText,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div className="header-buttons">
          <button
            onClick={() => setShowGoals(true)}
            style={{ backgroundColor: getTheme().buttonBg, color: getTheme().buttonText }}
          >
            أهدافي
          </button>
          <button
            onClick={() => setShowAthkar(true)}
            style={{ backgroundColor: getTheme().buttonBg, color: getTheme().buttonText }}
          >
            الأذكار
          </button>
          <button onClick={toggleDarkMode}>
            {darkMode ? '🌞' : '🌙'}
          </button>
          <button onClick={() => setShowSettings(true)}>
            ⚙️
          </button>
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${getTheme().borderColor}`,
              backgroundColor: getTheme().cardBg,
              color: getTheme().text,
              marginLeft: '10px'
            }}
          />
          <input
            type="text"
            placeholder="ابحث في المذكرات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${getTheme().borderColor}`,
              backgroundColor: getTheme().cardBg,
              color: getTheme().text,
              marginLeft: '10px'
            }}
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: `1px solid ${getTheme().borderColor}`,
              backgroundColor: getTheme().cardBg,
              color: getTheme().text,
              marginLeft: '10px'
            }}
          >
            <option value="الكل">كل التصنيفات</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: getTheme().buttonBg,
              color: getTheme().buttonText,
              border: 'none',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            استيراد
          </button>
          <button
            onClick={exportNotes}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              backgroundColor: getTheme().buttonBg,
              color: getTheme().buttonText,
              border: 'none',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            تصدير
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={importNotes}
            accept=".json"
            style={{ display: 'none' }}
          />
        </div>
      </header>

      <main>
        <div className="content">
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold' }}>
            مذكراتي
          </h1>

          <div className="notes-grid" style={{
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
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
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

            {(searchTerm || selectedCategory !== 'الكل' ? filteredNotes : notes).map(note => (
              <div
                key={note.id}
                className="note-card"
                style={{
                  backgroundColor: note.backgroundColor || getTheme().cardBg,
                  color: getTheme().text,
                  border: `1px solid ${getTheme().borderColor}`,
                  borderRadius: '8px',
                  padding: '20px',
                  marginBottom: '20px',
                  boxShadow: `0 2px 4px ${getTheme().shadowColor}`,
                  position: 'relative'
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.5em' }}>{note.title}</h3>
                <div style={{ marginBottom: '10px', fontSize: '0.9em', color: getTheme().textSecondary }}>
                  {note.formattedDate}
                </div>
                <div style={{ marginBottom: '10px', fontSize: '0.9em', color: getTheme().textSecondary }}>
                  التصنيف: {note.category}
                </div>
                <div dangerouslySetInnerHTML={{ __html: note.content }} />
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  display: 'flex',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => handleNoteClick(note)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: getTheme().buttonBg,
                      color: getTheme().buttonText,
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: 'var(--danger)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="app-footer"></footer>

      {showDialog && (
        <div className="dialog-overlay" onClick={(e) => {
          if (e.target.className === 'dialog-overlay') {
            setShowDialog(false)
          }
        }}>
          <div className="dialog" style={{ backgroundColor: getTheme().cardBg }}>
            <input
              type="text"
              placeholder="عنوان المذكرة..."
              value={currentNote.title}
              onChange={handleTitleChange}
              className="note-title-input"
              dir="rtl"
              autoComplete="off"
              style={{ 
                backgroundColor: currentNote.backgroundColor,
                color: titleStyle.color,
                fontWeight: titleStyle.bold ? 'bold' : 'normal',
                fontStyle: titleStyle.italic ? 'italic' : 'normal',
                textDecoration: titleStyle.underline ? 'underline' : 'none'
              }}
            />

            <div className="format-toolbar">
              <div className="format-group">
                <button
                  className={`format-btn ${titleStyle.bold ? 'active' : ''}`}
                  onClick={() => formatTitle({ bold: !titleStyle.bold })}
                  title="خط عريض"
                >
                  <span className="format-icon">B</span>
                </button>
                <button
                  className={`format-btn ${titleStyle.underline ? 'active' : ''}`}
                  onClick={() => formatTitle({ underline: !titleStyle.underline })}
                  title="تسطير"
                >
                  <span className="format-icon">U</span>
                </button>
              </div>

              <div className="format-group colors-group">
                <div className="dropdown">
                  <button
                    className="format-btn menu-btn"
                    onClick={() => setShowColorMenu(!showColorMenu)}
                    title="تغيير لون النص"
                  >
                    <span className="format-icon">🎨</span>
                  </button>
                  {showColorMenu && (
                    <div className="dropdown-menu colors-menu">
                      {COLOR_PALETTE.map(item => (
                        <button
                          key={item.color}
                          className="color-item"
                          onClick={() => {
                            formatTitle({ color: item.color });
                            setShowColorMenu(false);
                          }}
                          title={item.label}
                        >
                          <span className="color-circle" style={{ backgroundColor: item.color }}></span>
                          <span className="color-label">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="format-group emojis-group">
                {TITLE_EMOJIS.map(item => (
                  <button
                    key={item.emoji}
                    onClick={() => handleQuickEmojiTitle(item.emoji)}
                    className="format-btn emoji-btn"
                    title={item.label}
                    style={{ 
                      color: item.color,
                      borderColor: item.color
                    }}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-toolbar">
              <div className="format-group">
                <button
                  className={`format-btn ${currentNote.textStyle.bold ? 'active' : ''}`}
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      bold: !prev.textStyle.bold
                    }
                  }))}
                  title="خط عريض"
                >
                  <span className="format-icon">B</span>
                </button>
                <button
                  className={`format-btn ${currentNote.textStyle.underline ? 'active' : ''}`}
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      underline: !prev.textStyle.underline
                    }
                  }))}
                  title="تسطير"
                >
                  <span className="format-icon">U</span>
                </button>
              </div>

              <div className="format-group">
                <button
                  className={`format-btn ${currentNote.textStyle.align === 'right' ? 'active' : ''}`}
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      align: 'right'
                    }
                  }))}
                  title="محاذاة لليمين"
                >
                  ⇚
                </button>
                <button
                  className={`format-btn ${currentNote.textStyle.align === 'center' ? 'active' : ''}`}
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      align: 'center'
                    }
                  }))}
                  title="توسيط"
                >
                  ⇔
                </button>
                <button
                  className={`format-btn ${currentNote.textStyle.align === 'left' ? 'active' : ''}`}
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      align: 'left'
                    }
                  }))}
                  title="محاذاة لليسار"
                >
                  ⇛
                </button>
              </div>

              <div className="format-group">
                <button
                  className="format-btn color-btn"
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      color: '#9C27B0'
                    }
                  }))}
                  title="لون بنفسجي"
                >
                  <span className="color-circle purple"></span>
                </button>
                <button
                  className="format-btn color-btn"
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      color: '#2196F3'
                    }
                  }))}
                  title="لون أزرق"
                >
                  <span className="color-circle blue"></span>
                </button>
                <button
                  className="format-btn color-btn"
                  onClick={() => setCurrentNote(prev => ({
                    ...prev,
                    textStyle: {
                      ...prev.textStyle,
                      color: '#4CAF50'
                    }
                  }))}
                  title="لون أخضر"
                >
                  <span className="color-circle green"></span>
                </button>
              </div>

              <div className="format-group">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="format-btn"
                  title="إضافة صورة"
                >
                  🖼️
                </button>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="format-btn"
                  title="إضافة رموز تعبيرية"
                >
                  😊
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  theme={darkMode ? 'dark' : 'light'}
                  emojiStyle="native"
                />
              </div>
            )}

            <textarea
              value={currentNote.content}
              onChange={handleContentChange}
              placeholder="اكتب مذكرتك هنا..."
              className="note-content-textarea"
              dir="rtl"
              autoComplete="off"
              style={{ 
                backgroundColor: currentNote.backgroundColor,
                color: currentNote.textStyle.color,
                fontWeight: currentNote.textStyle.bold ? 'bold' : 'normal',
                fontStyle: currentNote.textStyle.italic ? 'italic' : 'normal',
                textDecoration: currentNote.textStyle.underline ? 'underline' : 'none',
                textAlign: currentNote.textStyle.align,
                minHeight: '300px',
                fontSize: getFontSize(fontSize),
                fontFamily: 'Noto Sans Arabic, sans-serif'
              }}
            />
            <div className="dialog-buttons">
              <button
                className="dialog-btn cancel-btn"
                onClick={() => setShowDialog(false)}
              >
                إلغاء
              </button>
              <button
                className="dialog-btn save-btn"
                onClick={handleSaveNote}
              >
                حفظ المذكرة
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
