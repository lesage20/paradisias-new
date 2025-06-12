<template>
  <div class="pdf-generator">
    <div ref="content" class="pdf-content">
      <slot name="content"></slot>
    </div>
    
    <div class="mt-6 flex items-center justify-center space-x-4">
      <button 
        @click="generatePdf"
        :disabled="isGenerating"
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        <Download class="w-5 h-5 mr-2" />
        <span v-if="isGenerating">Génération...</span>
        <span v-else>Télécharger PDF</span>
      </button>
      
      <button 
        @click="showPreview = true"
        class="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
      >
        <Eye class="w-5 h-5 mr-2" />
        Aperçu PDF
      </button>
    </div>

    <!-- Modal d'aperçu -->
    <div v-if="showPreview" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50" @click="closePreview">
      <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-screen overflow-y-auto" @click.stop>
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Aperçu PDF - {{ title }}</h3>
          <button @click="closePreview" class="text-gray-400 hover:text-gray-600">
            <X class="w-6 h-6" />
          </button>
        </div>
        
        <div class="p-6">
          <div class="bg-white shadow-lg rounded-lg overflow-hidden">
            <div ref="previewContent" v-html="content?.innerHTML" class="p-8"></div>
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div v-if="isGenerating" class="flex items-center text-blue-600">
            <RefreshCw class="w-5 h-5 animate-spin mr-2" />
            <span>Génération en cours...</span>
          </div>
          <div class="flex items-center space-x-3">
            <button @click="closePreview" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              Annuler
            </button>
            <button @click="generatePdf" class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
              Télécharger
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import html2pdf from 'html2pdf.js'
import { Download, Eye, X, RefreshCw } from 'lucide-vue-next'

// Props
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// État
const content = ref(null)
const showPreview = ref(false)
const isGenerating = ref(false)

// Méthodes
const generatePdf = async () => {
  isGenerating.value = true
  
  try {
    const options = {
      margin: [10, 10],
      filename: `${props.title}_${new Date().toLocaleDateString()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        dpi: 75, 
        scale: 2, 
        letterRendering: true,
        useCORS: true
      },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
      jsPDF: { 
        orientation: 'portrait',
        unit: 'mm', 
        format: 'a4' 
      }
    }

    await html2pdf()
      .from(content.value)
      .set(options)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const totalPages = pdf.internal.getNumberOfPages()
        
        // Ajouter pied de page à chaque page
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i)
          pdf.setFontSize(10)
          pdf.setTextColor(150)
          pdf.text('Paradisias Hotel est situé à Man non loin du lycée moderne de Man', 10, 290)
          pdf.text('Contact: +225 0787572030', 157, 290)
        }
      })
      .save()
    
    closePreview()
  } catch (error) {
    console.error('Erreur lors de la génération PDF:', error)
  } finally {
    isGenerating.value = false
  }
}

const closePreview = () => {
  showPreview.value = false
}

onMounted(() => {
  // Le contenu sera disponible après le montage
})
</script>

<style scoped>
.pdf-content {
  background: white;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

@media print {
  .pdf-generator > *:not(.pdf-content) {
    display: none !important;
  }
  
  .pdf-content {
    box-shadow: none;
    margin: 0;
    padding: 0;
  }
}
</style> 