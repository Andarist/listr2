import type { DefaultRenderer } from './renderer'
import type { ListrDefaultRendererLogLevels } from './renderer.constants'
import type { ListrRendererCacheMap } from '@interfaces'
import type { Task } from '@lib'
import type { PresetTimer, RendererPresetTimer } from '@presets'
import type { ListrLoggerStyleMap, RendererLoggerOptions, Spinner } from '@utils'

export type ListrDefaultRendererOptionsStyle = ListrLoggerStyleMap<ListrDefaultRendererLogLevels>

export type ListrDefaultRendererTask = Task<any, typeof DefaultRenderer>

export interface ListrDefaultRendererOptions
  extends RendererPresetTimer,
  RendererLoggerOptions<ListrDefaultRendererLogLevels>,
  ListrLoggerStyleMap<ListrDefaultRendererLogLevels> {
  // global

  /**
   * Indentation per-level.
   *
   * - This is a global option that can only be changed through the main Listr class.
   *
   * @defaultValue `2`
   */
  indentation?: number
  /**
   * Formats the output in to the given lines of `process.stdout.columns`.
   *
   * - This is a global option that can only be changed through the main Listr class.
   *
   * @defaultValue `'wrap'`
   */
  formatOutput?: 'truncate' | 'wrap'
  /**
   * Clear all the output generated by the renderer when the Listr completes the execution successfully.
   *
   * - This is a global option that can only be changed through the main Listr class.
   *
   * @defaultValue `false`
   */
  clearOutput?: boolean
  /**
   * Only update the render whenever there is a incoming request through the hook.
   *
   * - This is a global option that can only be changed through the main Listr class.
   * - Useful for snapshot tests, where this will disable showing spinner and only update the screen if something else has happened in the task worthy to show.
   *
   * @defaultValue `false`
   */
  lazy?: boolean
  /**
   * Remove empty lines from the output section for decluterring multiple line output.
   *
   * @defaultValue `true`
   */
  removeEmptyLines?: boolean
  /**
   * Spinner visually indicates that a task is running.
   *
   * - You can always implement your own spinner, if the current one does not please you visually.
   */
  spinner?: Spinner

  // subtasks

  /**
   * Show the subtasks of the current task.
   *
   * @defaultValue `true`
   */
  showSubtasks?: boolean
  /**
   * Collapse subtasks after current task completes its execution.
   *
   * @defaultValue `true`
   */
  collapseSubtasks?: boolean

  // skips

  /**
   * Show skip messages or show the original title of the task.
   *
   * - `true` will output the given skip message if there is any.
   * - `false` will keep the current task title intact. This will also disable `collapseSkips`.
   *
   * @defaultValue `true`
   */
  showSkipMessage?: boolean
  /**
   * Collapse skip messages into a single message and overwrite the task title.
   *
   * - `true` will collapse skiped tasks.
   * - `false` will show the skip message as a data output under the current task title.
   *
   * @defaultValue `true`
   */
  collapseSkips?: boolean
  /**
   * Suffix skip messages to clearly indicate the task has been skipped with in `collapseSkips` mode.
   *
   * - `true` will add `[SKIPPED]` as a suffix.
   * - `false` will not add a suffix.
   *
   * @defaultValue `false`
   */
  suffixSkips?: boolean

  // errors

  /**
   * Show the error message or show the original title of the task.
   *
   * - `true` will output the current error encountered with the task if there is any.
   * - `false` will keep the current task title intact. This will also disable `collapseErrors`.
   *
   * @defaultValue `true`
   */
  showErrorMessage?: boolean
  /**
   * Collapse error messages into a single message and overwrite the task title.
   *
   * - `true` will collapse the error message.
   * - `false` will show the error message as a data output under the current task title.
   *
   * @defaultValue `true`
   */
  collapseErrors?: boolean

  // retry

  /**
   * Suffix retry messages to clearly indicate the task is currently retrying.
   *
   * - `true` will add `[RETRY:COUNT]` as a suffix.
   * - `false` will not add a suffix.
   *
   * @defaultValue `false`
   */
  suffixRetries?: boolean

  // paused

  /**
   * Show duration for the pauses.
   *
   * @defaultValue `PRESET_TIMER`
   */
  pausedTimer?: PresetTimer
}

export interface ListrDefaultRendererTaskOptions extends RendererPresetTimer {
  /**
   * Write task output to the bottom bar instead of the gap under the task title itself.
   * This can be useful for stream of data coming in and is the default mode for tasks without a title.
   *
   * - `true` only keep 1 line of the latest data outputted by the task.
   * - `number` will keep the defined amount of data as the last lines.
   * - `false` will not use bottom bar if task has a title.
   *
   * @defaultValue `false`
   */
  bottomBar?: boolean | number
  /**
   * Keep output of the task after task finishes.
   *
   * - This can be enabled for both normal task output under the title and bottom bar.
   *
   * @defaultValue false
   */
  persistentOutput?: boolean
}

export interface ListrDefaultRendererCache {
  output: ListrRendererCacheMap<string[]>
  rendererOptions: ListrRendererCacheMap<ListrDefaultRendererOptions>
  rendererTaskOptions: ListrRendererCacheMap<ListrDefaultRendererTaskOptions>
}
