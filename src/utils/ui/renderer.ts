import type { ListrOptions } from '@interfaces/listr.interface'
import type { SupportedRenderer, ListrRendererFactory, ListrRendererValue, ListrRenderer } from '@interfaces/renderer.interface'
import { DefaultRenderer } from '@renderer/default.renderer'
import { SilentRenderer } from '@renderer/silent.renderer'
import { SimpleRenderer } from '@renderer/simple.renderer'
import { TestRenderer } from '@renderer/test.renderer'
import { VerboseRenderer } from '@renderer/verbose.renderer'
import { assertFunctionOrSelf } from '@utils/assert'

const RENDERERS: Record<'default' | 'simple' | 'verbose' | 'test' | 'silent', typeof ListrRenderer> = {
  default: DefaultRenderer,
  simple: SimpleRenderer,
  verbose: VerboseRenderer,
  test: TestRenderer,
  silent: SilentRenderer
}

function isRendererSupported (renderer: ListrRendererFactory): boolean {
  return process.stdout.isTTY === true || renderer.nonTTY === true
}

export function getRendererClass (renderer: ListrRendererValue): ListrRendererFactory {
  if (typeof renderer === 'string') {
    return RENDERERS[renderer] ?? RENDERERS.default
  }

  return typeof renderer === 'function' ? renderer : RENDERERS.default
}

export function getRenderer (
  renderer: ListrRendererValue,
  fallbackRenderer?: ListrRendererValue,
  fallbackCondition?: ListrOptions['rendererFallback'],
  silentCondition?: ListrOptions['rendererSilent']
): SupportedRenderer {
  if (assertFunctionOrSelf(silentCondition)) {
    return { renderer: getRendererClass('silent'), nonTTY: true }
  }

  const r = { renderer: getRendererClass(renderer), nonTTY: false }

  if (!isRendererSupported(r.renderer) || assertFunctionOrSelf(fallbackCondition)) {
    return { renderer: getRendererClass(fallbackRenderer), nonTTY: true }
  }

  return r
}