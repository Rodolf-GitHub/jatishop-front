<template>
  <div v-if="visible" :class="['info-banner', type]">
    <div class="info-banner-content">
      <span class="info-banner-icon">
        <i :class="icon"></i>
      </span>
      <span class="info-banner-text">{{ props.message }}</span>
    </div>
    <button v-if="dismissible" class="info-banner-close" @click="dismiss">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps, computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
  },
  message: {
    type: String,
    required: true
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  autoHide: {
    type: Number,
    default: 0
  }
})

const visible = ref(true)

const icons = {
  info: 'fas fa-info-circle',
  success: 'fas fa-check-circle',
  warning: 'fas fa-exclamation-triangle',
  error: 'fas fa-times-circle'
}

const icon = computed(() => icons[props.type])

const dismiss = () => {
  visible.value = false
}

if (props.autoHide > 0) {
  setTimeout(() => {
    visible.value = false
  }, props.autoHide)
}
</script>

<style scoped>
.info-banner {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-size: 0.95rem;
  background-color: #FEE2E2;
  border-bottom: 1px solid #FECACA;
}

.info-banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  max-width: 1200px;
  margin: 0 auto;
  color: #991B1B;
  font-weight: 500;
}

.info-banner-icon {
  display: flex;
  align-items: center;
  color: #DC2626;
}

.info-banner-close {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #991B1B;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.info-banner-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Tipos de banner */
.info {
  background-color: #FEE2E2;
  color: #991B1B;
}

.success {
  background-color: #DCFCE7;
  color: #166534;
}

.warning {
  background-color: #FEF3C7;
  color: #92400E;
}

.error {
  background-color: #FEE2E2;
  color: #991B1B;
}
</style> 