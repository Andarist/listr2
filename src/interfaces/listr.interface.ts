import Enquirer from 'enquirer'
import { Observable, Subject } from 'rxjs'
import { Readable } from 'stream'

import { stateConstants } from '@interfaces/state.constants'
import { DefaultRenderer } from '@renderer/default.renderer'
import { SilentRenderer } from '@renderer/silent.renderer'
import { VerboseRenderer } from '@renderer/verbose.renderer'
import { Listr } from '@root/index'
import { PromptOptions } from '@utils/prompt.interface'

export type ListrContext = any

export type ListrDefaultRendererValue = 'default'
export type ListrDefaultRenderer = typeof DefaultRenderer
export type ListrFallbackRendererValue = 'verbose'
export type ListrFallbackRenderer = typeof VerboseRenderer
export type ListrSilentRendererValue = 'silent'
export type ListrSilentRenderer = typeof SilentRenderer

export type ListrRendererValue = ListrSilentRendererValue | ListrDefaultRendererValue | ListrFallbackRendererValue | ListrRendererFactory

export interface ListrTaskObject<Ctx, Renderer extends ListrRendererFactory> extends Observable<ListrEvent> {
  /** Unique id per task, randomly generated in the uuid v4 format */
  id: string
  title?: string
  output?: string
  task: (ctx: Ctx, task: ListrTaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>
  skip: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean> | Promise<string>)
  subtasks: ListrTaskObject<Ctx, any>[]
  state: string
  message: {
    duration?: number
    error?: string
    skip?: string
  }
  check: (ctx: Ctx) => void
  run: (ctx: Ctx, wrapper: ListrTaskWrapper<Ctx, Renderer>) => Promise<void>
  options: ListrOptions
  rendererOptions: ListrGetRendererOptions<Renderer>
  rendererTaskOptions: ListrGetRendererTaskOptions<Renderer>
  renderHook$: Subject<void>
  hasSubtasks(): boolean
  isPending(): boolean
  isSkipped(): boolean
  isCompleted(): boolean
  isEnabled(): boolean
  isPrompt(): boolean
  hasFailed(): boolean
  hasTitle(): boolean
}

export interface ListrTask<Ctx = ListrContext, Renderer extends ListrRendererFactory = any> {
  title?: string
  task: (ctx: Ctx, task: ListrTaskWrapper<Ctx, Renderer>) => void | ListrTaskResult<Ctx>
  skip?: boolean | string | ((ctx: Ctx) => boolean | string | Promise<boolean> | Promise<string>)
  enabled?: boolean | ((ctx: Ctx) => boolean | Promise<boolean>)
  options?: ListrGetRendererTaskOptions<Renderer>
}

export interface ListrTaskWrapper<Ctx, Renderer extends ListrRendererFactory> {
  title: string
  output: string
  newListr(
    task: ListrTask<Ctx, Renderer> | ListrTask<Ctx, Renderer>[] | ((parent: this) => ListrTask<Ctx, Renderer> | ListrTask<Ctx, Renderer>[]),
    options?: ListrSubClassOptions<Ctx, Renderer>
  ): Listr<Ctx, any, any>
  report(error: Error): void
  skip(message?: string): void
  run(ctx?: Ctx, task?: ListrTaskWrapper<Ctx, Renderer>): Promise<void>
  prompt<T = any>(options: PromptOptions | PromptOptions<true>[]): Promise<T>
  cancelPrompt(throwError?: boolean): void
  stdout(): NodeJS.WritableStream
}

export type ListrTaskResult<Ctx> = string | Promise<any> | Listr<Ctx, ListrRendererValue, any> | Readable | NodeJS.ReadableStream | Observable<any>

export type ListrBaseClassOptions<
  Ctx = ListrContext,
  Renderer extends ListrRendererValue = ListrDefaultRendererValue,
  FallbackRenderer extends ListrRendererValue = ListrFallbackRendererValue
> = ListrOptions<Ctx> & ListrDefaultRendererOptions<Renderer> & ListrDefaultNonTTYRendererOptions<FallbackRenderer>

export type ListrSubClassOptions<Ctx = ListrContext, Renderer extends ListrRendererValue = ListrDefaultRendererValue> = ListrOptions<Ctx> &
Omit<ListrDefaultRendererOptions<Renderer>, 'renderer'>

export interface ListrOptions<Ctx = ListrContext> {
  concurrent?: boolean | number
  exitOnError?: boolean
  ctx?: Ctx
  registerSignalListeners?: boolean
  rendererFallback?: boolean | (() => boolean)
  rendererSilent?: boolean | (() => boolean)
  disableColor?: boolean
  injectWrapper?: {
    // eslint-disable-next-line @typescript-eslint/ban-types
    enquirer?: Enquirer<object>
  }
}

export type ListrGetRendererClassFromValue<T extends ListrRendererValue> = T extends ListrDefaultRendererValue
  ? ListrDefaultRenderer
  : T extends ListrFallbackRendererValue
    ? ListrFallbackRenderer
    : T extends ListrSilentRenderer
      ? ListrSilentRenderer
      : T extends ListrRendererFactory
        ? T
        : never

export type ListrGetRendererValueFromClass<T extends ListrRendererFactory> = T extends DefaultRenderer
  ? ListrDefaultRendererValue
  : T extends VerboseRenderer
    ? ListrFallbackRendererValue
    : T extends SilentRenderer
      ? ListrSilentRenderer
      : T extends ListrRendererFactory
        ? T
        : never

export type ListrGetRendererOptions<T extends ListrRendererValue> = T extends ListrDefaultRendererValue
  ? ListrDefaultRenderer['rendererOptions']
  : T extends ListrFallbackRendererValue
    ? ListrFallbackRenderer['rendererOptions']
    : T extends ListrSilentRenderer
      ? ListrSilentRenderer['rendererOptions']
      : T extends ListrRendererFactory
        ? T['rendererOptions']
        : never

export type ListrGetRendererTaskOptions<T extends ListrRendererValue> = T extends ListrDefaultRendererValue
  ? ListrDefaultRenderer['rendererTaskOptions']
  : T extends ListrFallbackRendererValue
    ? ListrFallbackRenderer['rendererTaskOptions']
    : T extends ListrSilentRenderer
      ? ListrSilentRenderer['rendererTaskOptions']
      : T extends ListrRendererFactory
        ? T['rendererTaskOptions']
        : never

export interface ListrDefaultRendererOptions<T extends ListrRendererValue> {
  renderer?: T
  rendererOptions?: ListrGetRendererOptions<T>
}

export interface ListrDefaultNonTTYRendererOptions<T extends ListrRendererValue> {
  nonTTYRenderer?: T
  nonTTYRendererOptions?: ListrGetRendererOptions<T>
}

export type ListrRendererOptions<Renderer extends ListrRendererValue, FallbackRenderer extends ListrRendererValue> = ListrDefaultRendererOptions<Renderer> &
ListrDefaultNonTTYRendererOptions<FallbackRenderer>

export declare class ListrRenderer {
  public static rendererOptions: Record<string, any>
  public static rendererTaskOptions: Record<string, any>
  public static nonTTY: boolean
  constructor (tasks: readonly ListrTaskObject<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions, renderHook$?: Subject<void>)
  public render (): void
  public end (err?: Error): void
}

/**
 * Exported for javascript applications to extend the base renderer
 */
export declare class ListrBaseRenderer implements ListrRenderer {
  public static rendererOptions: Record<string, any>
  public static rendererTaskOptions: Record<string, any>
  public static nonTTY: boolean
  public tasks: ListrTaskObject<any, typeof ListrBaseRenderer>[]
  public options: typeof ListrBaseRenderer.rendererOptions
  constructor (tasks: ListrTaskObject<any, typeof ListrBaseRenderer>[], options: typeof ListrBaseRenderer.rendererOptions)
  public render (): void
  public end (err?: Error): void
}

export interface ListrRendererFactory {
  rendererOptions: Record<string, any>
  rendererTaskOptions: Record<string, any>
  nonTTY: boolean
  new (tasks: readonly ListrTaskObject<any, ListrRendererFactory>[], options: typeof ListrRenderer.rendererOptions, renderHook$?: Subject<void>): ListrRenderer
}

export type ListrEvent =
  | {
    type: Exclude<ListrEventTypes, 'MESSAGE'>
    data?: string | boolean
  }
  | {
    type: 'MESSAGE'
    data: ListrTaskObject<any, any>['message']
  }

export class ListrError extends Error {
  constructor (public message: string, public errors?: Error[], public context?: any) {
    super(message)
    this.name = 'ListrError'
  }
}

export class PromptError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PromptError'
  }
}

export type ListrEventTypes = 'TITLE' | 'STATE' | 'ENABLED' | 'SUBTASK' | 'DATA' | 'MESSAGE'

export type StateConstants = stateConstants
