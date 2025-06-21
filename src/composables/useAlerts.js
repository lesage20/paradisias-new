import { useToast } from 'vue-toastification'
import Swal from 'sweetalert2'

export function useAlerts() {
  const toast = useToast()

  // ===========================================
  // TOASTS (vue-toastification)
  // ===========================================

  const showToast = {
    // Toast de succès
    success: (message, options = {}) => {
      toast.success(message, {
        timeout: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false,
        ...options
      })
    },

    // Toast d'erreur
    error: (message, options = {}) => {
      toast.error(message, {
        timeout: 6000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false,
        ...options
      })
    },

    // Toast d'avertissement
    warning: (message, options = {}) => {
      toast.warning(message, {
        timeout: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false,
        ...options
      })
    },

    // Toast d'information
    info: (message, options = {}) => {
      toast.info(message, {
        timeout: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false,
        ...options
      })
    },

    // Toast par défaut
    default: (message, options = {}) => {
      toast(message, {
        timeout: 4000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        showCloseButtonOnHover: false,
        hideProgressBar: false,
        closeButton: 'button',
        icon: true,
        rtl: false,
        ...options
      })
    }
  }

  // ===========================================
  // ALERTS & CONFIRMATIONS (SweetAlert2)
  // ===========================================

  const showAlert = {
    // Alerte de succès
    success: async (title, text = '', options = {}) => {
      return await Swal.fire({
        icon: 'success',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#10B981',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    },

    // Alerte d'erreur
    error: async (title, text = '', options = {}) => {
      return await Swal.fire({
        icon: 'error',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#EF4444',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    },

    // Alerte d'avertissement
    warning: async (title, text = '', options = {}) => {
      return await Swal.fire({
        icon: 'warning',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#F59E0B',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    },

    // Alerte d'information
    info: async (title, text = '', options = {}) => {
      return await Swal.fire({
        icon: 'info',
        title,
        text,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3B82F6',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    },

    // Question/Confirmation
    question: async (title, text = '', options = {}) => {
      return await Swal.fire({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
        confirmButtonColor: '#8B5CF6',
        cancelButtonColor: '#6B7280',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    }
  }

  // ===========================================
  // CONFIRMATIONS SPÉCIALISÉES
  // ===========================================

  const showConfirm = {
    // Confirmation de suppression
    delete: async (itemName = '', options = {}) => {
      return await Swal.fire({
        icon: 'warning',
        title: 'Confirmer la suppression',
        text: itemName ? `Êtes-vous sûr de vouloir supprimer "${itemName}" ?` : 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        html: itemName ? `Êtes-vous sûr de vouloir supprimer <strong>"${itemName}"</strong> ?` : 'Êtes-vous sûr de vouloir supprimer cet élément ?',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        focusCancel: false,
        reverseButtons: true,
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    },

    // Confirmation de sauvegarde
    save: async (message = 'Êtes-vous sûr de vouloir sauvegarder ces modifications ?', options = {}) => {
      return await Swal.fire({
        icon: 'question',
        title: 'Confirmer la sauvegarde',
        text: message,
        showCancelButton: true,
        confirmButtonText: 'Sauvegarder',
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#6B7280',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    },

    // Confirmation d'action
    action: async (title, message, confirmText = 'Confirmer', options = {}) => {
      return await Swal.fire({
        icon: 'question',
        title,
        text: message,
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: 'Annuler',
        confirmButtonColor: '#8B5CF6',
        cancelButtonColor: '#6B7280',
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        },
        ...options
      })
    }
  }

  // ===========================================
  // ALERTES DE CHARGEMENT
  // ===========================================

  const showLoading = {
    // Montrer un loader
    show: (title = 'Chargement...', text = '') => {
      Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading()
        },
        customClass: {
          popup: 'swal-popup-rounded',
          title: 'swal-title-custom',
          content: 'swal-content-custom'
        }
      })
    },

    // Masquer le loader
    hide: () => {
      Swal.close()
    },

    // Mettre à jour le loader
    update: (title, text = '') => {
      Swal.update({
        title,
        text
      })
    }
  }

  // ===========================================
  // HELPERS POUR LES CAS D'USAGE COURANTS
  // ===========================================

  const handleApiSuccess = (message = 'Opération réussie !') => {
    showToast.success(message)
  }

  const handleApiError = (error, defaultMessage = 'Une erreur est survenue') => {
    const message = error?.response?.data?.message || error?.message || defaultMessage
    showToast.error(message)
  }

  const handleValidationErrors = (errors) => {
    if (Array.isArray(errors)) {
      errors.forEach(error => showToast.error(error))
    } else if (typeof errors === 'object') {
      Object.values(errors).flat().forEach(error => showToast.error(error))
    } else {
      showToast.error(errors)
    }
  }

  // Confirmation avant action avec loading
  const confirmAndExecute = async (action, confirmOptions = {}, loadingMessage = 'Traitement...') => {
    const result = await showConfirm.action(
      confirmOptions.title || 'Confirmer l\'action',
      confirmOptions.message || 'Êtes-vous sûr de vouloir continuer ?',
      confirmOptions.confirmText || 'Confirmer',
      confirmOptions
    )

    if (result.isConfirmed) {
      showLoading.show(loadingMessage)
      try {
        const response = await action()
        showLoading.hide()
        handleApiSuccess(confirmOptions.successMessage || 'Opération réussie !')
        return { success: true, data: response }
      } catch (error) {
        showLoading.hide()
        handleApiError(error, confirmOptions.errorMessage)
        return { success: false, error }
      }
    }

    return { success: false, cancelled: true }
  }

  return {
    // Toasts
    showToast,
    
    // Alertes
    showAlert,
    
    // Confirmations
    showConfirm,
    
    // Loading
    showLoading,
    
    // Helpers
    handleApiSuccess,
    handleApiError,
    handleValidationErrors,
    confirmAndExecute
  }
} 