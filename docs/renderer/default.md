---
author:
  name: Cenk Kılıç
  url: https://cenk.kilic.dev
  email: cenk@kilic.dev
title: Default Renderer
order: 10
---

_DefaultRenderer_ is the main renderer of `listr2` and has been on showcase in the entry image.

<!-- more -->

_DefaultRenderer_ is intended for `TTY` environments with `vt100` terminal compatibility, where it updates the current update constantly depending on the changes in _Task_. This renderer has many options for customization, these options can be changed at _Listr_, _Subtask_ or _Task_ level.

This renderer uses _ProcessOutputHook_ to take control of the terminal.

## Renderer Options

::: details

@include(../api/interfaces/DefaultRendererOptions.md)

:::

## Renderer Task Options

::: details

@include(../api/interfaces/DefaultRendererTaskOptions.md)

:::