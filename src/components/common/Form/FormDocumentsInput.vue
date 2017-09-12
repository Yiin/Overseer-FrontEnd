<template>
  <div>
    <file-upload
      class         = "form__input form__input--file-upload"
      :class        = "{ 'file-upload--active': files.length }"

      ref           = "upload"
      v-model       = "files"

      :drag         = "true"
      :drop         = "true"
      :size         = "0"

      :accept       = "accept"
      :extensions   = "extensions"
      :multiple     = "multiple"
    >
      <div v-if="!rawFiles.length" class="file-upload-placeholder">
        <slot name="icon"></slot>

        <div class="file-upload__title">
          <slot name="title">
            Click here
          </slot>
        </div>
      </div>
      <div v-show="rawFiles.length" ref="uploadedFilesList" class="uploaded-files scrollable">
        <div ref="addFile" class="uploaded-files-container uploaded-files-container--add-file">
          <div class="add-file"></div>
        </div>
        <table>
          <tbody>
            <tr v-for="(file, index) in listOfFiles">
              <td><input type="checkbox" class="checkbox checkbox--center"></td>
              <td class="primary">{{ file.name }}</td>
              <td>Stanislovas Janonis</td>
              <td>Just now</td>
              <td>{{ file.size }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </file-upload>
  </div>
</template>

<script>
import FileUpload from 'vue-upload-component'
import numeral from 'numeral'

export default {
  name: 'form-documents-input',

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
      default: undefined
    },

    extensions: {
      type: String,
      default: undefined
    },

    multiple: {
      type: Boolean,
      default: true
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

    listOfFiles() {
      return this.files.slice().reverse().map((file) => {
        file.size = numeral(file.size).format('0.0 b')
        return file
      })
    }
  },

  watch: {
    files: function () {
      this.$nextTick(() => {
        this.$emit('input', this.rawFiles)
      })
    }
  },

  methods: {
    remove(file, event) {
      this.removingFile = true
      this.$refs.upload.remove(file)
      event.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
.form__input--file-upload {
  height: 380px;
  border: none;
}
.uploaded-files {
  height: 350px;
}

.file-upload-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
}

table {
  width: 100%;
}

th {
  padding: 10px 15px;
  text-align: left;
}

td {
  text-align: left;
  padding: 5px 15px 10px;
}
</style>