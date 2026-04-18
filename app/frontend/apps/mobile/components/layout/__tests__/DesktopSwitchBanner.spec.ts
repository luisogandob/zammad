// Copyright (C) 2012-2026 Zammad Foundation, https://zammad-foundation.org/

import { flushPromises } from '@vue/test-utils'

import { renderComponent } from '#tests/support/components/index.ts'
import { getTestRouter } from '#tests/support/components/renderComponent.ts'

import DesktopSwitchBanner from '../DesktopSwitchBanner.vue'

const mockPointerCoarseMediaQuery = (isTouchDevice: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => {
      return {
        matches: query === '(pointer: coarse)' ? isTouchDevice : false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }
    }),
  })
}

describe('DesktopSwitchBanner', () => {
  it('does not render on touch (mobile) devices', () => {
    mockPointerCoarseMediaQuery(true)

    const view = renderComponent(DesktopSwitchBanner, { router: true })

    expect(view.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('renders banner on non-touch (desktop) devices', () => {
    mockPointerCoarseMediaQuery(false)

    const view = renderComponent(DesktopSwitchBanner, { router: true })

    expect(view.getByRole('alert')).toBeInTheDocument()
    expect(view.getByText('Are you on a desktop computer?')).toBeInTheDocument()
    expect(view.getByText('Switch to Desktop Version')).toBeInTheDocument()
  })

  it('links to desktop home when not on a ticket route', () => {
    mockPointerCoarseMediaQuery(false)

    const view = renderComponent(DesktopSwitchBanner, { router: true })

    const link = view.getByText('Switch to Desktop Version')
    expect(link.closest('a')).toHaveAttribute('href', '/#')
  })

  it('links to the desktop ticket view when on a ticket route', async () => {
    mockPointerCoarseMediaQuery(false)

    const view = renderComponent(DesktopSwitchBanner, {
      router: true,
      routerRoutes: [
        {
          path: '/tickets/:internalId',
          name: 'TicketDetailArticlesView',
          component: { template: '<div />' },
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'Error',
          component: { template: '<div />' },
        },
      ],
    })

    const router = getTestRouter()
    await router.push('/tickets/42')
    await flushPromises()

    const link = view.getByText('Switch to Desktop Version')
    expect(link.closest('a')).toHaveAttribute('href', '/#ticket/zoom//42')
  })

  it('can be dismissed', async () => {
    mockPointerCoarseMediaQuery(false)

    const view = renderComponent(DesktopSwitchBanner, { router: true })

    expect(view.getByRole('alert')).toBeInTheDocument()

    await view.events.click(view.getByLabelText('Dismiss alert'))

    expect(view.queryByRole('alert')).not.toBeInTheDocument()
  })
})
