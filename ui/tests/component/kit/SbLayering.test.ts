import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SbDialog from '@/kit/SbDialog.vue'
import SbDrawer from '@/kit/SbDrawer.vue'

/** The z-index of the layer the component puts on the page (its outermost fixed element). */
function layerZ(root: Element): number {
  const cls = [...root.classList].find((c) => /^z-\d+$/.test(c))
  return cls ? Number(cls.slice(2)) : 0
}

describe('layering', () => {
  it('puts a dialog above an open drawer', async () => {
    // A confirmation opened from a speaker's details (a drawer) must be
    // clickable. Both used the same layer, and the dialog — mounted at app
    // start — ended up under the drawer's backdrop.
    const drawer = mount(SbDrawer, {
      props: { modelValue: true, title: 'Speaker' },
      global: { stubs: { Teleport: true } },
    })
    const dialog = mount(SbDialog, {
      props: { modelValue: true, title: 'Remove?' },
      global: { stubs: { Teleport: true } },
    })
    await nextTick()
    await nextTick()
    const drawerLayer = drawer.find('.fixed.inset-0').element
    const dialogLayer = dialog.find('.fixed.inset-0').element
    expect(layerZ(dialogLayer)).toBeGreaterThan(layerZ(drawerLayer))
  })
})
