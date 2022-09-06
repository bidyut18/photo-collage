<script setup lang="ts">
let fileName = $ref<string | undefined>("No image selected");
defineProps<{
  uploadDisble: boolean;
}>();
const input = $ref<any | null>(null);
const emit = defineEmits<{
  (event: "fileLaunch", file: [File, Blob]): void;
}>();

const handleFileUpload = (ev: Event) => {
  const reader = new FileReader();
  reader.readAsDataURL(input?.files[0]);
  reader.onload = (event: any) => {
    const imageElement = document.createElement("img");
    imageElement.src = event.target.result;
    imageElement.onload = (e: any) => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 400;
      const scaleSize = MAX_WIDTH / e.target.width;
      canvas.width = MAX_WIDTH;
      canvas.height = e.target.height * scaleSize;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blb) => {
        if (blb) {
          const target = ev.target as HTMLInputElement;

          const files = target.files as FileList;
          if (
            (files?.item(0)?.type as string) == "image/jpeg" ||
            (files?.item(0)?.type as string) == "image/png"
          ) {
            fileName = files?.length
              ? files?.item(0)?.name
              : "No file uploaded";

            emit("fileLaunch", [files[0], blb]);
          }
        } else {
          alert("Image is not accepted");
        }
      });
    };
  };
};
</script>
<template>
  <section class="column">
    <div class="file is-normal has-name">
      <label class="file-label">
        <input
          class="file-input"
          ref="input"
          contain
          height="300"
          width="200"
          type="file"
          :disabled="uploadDisble"
          name="resume"
          accept=".jpg,.jpeg,.png"
          v-on:change="handleFileUpload"
        />
        <span class="file-cta">
          <span class="file-icon">
            <i class="fas fa-upload"></i>
          </span>
          <span class="file-label"> Normal file… </span>
        </span>
        <span class="file-name"> {{ fileName?.slice(0, 18) }}</span>
      </label>
    </div>
  </section>
</template>
