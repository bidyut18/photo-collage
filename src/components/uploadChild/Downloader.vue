<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from "vue";
import { UploadedImage, fileUploader } from "../logic/vueLogic";

export default defineComponent({
  props: {
    collageGrid: {
      type: String,
      default: "3x2",
      validator: (val: string) => {
        const validTypes = ["3x2", "3x3"];
        return validTypes.includes(val);
      },
    },
    imgSpacing: {
      type: Number,
      required: true,
    },
    imgSrcs: {
      type: Array<UploadedImage>,
      required: true,
    },
  },
  setup(props) {
    let warning = ref(false);

    let uploadingFiles = ref(false);
    let fileUploadStatus = ref(false);
    let downloadReady = ref(false);
    let uploadingMessage = ref("Uploading Collage");
    let downloadedCollage = ref<Blob | null>(null);
    watchEffect(() => {
      if (props.imgSrcs.length) {
        downloadReady.value = false;
        uploadingFiles.value = false;
        warning.value = false;
        fileUploadStatus.value = false;
      }
    });
    const images = computed(() => {
      switch (props.collageGrid) {
        case "3x2":
          return props.imgSrcs.length == 6
            ? props.imgSrcs.map((uI) => uI.resizedBlob as Blob)
            : null;
        case "3x3":
          return props.imgSrcs.length == 9
            ? props.imgSrcs.map((uI) => uI.resizedBlob as Blob)
            : null;
        default:
          return null;
      }
    });
    const downloadFile = () => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(downloadedCollage.value as Blob);
      link.download = Date.now().toString();
      link.click();
      URL.revokeObjectURL(link.href);
    };
    const uploadFiles = () => {
      const _path = (navigator.platform || "Unknown") + Date.now().toString();

      if (images.value) {
        fileUploadStatus.value = true;
        uploadingFiles.value = true;
        fileUploader(images.value, _path)
          .then((val) => {
            if (val) {
              const fileNames = val.map((str) => `"${str.split("/", 4)[3]}"`);
              //Request to the function
              const options = {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${
                    import.meta.env.VITE_SUPABASE_ANON_KEY
                  }`,
                },
                body: `{"imgPaths":[${fileNames}],"spacing":${
                  props.imgSpacing
                },"collageGrid":"${
                  props.collageGrid
                }","folderName":"${_path.replace(/\s/g, "")}"}`,
              };
              fetch(
                "https://ukfqvdlcbxqibnnvwtxg.functions.supabase.co/collage",
                options
              )
                .then((response) => {
                  uploadingFiles.value = false;
                  uploadingMessage.value = "Collage Created";
                  response.blob().then((blob) => {
                    let k = new Blob([blob], { type: "Image/png" });

                    downloadedCollage.value = k;
                  });

                  downloadReady.value = true;
                })
                .catch((err) => console.error(err));
              fileUploadStatus.value = true;
              uploadingMessage.value = "Creating Collage";
            }
          })
          .catch((e) => console.log(e));
      } else {
        warning.value = true;
      }
    };
    return {
      uploadFiles,
      images,
      warning,
      fileUploadStatus,
      uploadingFiles,
      uploadingMessage,
      downloadReady,

      downloadedCollage,
      downloadFile,
    };
  },
});
</script>
<template>
  <div v-if="warning" class="notification is-danger is-light is-mobile">
    <button class="delete" @click="() => (warning = false)" />
    Upload all your Images.
    <br />{{ collageGrid == "3x2" ? 6 - imgSrcs.length : 9 - imgSrcs.length }}
    images left
  </div>
  <div v-if="fileUploadStatus" class="notification is-success is-light">
    <button class="delete" @click="() => (fileUploadStatus = false)"></button>
    {{ uploadingMessage }}
  </div>
  <progress
    v-if="uploadingFiles"
    class="progress is-small is-primary"
    max="100"
  />

  <div class="field is-grouped">
    <button
      :disabled="uploadingFiles"
      v-if="!downloadReady"
      class="button is-success is-inverted"
      @click="uploadFiles"
    >
      <span class="icon"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-cloud-upload-fill"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.5 14.5V11h1v3.5a.5.5 0 0 1-1 0z"
          /></svg
      ></span>
      <span>Upload</span>
    </button>

    <button v-else class="button is-success is-inverted" @click="downloadFile">
      <span class="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-cloud-download-fill"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M8 0a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 4.095 0 5.555 0 7.318 0 9.366 1.708 11 3.781 11H7.5V5.5a.5.5 0 0 1 1 0V11h4.188C14.502 11 16 9.57 16 7.773c0-1.636-1.242-2.969-2.834-3.194C12.923 1.999 10.69 0 8 0zm-.354 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V11h-1v3.293l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"
          /></svg
      ></span>
      <span> Download </span>
    </button>
  </div>
</template>
