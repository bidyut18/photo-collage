<script setup lang="ts">
const props = defineProps<{
  imgName: string;
  imgSrc: string;
  imgKey: string;
}>();

const emit = defineEmits<{
  (event: "delete", key: string): void;
}>();
const deleteBtn = () => {
  emit("delete", props.imgKey);
};
</script>
<template>
  <div class="card mb-1">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-32x32 is-3by2">
            <img :src="imgSrc" alt="Placeholder image" />
          </figure>
        </div>
        <div class="media-content">
          <p>
            {{
              imgName.length > 10
                ? imgName.slice(0, 8) +
                  ".. " +
                  imgName.substring(imgName.length - 4)
                : imgName
            }}
          </p>
        </div>
        <button
          class="delete m-1"
          aria-label="delete"
          @click="deleteBtn"
        ></button>
      </div>
    </div>
  </div>
</template>
<style scoped>
@media (min-width: 1024px) {
  .card {
    width: fit-content;
    max-height: 5rem;
    margin-left: 1rem;
  }
}

p {
  font-size: large;
  font-family: "Open Sans", sans-serif;
}
</style>
