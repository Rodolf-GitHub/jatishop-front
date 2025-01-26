<template>
  <div v-if="visible" class="info-banner success">
    <div class="info-banner-content">
      <span class="info-banner-icon">
        <InformationCircleIcon class="h-4 w-4" />
      </span>
      <span class="info-banner-text text-xs">
        ¡E-comCuba se ha actualizado!
        <router-link 
          v-if="showNewFeaturesButton"
          to="/newFeatures"
          class="new-features-button"
        >
          <InformationCircleIcon class="h-3 w-3" />
          Ver novedades
        </router-link>
      </span>
    </div>
    <button v-if="dismissible" class="info-banner-close" @click="dismiss">
      <XMarkIcon class="h-3 w-3" />
    </button>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { InformationCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  dismissible: {
    type: Boolean,
    default: true
  },
  autoHide: {
    type: Number,
    default: 0
  },
  showNewFeaturesButton: {
    type: Boolean,
    default: true
  }
})

const visible = ref(true)

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
  padding: 0.25rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  font-size: 0.75rem;
  background-color: #DCFCE7;
  border-bottom: 1px solid #86EFAC;
  transition: all 0.3s ease;
}

.info-banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  margin: 0 auto;
  color: #166534;
  font-weight: 500;
}

.info-banner-icon {
  display: flex;
  align-items: center;
  color: #16A34A;
}

.info-banner-close {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.125rem;
  color: #166534;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.info-banner-close:hover {
  opacity: 1;
  transform: scale(1.1);
}

.new-features-button {
  display: inline-flex;
  align-items: center;
  margin-left: 0.25rem;
  padding: 0.125rem 0.5rem;
  background-color: #16A34A;
  color: white;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: 0.75rem;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.new-features-button:hover {
  background-color: #15803D;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-features-button svg {
  margin-right: 0.2rem;
}

.success {
  background-color: #DCFCE7;
  color: #166534;
}
</style> 