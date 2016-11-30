<template>
  <form @submit.prevent="handleFormSubmit">
    <fieldset>
      <legend>Your username is: '{{ username }}'</legend>
      <input type="text" name="username" placeholder="Change username..." required>
      <input type="submit">
    </fieldset>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import * as userTypes from '../store/modules/user/types'

export default {
  methods: {
    ...mapActions({
      changeUsername: userTypes.CHANGE_USERNAME
    }),
    handleFormSubmit(e) {
      this.changeUsername(e.target.username.value)
    }
  },
  computed: {
    ...mapGetters({
      username: userTypes.USERNAME
    })
  }
}
</script>
