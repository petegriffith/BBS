<template>
  <div class="modal">
    <div class="overlay"></div>
    <div class="modal_content">
      <h2 class="modal_title">{{ $t('selectNicknameAndCountry') }}</h2>
      <form class="form-content" role="form">
        <label for="nickname" class="label">{{ $t('nickname') }}</label>
        <input class="input-box nickname-input" type="text" name="nickname" autocomplete="off" v-model="nickname" />
        <!-- HAVE TO GET THE SELECT TO HAVE A DEFAULT VALUE -->
        <label for="country" class="label">{{ $t('country') }}</label>
        <v-select :options="countriesObj" label="country_name" class="country_select" v-model="selectedCountry">
          <template v-slot:option="country">
            <span><country-flag :country="country.alpha_2" shadow="true" /></span>
            {{ country.country_name }}
          </template>
        </v-select>
        <div v-if="nickname.length > 0" class="ok-button button" role="button" @click="emitSetProfile">OK</div>
        <div v-else class="disabled" role="button">OK</div>
        <div class="cancel-button button" @click="$emit('closeModal')" role="button">{{ $t('cancel') }}</div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, Ref, defineEmits, VNode } from 'vue'
  import vSelect from 'vue-select'
  import 'vue-select/dist/vue-select.css'
  import CountryFlag from 'vue-country-flag-next'
  import { curateCountryList } from '../../global/utility/lang_country'

  const countriesObj: supportedCountryData[] = curateCountryList()
  const nickname = ref('')
  const selectedCountry: Ref<{} | supportedCountry> = ref({})

  const emit = defineEmits(['closeModal', 'setProfile'])

  const emitSetProfile = () => {
    const country = selectedCountry.value as supportedCountryData
    const data: emmited_profile_data = { nickname: nickname.value, selectedCountry: country }
    emit('setProfile', data)
  }
</script>

<style scoped>
  .modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 990;
  }

  .modal .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 995;
    background: rgba(0, 0, 0, 0.85);
  }

  .modal .modal_content {
    z-index: 999;
    position: absolute;
    top: 50%;
    left: 50%;
    padding: 20px;
    transform: translate(-50%, -50%);
    max-height: 100vh;
    background: #fff;
    box-sizing: border-box;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.7);
    border-radius: 4px;
    width: 100%;
    max-width: 50vw;
  }

  .modal_title {
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    font-weight: bold;
  }
  .form-content {
    display: flex;
    flex-direction: column;
    padding-top: 1em;
  }
  .label {
    text-align: left;
    font-weight: bold;
  }

  .input-box {
    padding: 1em;
    margin-bottom: 1em;
  }

  .country_select {
    margin-bottom: 1em;
    cursor: pointer;
  }

  .flag_icon {
    height: 1em;
  }

  .nickname-input {
    border: solid 1px rgba(0, 0, 0, 0.6);
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
