<template lang="pug">
  .acceptInvitation
    .acceptInvitation-col
      img(:src='picture')

      h3
        small Invitation for
        | {{ fullName }}
        .username {{ username }}

      .acceptInvitation-form
        v-text-field(
          label='First Name'
          v-model='firstName'
          :error-messages='errors.firstName'
          data-lpignore='true'
        )
        v-text-field(
          label='Last Name'
          v-model='lastName'
          data-lpignore='true'
        )
        v-text-field(
          label='Phone'
          v-model='phone'
          data-lpignore='true'
        )
        v-text-field(
          label='Job Title'
          v-model='jobTitle'
          :error-messages='errors.jobTitle'
          data-lpignore='true'
        )
        v-text-field(
          :label='passwordText'
          v-model='password'
          :error-messages='errors.password'
          type='password'
          data-lpignore='true'
        )
        .button.button--create(@click='submit') Save
</template>

<script>
export default {
  data() {
    const {
      username,
      is_password_set: isPasswordSet,
      personal_information: personalInformation
    } = this.$store.state.preloadedData.user || {
      username: '',
      is_password_set: false,
      personal_information: {}
    }

    return {
      profilePicture: personalInformation.profile_picture,
      username,
      isPasswordSet,
      firstName: personalInformation.first_name,
      lastName: personalInformation.last_name,
      phone: personalInformation.phone,
      jobTitle: personalInformation.job_title,
      password: '',

      errors: {
        invitationToken: [],
        firstName: [],
        jobTitle: [],
        password: []
      }
    }
  },

  computed: {
    picture() {
      return this.profilePicture || require('@/assets/images/placeholders/profile-placeholder.svg')
    },

    fullName() {
      return `${this.firstName} ${this.lastName}`
    },

    passwordText() {
      if (this.isPasswordSet) {
        return 'Enter password'
      } else {
        return 'Create new password'
      }
    }
  },

  mounted() {
    if (!this.$store.state.preloadedData.user) {
      this.$store.commit('auth/SET_ACCEPTING_INVITATION', false)
      return this.$router.push('/')
    }
  },

  methods: {
    submit() {
      this.$store.dispatch('auth/ACCEPT_INVITATION', {
        data: {
          invitation_token: this.$route.params.token,
          first_name: this.firstName,
          last_name: this.lastName,
          phone: this.phone,
          job_title: this.jobTitle,
          password: this.password
        }
      }).catch((response) => {
        if (response.body.message === 'invalid_credentials') {
          this.errors.password = [
            this.isPasswordSet
              ? 'Invalid password.'
              : 'Please enter new password.'
          ]
        } else {
          if (!response.body.messages) {
            // why did we got exception?
            return
          }

          [ { key: 'data.first_name', errorField: 'firstName' },
            { key: 'data.job_title', errorField: 'jobTitle' },
            { key: 'data.password', errorField: 'password' }
          ].forEach(({ key, errorField }) => {
            if (key in response.body.messages) {
              this.errors[errorField] = [response.body.messages[key]]
            } else {
              this.errors[errorField] = []
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">

.acceptInvitation {
  display: flex;
  justify-content: center;
  padding-top: 100px;

  .username {
    font-size: 17px;
    text-transform: lowercase;
    margin-top: 6px;
  }

  img {
    max-width: 128px;
    max-height: 128px;
    border: 6px solid rgba(0,0,0,0.1);
    border-radius: 50%;
  }

  .button {
    margin-top: 25px;
  }

  .signOutLink {
    margin-top: 15px;
    font-weight: 600;
    line-height: 130%;
    text-transform: capitalize;
    &:hover, &:focus {
      color: $color-main;
    }
  }
}

.acceptInvitation-col {
  width: 360px;
  text-align: center;
}

.acceptInvitation h3 {
  margin-top: 20px;
  font-size: 25px;
  font-weight: 500;
  line-height: 1.1;
  color: #333;
}

.acceptInvitation h3 small {
  font-size: 13px;
  display: block;
  margin-bottom: 15px;
  font-weight: 400;
  line-height: 1;
  color: #777;
}

.acceptInvitation-form {
  margin: 0 auto;
  margin-top: 20px;
}
</style>