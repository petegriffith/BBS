<template>
  <focus-trap>
    <div class="modal">
      <div class="modal-overlay" @click="$emit('closeModal')"></div>
      <div class="modal-content">
        <header class="modal-header">
          <h2 class="modal-title">
            {{ t('selectNicknameAndCountry') }}
          </h2>
          <i
            title="Close"
            class="close-modal material-icons"
            role="button"
            tabindex="0"
            aria-label="close"
            @click="$emit('closeModal')"
            >close</i
          >
        </header>
        <form class="form-content" role="form">
          <label for="nickname" class="label">{{ t('nickname') }}</label>
          <input
            ref="nicknameInput"
            class="nickname-input"
            :class="{ nickname_error: validateNicknameLength() }"
            type="text"
            name="nickname"
            autocomplete="off"
            maxlength="50"
            v-model="nickname"
          />
          <p v-if="validateNicknameLength()" class="error_message">
            {{ t('nicknameTooLong') }}
          </p>
          <label for="country" class="label">{{ t('country') }}</label>
          <v-select
            :options="countriesObj"
            label="country_name"
            class="country_select"
            :placeholder="t('countrySelectPlaceholder')"
            v-model="selectedCountry"
          >
            <!-- TYPESCRIPT UNKNOWN HERE IS PRETTY JANKY. CHECK GITHUB VUE-SELECT GITHUB ISSUE TO SEE IF PROPER TYPING IS POSSIBLE -->
            <template #option="country: unknown">
              <span v-if="country"
                ><country-flag :country="(country as supportedCountryData).alpha_2" :shadow="true" />
              </span>
              {{ t(`countries.${(country as supportedCountryData).alpha_2}`) }}
            </template>
          </v-select>
          <div
            v-if="validateSubmit()"
            class="ok-button button"
            role="button"
            tabindex="0"
            aria-label="submit"
            @click="emitSetProfile"
          >
            OK
          </div>
          <div v-else class="disabled" aria-disabled>OK</div>
          <div class="cancel-button button" @click="$emit('closeModal')" role="button" tabindex="0" aria-label="cancel">
            {{ t('cancel') }}
          </div>
        </form>
      </div>
    </div>
  </focus-trap>
</template>

<script setup lang="ts">
  import { ref, Ref, defineEmits, onMounted } from 'vue'
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'
  import CountryFlag from 'vue-country-flag-next'
  import { curateCountryList } from '../../global/utility/lang_country'
  import { useI18n } from 'vue-i18n'
  const { t } = useI18n({ useScope: 'global' })

  const nicknameInput = ref<HTMLInputElement>()

  const countriesObj: supportedCountryData[] = curateCountryList()
  const nickname = ref('')
  const selectedCountry: Ref<{} | supportedCountry | null> = ref(null)

  const emit = defineEmits(['closeModal', 'setProfile'])

  onMounted(() => {
    nicknameInput.value?.focus()
  })

  const emitSetProfile = () => {
    const country = selectedCountry.value as supportedCountryData
    const data: emmited_profile_data = {
      nickname: nickname.value,
      selectedCountry: country,
    }
    emit('setProfile', data)
  }

  const validateSubmit = () => {
    if (nickname.value.length > 0 && selectedCountry.value) return true
    else return false
  }

  const validateNicknameLength = () => {
    if (nickname.value.length >= 50) return true
  }
</script>

<style scoped>
  .form-content {
    display: flex;
    flex-direction: column;
    padding-top: 1em;
  }
  .label {
    text-align: left;
    font-weight: bold;
  }

  .country_select {
    margin-bottom: 1em;
    cursor: pointer;
    width: auto;
  }

  .error_message {
    color: red;
    margin: 0;
    text-align: left;
    font-size: 0.7em;
  }

  .nickname-input {
    border: solid 1px rgba(0, 0, 0, 0.6);
    margin-bottom: 1em;
    padding: 1em;
  }

  .nickname_error {
    margin-bottom: 0;
  }

  .button {
    padding: 1em;
    font-weight: bold;
    cursor: pointer;
  }

  .ok-button {
    border: 2px solid black;
  }

  .disabled {
    padding: 1em;
    font-weight: bold;
    border: 2px solid lightgrey;
    color: lightgrey;
  }
</style>
