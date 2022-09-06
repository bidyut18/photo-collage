<script setup lang="ts">
import { UploadedImage } from "./logic/vueLogic";

defineProps<{
  collageGrid: "3x2" | "3x3";
  spacing: string;
  imgSrcs: UploadedImage[];
}>();
</script>
<template>
  <section class="">
    <div class="tile is-ancestor" v-if="imgSrcs.length >= 3">
      <div class="tile is-horizontal is-8">
        <div class="tile">
          <img
            width="100"
            height="100"
            v-for="img in imgSrcs.slice(0, 3)"
            :src="img.imgSrc"
            class="tile box"
          />
        </div>
      </div>
    </div>
    <div class="tile is-ancestor" v-if="imgSrcs.length >= 6">
      <div class="tile is-horizontal is-8">
        <div class="tile">
          <img
            width="100"
            height="100"
            v-for="img in imgSrcs.slice(3, 6)"
            :src="img.imgSrc"
            class="tile box"
          />
        </div>
      </div>
    </div>
    <div
      v-if="collageGrid == '3x3' && imgSrcs.length == 9"
      class="tile is-ancestor"
    >
      <div class="tile is-horizontal is-8">
        <div class="tile">
          <img
            width="100"
            height="100"
            v-for="img in imgSrcs.slice(6, 9)"
            :src="img.imgSrc"
            class="tile box"
          />
        </div>
      </div>
    </div>
  </section>
</template>
<style scoped>
img {
  padding: 0;
}
.box {
  border-radius: 1px;
}
@media (max-width: 800px) {
  .tile {
    display: flex;
  }
}
.tile > img {
  margin: v-bind("spacing");
}
</style>
