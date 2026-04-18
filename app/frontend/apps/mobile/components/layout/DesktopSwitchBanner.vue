<!-- Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/ -->

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import CommonAlert from '#shared/components/CommonAlert/CommonAlert.vue'
import { useTouchDevice } from '#shared/composables/useTouchDevice.ts'

const { isTouchDevice } = useTouchDevice()

const isDesktop = computed(() => !isTouchDevice.value)

const route = useRoute()

const desktopLink = computed(() => {
  const ticketRoutes = new Set([
    'TicketDetailArticlesView',
    'TicketDetailView',
    'TicketInformationView',
  ])

  const routeName = route.name as string
  if (ticketRoutes.has(routeName)) {
    const { internalId } = route.params
    if (internalId) return `/#ticket/zoom//${internalId}`
  }

  return '/#'
})
</script>

<template>
  <CommonAlert v-if="isDesktop" variant="info" dismissible class="rounded-none px-4 py-3">
    {{ $t('Are you on a desktop computer?') }}
    <a :href="desktopLink" class="ms-1 font-bold underline">
      {{ $t('Switch to Desktop Version') }}
    </a>
  </CommonAlert>
</template>
