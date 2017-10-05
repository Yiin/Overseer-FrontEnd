<template>
  <div v-show="step !== 3" class="background" :class="{ 'background--active': step === 2 }">
    <div class="background__left"></div>
    <div class="background__right"></div>
    <transition name="fade">
      <div v-if="step === 0 && !wait" class="form__container">
        <form @submit.prevent="login" class="form__auth">
          <div class="auth__image"></div>
          <div class="auth__input-area">
            <h1 class="auth__title">
              Welcome to <span class="project-name">Overseer,</span><br>
              please sign in
            </h1>

            <input
              v-model="username"
              type="text"
              placeholder="Username"
              class="form__input form__input--auth form__input--username"
            >

            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="form__input form__input--auth form__input--password"
            >

            <div class="auth__submit-area">
              <button type="submit" class="auth__submit">
                Demo
              </button>

              <div class="auth__registration-area">
                <div class="auth__link auth__link--registration">
                  Create Account
                </div>
                <div class="auth__link auth__link--password-recovery">
                  Password Recovery
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        step: 0,
        wait: true
      }
    },

    mounted() {
      this.wait = false
    },

    methods: {
      login() {
        // const siteAddress = this.getSubdomain(window.location.hostname)
        // const { username, password } = this

        this.$emit('start-transition')
        this.$store.dispatch('LOGIN_DEMO').then(() => {
          this.step = 1

          setTimeout(() => {
            window.requestAnimationFrame(() => {
              this.step = 2
              setTimeout(() => {
                this.$emit('end-transition')
                this.step = 3
              }, 800)
            })
          }, 600)
        })
      },

      getSubdomain(hostname) {
        let regexParse = new RegExp('[a-z\\-0-9]{2,63}\\.[a-z\\.]{2,5}$')
        let urlParts = regexParse.exec(hostname)
        return hostname.replace(urlParts[0], '').slice(0, -1)
      }
    }
  }
</script>

<style lang="scss" scoped>

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
  &__left {
    background: url(../../assets/images/background/left.svg);
    left: -1px;
    .background--active & {
      transform: translateX(-50vw);
    }
  }
  &__right {
    background: url(../../assets/images/background/right.svg);
    left: calc(50vw - 1px);
    .background--active & {
      transform: translateX(50vw);
    }
  }

  &__left, &__right {
    position: absolute;
    background-size: cover;
    width: calc(50vw + 2px);
    height: 100vh;
    transition: all 0.8s linear;
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

.form__auth {
  background: white;
  border-radius: 30px;
  width: 890px;
  height: 555px;
  color: #544b65;
  padding: 85px 58px;
  box-shadow: 0 24px 69px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;

  .project-name {
    font-weight: 700;
  }
}

.auth__title {
  font-size: 30px;
  font-weight: normal;
  letter-spacing: -1px;
  line-height: 125%;
  margin: 0;
}

.auth__input-area {
  position: relative;
}

.form__input--auth {
  display: block;
  width: 300px;
  height: 50px;
  border-radius: 8px;
  border: 1px solid $color-oslo-gray;

  &:focus {
    outline: none;
  }

  &.form__input--username {
    margin-top: 53px;
  }

  &.form__input--password {
    margin-top: 19px;
  }
}

.auth__submit-area {
  margin-top: 72px;
  display: flex;
  align-items: center;

  .auth__submit {
    font-family: $primary-font-family;
    font-size: 16px;
    // @include gradient-background;
    background: $color-main;
    width: 146px;
    height: 55px;
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
    &--password-recovery {
      padding-top: 1px;
    }
  }
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
</style>