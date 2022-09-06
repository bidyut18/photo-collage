<script setup lang="ts">
import { computed, reactive } from "vue";
import { urlMaker, UploadedImage } from "./logic/vueLogic";

import FileUploader from "./uploadChild/FileUploader.vue";

import UploadPreviewer from "./uploadChild/UploadPreviewer.vue";
import Previewer from "./Previewer.vue";
import Downloader from "./uploadChild/Downloader.vue";

let imageData = reactive<{
  collageGrid: "3x2" | "3x3";
  spacing: number;
  imgSrcs: UploadedImage[]; //real images
  currentImageKey: string | null;
}>({
  collageGrid: "3x2",
  spacing: 1.75,
  imgSrcs: [],
  currentImageKey: null,
});
let imgNumber = computed<6 | 9>(() => (imageData.collageGrid == "3x2" ? 6 : 9));

const fileUrlHandler = (event: [File, Blob]) => {
  let imgKey = `${event[0].type}k${event[0].name}l${event[0].size}`;
  imageData.currentImageKey = imgKey;
  imageData.imgSrcs.push({
    imgName: event[0].name,
    imgSrc: urlMaker(event[0]),
    imgKey: imgKey,
    resizedBlob: event[1],
  });
};

const imageDelete = (key: string) => {
  if (imageData.imgSrcs.length > 0) {
    imageData.imgSrcs = imageData.imgSrcs.filter((item) => item.imgKey !== key);
    imageData.currentImageKey =
      imageData.imgSrcs.length > 0
        ? imageData.imgSrcs[imageData.imgSrcs.length - 1].imgKey
        : null;
  }
};
</script>

<template>
  <section class="section is-medium">
    <div class="column is-flex is-flex-direction-column">
      <div class="uploadPreview">
        <div class="is-mobile">
          <FileUploader
            @file-launch="fileUrlHandler"
            :upload-disble="imgNumber == imageData.imgSrcs.length"
          />
          <div v-if="imageData.imgSrcs.length > 0">
            <img
              width="400"
              heigth="500"
              :src="imageData.imgSrcs[imageData.imgSrcs.length - 1].imgSrc"
            />
          </div>
        </div>

        <div class="uploadView" v-if="imageData.imgSrcs.length > 0">
          <UploadPreviewer
            v-bind="img"
            v-for="img in imageData.imgSrcs"
            :key="img.imgKey"
            @delete="imageDelete"
          />
        </div>
      </div>

      <div class="control is-flex is-flex-direction-column">
        <div class="column">
          <label class="radio">
            <input
              type="radio"
              name="answer"
              v-model="imageData.collageGrid"
              value="3x2"
            />
            3x2
          </label>
          <label class="radio">
            <input
              type="radio"
              name="answer"
              v-model="imageData.collageGrid"
              value="3x3"
            />
            3x3
          </label>
        </div>

        <input
          v-model="imageData.spacing"
          class="slider is-fullwidth"
          step="0.05"
          min="0"
          max="5"
          type="range"
        />
      </div>
    </div>
    <div class="column">
      <Previewer
        :collage-grid="imageData.collageGrid"
        :img-srcs="imageData.imgSrcs"
        :spacing="imageData.spacing + 'px'"
      />
    </div>
    <div class="column">
      <Downloader
        :collage-grid="imageData.collageGrid"
        :img-srcs="imageData.imgSrcs"
        :img-spacing="Number(imageData.spacing)"
      />
    </div>
  </section>
</template>

<style scoped>
@media (min-width: 1024px) {
  .uploadPreview {
    display: flex;
    justify-content: space-between;
  }
  .control {
    max-width: 20%;
  }
  .uploadView {
    width: 70%;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
