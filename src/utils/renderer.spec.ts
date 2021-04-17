/* eslint-disable no-underscore-dangle */
import { DefaultRenderer } from '@renderer/default.renderer'
import { SilentRenderer } from '@renderer/silent.renderer'
import { VerboseRenderer } from '@renderer/verbose.renderer'
import { getRenderer } from '@utils/renderer'

// eslint-disable-next-line import/order
import rewire = require('rewire')

describe('renderers', () => {
  it('should return default renderer', async () => {
    expect(getRenderer('default').renderer.name).toEqual(DefaultRenderer.name)
  })

  it('should return default renderer', async () => {
    expect(getRenderer('verbose').renderer.name).toEqual(VerboseRenderer.name)
  })

  it('should return silent renderer', async () => {
    expect(getRenderer('silent').renderer.name).toEqual(SilentRenderer.name)
  })

  it('should return verbose renderer if non-tty', async () => {
    const renderer = rewire('@utils/renderer')

    renderer.__set__(
      'isRendererSupported',
      jest.fn(() => false)
    )

    expect(renderer.__get__('getRenderer')('default', 'verbose').renderer.name).toEqual(VerboseRenderer.name)
    expect(renderer.__get__('isRendererSupported')).toBeCalledTimes(1)
  })

  it('should evaluate the fallback and return fallback renderer', async () => {
    const renderer = rewire('@utils/renderer')

    renderer.__set__(
      'isRendererSupported',
      jest.fn(() => true)
    )

    expect(renderer.__get__('getRenderer')('default', 'verbose', 3 > 0).renderer.name).toEqual(VerboseRenderer.name)
  })

  it('should evaluate the fallback and return default renderer', async () => {
    const renderer = rewire('@utils/renderer')

    renderer.__set__(
      'isRendererSupported',
      jest.fn(() => true)
    )

    expect(renderer.__get__('getRenderer')('default', 'verbose', 3 < 0).renderer.name).toEqual(DefaultRenderer.name)
  })

  it('should return default renderer if tty', async () => {
    const renderer = rewire('@utils/renderer')

    renderer.__set__(
      'isRendererSupported',
      jest.fn(() => true)
    )

    expect(renderer.__get__('getRenderer')('default', 'verbose').renderer.name).toEqual(DefaultRenderer.name)
    expect(renderer.__get__('isRendererSupported')).toBeCalledTimes(1)
  })

  it('should return default renderer when no renderer by that name exists', async () => {
    const renderer = rewire('@utils/renderer')

    expect(renderer.__get__('getRendererClass')('does-not-exists').name).toEqual(DefaultRenderer.name)
  })

  it('should return default renderer when renderer by that name exists', async () => {
    const renderer = rewire('@utils/renderer')

    expect(renderer.__get__('getRendererClass')('verbose').name).toEqual(VerboseRenderer.name)
  })

  it('should return the given renderer class if specified', async () => {
    const renderer = rewire('@utils/renderer')

    expect(renderer.__get__('getRendererClass')(VerboseRenderer).name).toEqual(VerboseRenderer.name)
  })
})
