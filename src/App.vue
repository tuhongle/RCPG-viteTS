<script setup lang="ts">
import { useColorStore } from './stores/colorStore'
import ClipboardJS from "clipboard"
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

const colorStore = useColorStore();
const currentColor = ref<string>();

const { colorCopied } = storeToRefs(colorStore);

document.addEventListener('keydown', (e: KeyboardEvent)=> {
  e.preventDefault();
  if (e.code === 'Space') {
    colorStore.createColorPalette();
  }
});

const clipboard = new ClipboardJS('.copy');

clipboard.on('success', (e) => {
  colorCopied.value = false;
  e.clearSelection();
  colorCopied.value = true;
  currentColor.value = e.text;
  setTimeout(() => {
    colorCopied.value = false;
  }, 1000);
});

</script>

<template>
  <Transition appear name="copy">
    <div class="container-fluid pt-5" v-if="colorCopied">
      <div class="row">
        <div class="col text-center">
          <span class="bg-dark text-light fw-light rounded-pill px-5 py-3">Color {{ currentColor }} copied to your clipboard</span>
        </div>
      </div>
    </div>
  </Transition>
  <Transition appear name="lock">
    <div class="container-fluid pt-5" v-if="colorStore.showLockedAlert">
      <div class="row">
        <div class="col text-center">
          <span class="bg-danger text-light fw-light rounded-pill px-5 py-3">Color {{ colorStore.colorLocked }} has been {{ colorStore.isLocked }}.</span>
        </div>
      </div>
    </div>
  </Transition>
  <div class="container-fluid pt-5 align-items-center vh-100">
    <div class="row text-center mb-4">
      <h1 class="fw-bolder">Color palette generator</h1>
    </div>
    <div class="row row-cols-1 row-cols-sm-3 row-cols-md-5 mb-4">
      <div class="col mb-3" v-for='(color, index) in colorStore.colors' :key="color">
        <div class="card shadow-sm p-1" style="height: 300px;">
          <div class="card-body d-flex align-items-start justify-content-between p-2" :style="{ backgroundColor: color }">
            <button class="btn btn-transparent border-0 shadow-none text-dark lock" @click="colorStore.lockColor($event, color, index)">
              <font-awesome-icon :icon="['fas', 'unlock']" class="fs-2 unlocked"/>
              <font-awesome-icon :icon="['fas', 'lock']" class="fs-2 locked"/>
            </button>
            <button class="btn btn-transparent border-0 shadow-none text-dark copy" :data-clipboard-target="'#color'+color.substring(1)">
              <font-awesome-icon :icon="['fas', 'copy']" class="fs-2" />
            </button>
          </div>
          <div class="card-footer text-center p-1">
            <p class="mb-0 fw-bold py-2" :class="{'opacity-100': color === currentColor}" :id="'color'+color.substring(1)">{{ color }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="row mb-4">
      <div class="col text-center">
        <button class="btn btn-primary btn-block text-light px-5 py-3" @click="colorStore.createColorPalette">Generate palette</button>
        <p class="small mt-3">Or just press the "Spacebar" to generate new palettes.</p>
      </div>
    </div>
    <div class="row mb-5">
      <div class="col text-center">
        <button class="btn btn-success btn-block text-light px-4 py-2 me-3" @click="colorStore.addColor">Add a color</button>
        <button class="btn btn-danger btn-block text-light px-4 py-2 ms-3" @click="colorStore.removeColor">Remove a color</button>
      </div>
    </div>
    <!-- <div class="row pb-5">
      <div class="col text-center">
        <button class="btn btn-white border-1 border-secondary rounded-pill px-4 py-3 shadow-sm opacity-50">Click to copy individual color. Press "C" to copy last color</button>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
.copy-enter-from, 
.copy-leave-to,
.lock-enter-from,
.lock-leave-to {
  opacity: 0;
  transform: translateY(-200px);
}

.copy-enter-active,
.copy-leave-active,
.lock-enter-active,
.lock-leave-active {
  transition: all 0.3s linear;
}
</style>

