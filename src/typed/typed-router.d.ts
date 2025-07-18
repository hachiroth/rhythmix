/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by unplugin-vue-router. ‼️ DO NOT MODIFY THIS FILE ‼️
// It's recommended to commit this file.
// Make sure to add this file to your tsconfig.json file as an "includes" or "files" entry.

declare module 'vue-router/auto-routes' {
  import type {
    RouteRecordInfo,
    ParamValue,
    ParamValueOneOrMore,
    ParamValueZeroOrMore,
    ParamValueZeroOrOne,
  } from 'vue-router'

  /**
   * Route name map generated by unplugin-vue-router
   */
  export interface RouteNamedMap {
    '/': RouteRecordInfo<'/', '/', Record<never, never>, Record<never, never>>,
    '/artist/[id]': RouteRecordInfo<'/artist/[id]', '/artist/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/mv/[id]': RouteRecordInfo<'/mv/[id]', '/mv/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/playlist/': RouteRecordInfo<'/playlist/', '/playlist', Record<never, never>, Record<never, never>>,
    '/playlist/[id]': RouteRecordInfo<'/playlist/[id]', '/playlist/:id', { id: ParamValue<true> }, { id: ParamValue<false> }>,
    '/profile/': RouteRecordInfo<'/profile/', '/profile', Record<never, never>, Record<never, never>>,
    '/profile/like': RouteRecordInfo<'/profile/like', '/profile/like', Record<never, never>, Record<never, never>>,
    '/profile/playlist': RouteRecordInfo<'/profile/playlist', '/profile/playlist', Record<never, never>, Record<never, never>>,
  }
}
