<template>
  <div>
    <file-upload
      class         = "form__input form__input--file-upload"
      :class        = "{ 'form__input--file-upload-active': rawFile, 'file-upload--box': box }"

      ref           = "upload"
      v-model       = "files"

      :drag         = "true"
      :drop         = "true"
      :size         = "0"

      :accept       = "accept"
      :extensions   = "extensions"
      :multiple     = "multiple"

      @input-filter = "inputFilter"
    >
      <div v-if="!rawFiles.length" class="file-upload-placeholder">
        <slot name="icon"></slot>

        <div class="file-upload__title">
          <slot name="title"></slot>
        </div>
        <div class="file-upload__subtitle">
          <slot name="subtitle"></slot>
        </div>
      </div>
      <div v-show="rawFiles.length" ref="uploadedImagesList" class="uploaded-images scrollable">
        <div ref="addImage" class="uploaded-image-container uploaded-image-container--add-image">
          <div class="add-image"></div>
        </div>
        <div v-for="file in listOfImages" class="uploaded-image-container" @click="remove(file, $event)">
          <div class="uploaded-image-thumb">
            <img :src="file.blob" />
          </div>
          <div class="remove-image"></div>
        </div>
      </div>
    </file-upload>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'

export default {
  name: 'form-images-input',

  components: {
    FileUpload
  },

  props: {
    name: {
      type: String,
      default: undefined
    },

    accept: {
      type: String,
      default: 'image/png,image/gif,image/jpeg,image/webp'
    },

    extensions: {
      type: String,
      default: 'gif,jpg,jpeg,png,webp'
    },

    multiple: {
      type: Boolean,
      default: false
    },

    box: {
      type: Boolean,
      default: false
    },

    value: {
      default: null
    }
  },

  data() {
    return {
      files: [],

      removingFile: false
    }
  },

  computed: {
    rawFiles() {
      return this.files.map((file) => file.file)
    },

    listOfImages() {
      return this.files.slice().reverse()
    },

    rawFile() {
      if (this.files.length) {
        return this.files[0].file
      }
      return undefined
    }
  },

  watch: {
    files: function () {
      this.$nextTick(() => {
        this.$emit('input', this.multiple ? this.rawFiles : this.rawFile)
      })
    }
  },

  created() {
    if (!this.box) {
      window.addEventListener('mousewheel', this.scrollUploadedImagesList.bind(this), { passive: true })
    }
  },

  destroyed() {
    if (!this.box) {
      window.removeEventListener('mousewheel', this.scrollUploadedImagesList.bind(this))
    }
  },

  methods: {
    inputFilter(newFile, oldFile, prevent) {
      if (!newFile) {
        return
      }
      if (!oldFile) {
        // Filter non-image file
        if (!/(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.file.type)) {
          return prevent()
        }
      }
      const URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    },

    remove(file, event) {
      this.removingFile = true
      this.$refs.upload.remove(file)
      event.preventDefault()
    },

    scrollUploadedImagesList(event) {
      if (this.$refs.uploadedImagesList) {
        if (event.path.filter((el) => el && el.className === this.$refs.uploadedImagesList.className).length) {
          this.$refs.uploadedImagesList.scrollLeft += (event.deltaY)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$thumb-size: 115px;

.form__input--file-upload {
  height: 128px;

  display: flex;
  justify-content: center;
  align-items: center;

  background: none;

  border-style: solid;
  border-image-source: url('../../../assets/icons/upload-border.svg');
  border-image-slice: 13;
  border-image-width: 3px;
  border-image-outset: 1;
  border-image-repeat: round;

  &-active {
    justify-content: start;
    margin-top: 15px;
    border: none;
  }
}

.file-upload__title {
  font-weight: bold;
  margin: 15px 0;
}

.file-upload__subtitle {
  font-size: 13px;
}

.form__input--file-upload-active.file-upload--box {
  margin-top: 5px;
  padding: 0;
  margin-left: -10px;

  .uploaded-images {
    flex-flow: row wrap;
    height: 256px;

    .uploaded-image-container {
      padding: 10px;
      margin-left: 0 !important;

      &:not(.uploaded-image-container--add-image) {
        min-width: #{$thumb-size + 20px};
        max-width: #{$thumb-size + 20px};
        width: #{$thumb-size + 20px};
        height: #{$thumb-size + 20px};
      }
      &.uploaded-image-container--add-image {
        margin: 10px !important;
      }

      &::after {
        top: 10px;
        left: 10px;
      }
    }
  }
}

.uploaded-images {
    display: flex;
    overflow: auto;
    height: 128px;
    width: 100%;
}

.uploaded-image-container {
    position: relative;
    min-width: $thumb-size;
    max-width: $thumb-size;
    width: $thumb-size;
    height: $thumb-size;
    cursor: pointer;

    & + & {
      margin-left: 20px;
    }

    &::after {
      content: '';
      position: absolute;
      transition: all .1s;
      top: 0;
      left: 0;
      border-radius: $border-radius;
      width: $thumb-size;
      height: $thumb-size;
    }

    &--add-image {
      border-image-source: url('../../../assets/icons/upload-border.svg');
      border-image-slice: 13;
      border-image-width: 3px;
      border-image-outset: 0;
      border-image-repeat: round;
      border-style: solid;
      &::after {
        border-radius: 0;
      }
    }
}

.uploaded-image-container:not(.uploaded-image-container--add-image):hover::after {
    background: rgba(0, 0, 0, .4);
}

.uploaded-image-thumb {
    border-radius: 6px;
    position: relative;
    height: $thumb-size;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #efefef;
    overflow: hidden;
}

.uploaded-image-thumb > img {
    max-height: $thumb-size;
}

$remove-image-icon-size: 36px;

.remove-image {
    background: url('../../../assets/icons/add.svg') center center no-repeat;
    transform: rotateZ(45deg);
    height: $remove-image-icon-size;
    width: $remove-image-icon-size;
    position: absolute;
    background-size: contain;
    top: calc(50% - #{$remove-image-icon-size / 2});
    left: calc(50% - #{$remove-image-icon-size / 2});
    transition: all .1s;
    z-index: 1;
    opacity: 0;
}
.uploaded-image-container:hover .remove-image {
    opacity: 1;
}

.add-image {
    background: url('../../../assets/icons/add.svg') center center no-repeat;
    height: $remove-image-icon-size;
    width: $remove-image-icon-size;
    position: absolute;
    background-size: contain;
    top: calc(50% - #{$remove-image-icon-size / 2});
    left: calc(50% - #{$remove-image-icon-size / 2});
    transition: all .1s;

    .uploaded-image-container--add-image:hover & {
      filter: brightness(0.95);
    }
}
</style>