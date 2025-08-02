import { supabase } from '../lib/supabase'

// PUBLIC_INTERFACE
export const FileProcessingService = {
  /**
   * Service for processing and parsing uploaded files
   */

  // Process PDF files
  processPDF: async (file, fileId) => {
    try {
      // Mock PDF processing - in production this would use OCR/PDF parsing
      const insights = {
        pageCount: Math.floor(Math.random() * 50) + 10,
        textContent: 'Extracted text content from PDF...',
        keyMetrics: [
          { label: 'Revenue', value: '$2.4M', confidence: 0.95 },
          { label: 'EBITDA', value: '$450K', confidence: 0.92 },
          { label: 'Growth Rate', value: '15%', confidence: 0.88 }
        ],
        tables: [
          {
            title: 'Financial Summary',
            headers: ['Year', 'Revenue', 'Expenses', 'Profit'],
            data: [
              ['2021', '$1.8M', '$1.4M', '$400K'],
              ['2022', '$2.1M', '$1.6M', '$500K'],
              ['2023', '$2.4M', '$1.8M', '$600K']
            ]
          }
        ],
        charts: [
          {
            type: 'line',
            title: 'Revenue Growth',
            data: [
              { period: '2021', value: 1.8 },
              { period: '2022', value: 2.1 },
              { period: '2023', value: 2.4 }
            ]
          }
        ]
      }

      await FileProcessingService.saveInsights(fileId, 'pdf', insights)
      return insights
    } catch (error) {
      console.error('PDF processing error:', error)
      throw error
    }
  },

  // Process DOCX files
  processDOCX: async (file, fileId) => {
    try {
      const insights = {
        wordCount: Math.floor(Math.random() * 5000) + 1000,
        textContent: 'Extracted text from Word document...',
        keyPoints: [
          'Market opportunity valued at $50B',
          'Strong competitive moat with IP portfolio',
          'Experienced management team with track record'
        ],
        sections: [
          { title: 'Executive Summary', confidence: 0.98 },
          { title: 'Market Analysis', confidence: 0.95 },
          { title: 'Financial Projections', confidence: 0.92 }
        ]
      }

      await FileProcessingService.saveInsights(fileId, 'docx', insights)
      return insights
    } catch (error) {
      console.error('DOCX processing error:', error)
      throw error
    }
  },

  // Process Excel files
  processExcel: async (file, fileId) => {
    try {
      const insights = {
        sheetCount: Math.floor(Math.random() * 10) + 3,
        rowCount: Math.floor(Math.random() * 1000) + 100,
        sheets: [
          { name: 'P&L Statement', type: 'financial' },
          { name: 'Balance Sheet', type: 'financial' },
          { name: 'Cash Flow', type: 'financial' },
          { name: 'Assumptions', type: 'model' }
        ],
        keyMetrics: [
          { label: 'Total Revenue', value: '$2.4M', sheet: 'P&L Statement' },
          { label: 'Total Assets', value: '$5.2M', sheet: 'Balance Sheet' },
          { label: 'Operating Cash Flow', value: '$380K', sheet: 'Cash Flow' }
        ],
        charts: [
          {
            type: 'bar',
            title: 'Revenue by Quarter',
            data: [
              { period: 'Q1', value: 520 },
              { period: 'Q2', value: 580 },
              { period: 'Q3', value: 640 },
              { period: 'Q4', value: 660 }
            ]
          }
        ]
      }

      await FileProcessingService.saveInsights(fileId, 'excel', insights)
      return insights
    } catch (error) {
      console.error('Excel processing error:', error)
      throw error
    }
  },

  // Process CSV files
  processCSV: async (file, fileId) => {
    try {
      // Mock CSV parsing
      const insights = {
        rowCount: Math.floor(Math.random() * 500) + 50,
        columnCount: Math.floor(Math.random() * 20) + 5,
        dataTypes: {
          'Date': 'datetime',
          'Amount': 'numeric',
          'Category': 'categorical',
          'Description': 'text'
        },
        preview: [
          ['Date', 'Amount', 'Category', 'Description'],
          ['2023-01-01', '1500', 'Revenue', 'Monthly subscription'],
          ['2023-01-02', '800', 'Expense', 'Office rent'],
          ['2023-01-03', '2200', 'Revenue', 'Consulting fees']
        ],
        summary: {
          totalRecords: Math.floor(Math.random() * 500) + 50,
          dateRange: '2023-01-01 to 2023-12-31',
          categories: ['Revenue', 'Expense', 'Investment', 'Other']
        }
      }

      await FileProcessingService.saveInsights(fileId, 'csv', insights)
      return insights
    } catch (error) {
      console.error('CSV processing error:', error)
      throw error
    }
  },

  // Process JSON files
  processJSON: async (file, fileId) => {
    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)
      
      const insights = {
        structure: FileProcessingService.analyzeJSONStructure(jsonData),
        keyCount: Object.keys(jsonData).length,
        depth: FileProcessingService.getJSONDepth(jsonData),
        dataTypes: FileProcessingService.getJSONDataTypes(jsonData),
        preview: JSON.stringify(jsonData, null, 2).substring(0, 500) + '...'
      }

      await FileProcessingService.saveInsights(fileId, 'json', insights)
      return insights
    } catch (error) {
      console.error('JSON processing error:', error)
      throw error
    }
  },

  // Process audio files
  processAudio: async (file, fileId) => {
    try {
      // Mock audio processing - in production would use speech-to-text
      const insights = {
        duration: Math.floor(Math.random() * 3600) + 300, // 5 min to 1 hour
        transcript: 'This is a mock transcript of the audio file. In our Q4 results, we achieved 15% growth...',
        speakers: [
          { id: 'speaker_1', name: 'CEO', segments: 12 },
          { id: 'speaker_2', name: 'CFO', segments: 8 },
          { id: 'speaker_3', name: 'Interviewer', segments: 15 }
        ],
        keyTopics: [
          { topic: 'Financial Performance', confidence: 0.95, timestamp: '00:05:30' },
          { topic: 'Market Expansion', confidence: 0.88, timestamp: '00:12:45' },
          { topic: 'Team Growth', confidence: 0.82, timestamp: '00:18:20' }
        ],
        sentiment: {
          overall: 'positive',
          confidence: 0.87,
          segments: [
            { timestamp: '00:05:30', sentiment: 'positive', score: 0.9 },
            { timestamp: '00:12:45', sentiment: 'neutral', score: 0.6 },
            { timestamp: '00:18:20', sentiment: 'positive', score: 0.85 }
          ]
        }
      }

      await FileProcessingService.saveInsights(fileId, 'audio', insights)
      return insights
    } catch (error) {
      console.error('Audio processing error:', error)
      throw error
    }
  },

  // Helper functions
  analyzeJSONStructure: (obj, level = 0) => {
    if (level > 5) return 'deeply nested...'
    
    if (Array.isArray(obj)) {
      return `Array[${obj.length}]`
    } else if (typeof obj === 'object' && obj !== null) {
      const keys = Object.keys(obj).slice(0, 5)
      const structure = keys.map(key => `${key}: ${FileProcessingService.analyzeJSONStructure(obj[key], level + 1)}`)
      return `{${structure.join(', ')}${Object.keys(obj).length > 5 ? ', ...' : ''}}`
    } else {
      return typeof obj
    }
  },

  getJSONDepth: (obj, depth = 0) => {
    if (typeof obj !== 'object' || obj === null) return depth
    return Math.max(...Object.values(obj).map(val => FileProcessingService.getJSONDepth(val, depth + 1)))
  },

  getJSONDataTypes: (obj) => {
    const types = new Set()
    
    const traverse = (value) => {
      if (Array.isArray(value)) {
        types.add('array')
        value.forEach(traverse)
      } else if (typeof value === 'object' && value !== null) {
        types.add('object')
        Object.values(value).forEach(traverse)
      } else {
        types.add(typeof value)
      }
    }
    
    traverse(obj)
    return Array.from(types)
  },

  // Save processing insights to database
  saveInsights: async (fileId, fileType, insights) => {
    try {
      const { error } = await supabase
        .from('files')
        .update({
          processing_progress: 100,
          upload_status: 'completed',
          insights: insights
        })
        .eq('id', fileId)

      if (error) throw error

      // Create evidence entries for key data points
      if (insights.keyMetrics) {
        for (const metric of insights.keyMetrics) {
          await supabase
            .from('evidence')
            .insert({
              file_id: fileId,
              content: `${metric.label}: ${metric.value}`,
              confidence: metric.confidence || 0.9
            })
        }
      }

      return true
    } catch (error) {
      console.error('Error saving insights:', error)
      throw error
    }
  },

  // Process file based on type
  processFile: async (file, fileId) => {
    const fileType = file.type
    
    try {
      let insights = null

      switch (fileType) {
        case 'application/pdf':
          insights = await FileProcessingService.processPDF(file, fileId)
          break
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          insights = await FileProcessingService.processDOCX(file, fileId)
          break
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          insights = await FileProcessingService.processExcel(file, fileId)
          break
        case 'text/csv':
          insights = await FileProcessingService.processCSV(file, fileId)
          break
        case 'application/json':
          insights = await FileProcessingService.processJSON(file, fileId)
          break
        case 'audio/mpeg':
        case 'audio/wav':
        case 'audio/mp4':
          insights = await FileProcessingService.processAudio(file, fileId)
          break
        default:
          throw new Error(`Unsupported file type: ${fileType}`)
      }

      return insights
    } catch (error) {
      console.error('File processing failed:', error)
      // Update file status to error
      await supabase
        .from('files')
        .update({
          upload_status: 'error',
          processing_progress: 0
        })
        .eq('id', fileId)
      
      throw error
    }
  },

  // Get processing status
  getProcessingStatus: async (fileId) => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('upload_status, processing_progress, insights')
        .eq('id', fileId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error getting processing status:', error)
      throw error
    }
  }
}

export default FileProcessingService
