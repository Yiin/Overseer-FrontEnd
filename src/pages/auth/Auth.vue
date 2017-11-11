<template>
  <div class="background" :class="{ 'background--fade-out': isAuthenticated }">
    <div ref="formContainer" class="form__container">
      <form ref="form" @submit.prevent="auth" class="form__auth" :style="scalePage">

        <!-- Transition between login and register pages -->
        <div class="form__auth-content">
          <transition name="slow-cross-fade">
            <div v-if="isLoginPage">
              <div class="auth__image"></div>
              <login></login>
            </div>
            <register ref="registrationForm" v-if="isRegisterPage"></register>
          </transition>

          <div class="auth__submit-area">
            <button ref="submitBtn" type="submit" class="auth__submit" :style="authSubmitBtnStyle">
              <span v-if="isLoginPage">
                Sign In
              </span>
              <span v-else-if="isFinalRegistrationStep">
                Finish
              </span>
              <span v-else>
                Next
              </span>
            </button>

            <div class="auth__links">
              <template v-if="isLoginPage">
                <div @click="$router.push({ name: 'register' })" class="auth__link auth__link--registration">
                  Create Account
                </div>
                <div class="auth__link auth__link--password-recovery">
                  Forgot Password?
                </div>
              </template>
              <template v-else>
                <div v-if="!isFirstRegistrationStep" @click="$refs.registrationForm.prevStep" class="auth__link">
                  Back
                </div>
                <div v-else @click="$router.push({ name: 'login' })" class="auth__link auth__link--registration">
                  Back To Sign In
                </div>
              </template>
            </div>
          </div>
        </div>
      </form>
      <div class="fake-btn"></div>
    </div>
  </div>
</template>

<script>
import Login from './Login.vue'
import Register from './Register.vue'
import { getSubdomain } from '@/scripts'
import { TimelineLite } from 'gsap'

export default {
  components: {
    Login,
    Register
  },

  data() {
    return {
      step: 0,
      scale: 1,
      authIsOver: false,

      timeline: null,

      authSubmitBtnStyle: {
        backgroundPosition: ''
      }
    }
  },

  computed: {
    scalePage() {
      return {
        transform: `scale(${this.$store.state.scale.ratio})`
      }
    },

    currentPage() {
      return this.$route.name
    },

    isLoginPage() {
      return this.currentPage === 'login'
    },

    isRegisterPage() {
      return this.currentPage === 'register'
    },

    isFirstRegistrationStep() {
      return this.$store.state.auth.registration.step === 0
    },

    isFinalRegistrationStep() {
      return this.$store.state.auth.registration.step === this.$store.state.auth.registration.steps.length - 1
    },

    currentAnimationStep() {
      return this.$store.state.auth.animation.steps[this.$store.state.auth.animation.currentStep]
    },

    isAuthenticated() {
      return this.$store.state.auth.isLoggedIn
    },

    isLoaded() {
      return this.$store.state.auth.isLoaded
    },

    isRedirecting() {
      return this.$store.state.auth.isRedirecting
    },

    wasRedirected() {
      return this.$store.state.auth.wasRedirected
    },

    ratio() {
      return this.$store.state.scale.ratio
    }
  },

  mounted() {
    window.addEventListener('resize', this.updateBtnBackgroundPosition)
    this.updateBtnBackgroundPosition()
  },

  methods: {
    updateBtnBackgroundPosition() {
      const { btnRect } = this.getRects()
      this.authSubmitBtnStyle.backgroundPosition = `${-btnRect.x}px ${-btnRect.y}px`
    },

    auth() {
      let promise = null
      if (this.isLoginPage) {
        promise = this.login()
        const validationErrors = this.$store.state.auth.login.validationErrors
        if ((validationErrors.username && validationErrors.username.length) ||
            (validationErrors.password && validationErrors.password.length)) {
          return
        }
      } else {
        if (this.isFinalRegistrationStep) {
          promise = this.register()
        } else {
          this.$refs.registrationForm.nextStep()
        }
      }
      if (promise) {
        this.authIsOver = false
        promise.then(() => {
          this.authIsOver = true
        }).catch(() => {
          this.authIsOver = true
        })

        this.beginAuthAnimation(promise)
      }
    },

    /**
     * Helper functions for animation
     */
    getRects() {
      const btnRect = this.$refs.submitBtn.getBoundingClientRect()
      const formRect = this.$refs.form.getBoundingClientRect()

      return { btnRect, formRect }
    },

    getFillingPosition() {
      const { btnRect } = this.getRects()
      return {
        x: btnRect.x,
        y: btnRect.y
      }
    },

    el(className) {
      return document.getElementsByClassName(className)[0]
    },

    /**
     * Hide submit button text, form shadows,
     * position expanding button in the center
     * of submit button
     */
    beginAuthAnimation(promise) {
      this.timeline = new TimelineLite({
        // paused: true,
        onComplete: this.endAuthAnimation.bind(this, promise)
      })

      // Hide form shadows
      this.timeline.to(this.el('form__auth'), 0.1, {
        'box-shadow': '0 24px 69px rgba(0, 0, 0, 0)'
      }, 0)
      // Hide submit button text and shadows
      this.timeline.to(this.el('auth__submit'), 0.1, {
        'transition': 'all .1s',
        'color': 'transparent',
        'box-shadow': '0 4px 6px transparent',
        'text-shadow': '0 0 0 transparent'
      }, 0)

      this.fillAuthAnimation()
    },

    /**
     * Start filling animation,
     * calculate timing and apply transformations.
     */
    fillAuthAnimation() {
      const { formRect } = this.getRects()
      const { x, y } = this.getFillingPosition()
      const time = 700

      // this.timeline.timeScale(0.05)

      const size = Math.sqrt(formRect.width * formRect.width + formRect.height * formRect.height) * 2
      const toX = x - size / 2
      const toY = y - size / 2

      // Change fake button size to fill screen,
      // position it to the top left corner of the screen
      // and translate its position to submit button center
      this.timeline.from(this.el('fake-btn'), 0, {
        'z-index': -1
      })
      this.timeline.fromTo(
        this.el('fake-btn'), time / 1000, {
          'z-index': 1,
          'position': 'absolute',
          'width': 0,
          'height': 0,
          'border-radius': '100%',
          'top': 56 / 2,
          'left': (149) / 2,
          'background-position': `${-x}px ${-y}px`,
          x,
          y
        }, {
          autoRound: false,
          // ease: Power1.easeOut,
          'width': size + 6,
          'height': size + 6,
          'border-radius': '100%',
          'background-position': `${-toX}px ${-toY}px`,
          top: 0,
          left: 0,
          x: toX,
          y: toY
        }
      )

      this.timeline.play()
    },

    endAuthAnimation(promise) {
      if (this.authIsOver) {
        if (this.isAuthenticated) {
          this.authSuccess()
        } else {
          this.authFail()
        }
      } else {
        promise.then(this.authSuccess.bind(this))
          .catch(this.authFail.bind(this))
      }
    },

    authSuccess() {
      if (this.isRedirecting) {
        this.$store.dispatch('auth/REDIRECT')
      } else {
        setTimeout(() => {
          this.$store.dispatch('auth/LOAD')
        }, 1000)
      }
    },

    authFail() {
      this.timeline.reverse()
    },

    login() {
      const siteAddress = getSubdomain()

      return this.$store.dispatch('auth/login/LOGIN', {
        username: this.$store.state.auth.login.fields.username,
        password: this.$store.state.auth.login.fields.password,
        site_address: siteAddress || null
      })
    },

    register() {
      const data = {}

      for (let field in this.$store.state.auth.registration.fields) {
        data[field] = this.$store.state.auth.registration.fields[field].value
      }
      data.company_email = data.email

      return this.$store.dispatch('auth/registration/REGISTER', data)
    }
  }
}
</script>

<style lang="scss">
@mixin smooth($color: $color-main)
{
  transition: all .15s ease;

  box-shadow: 0 4px 6px rgba(0, 0, 0, .11), 0 1px 3px rgba(0, 0, 0, .08);
  text-shadow: 0 1px 3px hsla(hue($color) + 5, saturation($color) + 7, lightness($color) - 11, .4);
  &:hover,
  &:focus,
  &.--hover,
  &.--focus
  {
    transform: translateY(-1px);

    outline: none;
    box-shadow: 0 7px 14px rgba(0, 0, 0, .1), 0 3px 6px rgba(0, 0, 0, .08);
  }
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background: #5866c2;
  background: -moz-linear-gradient(-45deg, #5866c2 0%, #723be1 100%);
  background: -webkit-linear-gradient(-45deg, #5866c2 0%,#723be1 100%);
  background: linear-gradient(135deg, #5866c2 0%,#723be1 100%);
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#5866c2', endColorstr='#723be1', GradientType=1);

  &--fade-out {
    transition: all 0.7s;
    filter: opacity(0);

    .form__auth {
      display: none;
    }
    .fake-btn {
      display: none;
    }
  }
}

.form__container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

$form-auth-width: 890px;
$form-auth-v-padding: 70px;
$form-auth-h-padding: 58px;

.form__auth {
  background: white;
  border-radius: 30px;
  color: #544b65;
  box-shadow: 0 24px 69px rgba(0, 0, 0, 0.2);
  position: relative;
  transition: all 0.8s;

  &--hidden {
    filter: opacity(0);
  }

  .project-name {
    font-weight: 700;
  }

  .auth__input-area {
    width: $form-auth-width - ($form-auth-h-padding * 2);
  }
}

.form__auth-content {
  position: relative;
  border-radius: 30px;
  width: $form-auth-width;
  height: 556px;
  padding: $form-auth-v-padding $form-auth-h-padding;
  overflow: hidden;

  /* fix chrome overflow: hidden bug (https://stackoverflow.com/a/10296258) */
  -webkit-mask-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAA5JREFUeNpiYGBgAAgwAAAEAAGbA+oJAAAAAElFTkSuQmCC);
}

.auth__image {
  position: absolute;
  top: 72px;
  right: -94px;
  background: url(../../assets/images/placeholders/Overview.svg);
  width: 642px;
  height: 526px;
  z-index: 0;
}

.auth__submit-area {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 79px;

  .auth__submit {
    font-family: $primary-font-family;
    font-size: 16px;
    background-image: linear-gradient(135deg, #5866c2 0%, #723be1 100%);
    background-size: 100vw 100vh;
    width: 149px;
    height: 56px;
    margin: 0;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    @include smooth($color-main);
  }

  .auth__link {
    margin-left: 23px;
    font-weight: 600;
    line-height: 130%;
    cursor: pointer;
    &:hover, &:focus {
      color: $color-main;
    }
  }
}

.auth__submit-area {
  height: 56px;
  padding-left: 149px;
}

.auth__submit {
  height: 149px;
  border-radius: 100%;
  position: absolute;
  top: 0;
  left: 0;
  transition: 0.1s;
}

.fake-btn {
  background-image: linear-gradient(135deg, #5866c2 0%, #723be1 100%);
  background-size: 100vw 100vh;
}
</style>