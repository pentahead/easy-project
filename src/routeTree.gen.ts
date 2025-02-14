/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { createFileRoute } from '@tanstack/react-router'

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as ProfileImport } from './routes/Profile'

// Create Virtual Routes

const LoginLazyImport = createFileRoute('/Login')()
const IndexLazyImport = createFileRoute('/')()

// Create/Update Routes

const LoginLazyRoute = LoginLazyImport.update({
  id: '/Login',
  path: '/Login',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/Login.lazy').then((d) => d.Route))

const ProfileRoute = ProfileImport.update({
  id: '/Profile',
  path: '/Profile',
  getParentRoute: () => rootRoute,
} as any)

const IndexLazyRoute = IndexLazyImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any).lazy(() => import('./routes/index.lazy').then((d) => d.Route))

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexLazyImport
      parentRoute: typeof rootRoute
    }
    '/Profile': {
      id: '/Profile'
      path: '/Profile'
      fullPath: '/Profile'
      preLoaderRoute: typeof ProfileImport
      parentRoute: typeof rootRoute
    }
    '/Login': {
      id: '/Login'
      path: '/Login'
      fullPath: '/Login'
      preLoaderRoute: typeof LoginLazyImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexLazyRoute
  '/Profile': typeof ProfileRoute
  '/Login': typeof LoginLazyRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexLazyRoute
  '/Profile': typeof ProfileRoute
  '/Login': typeof LoginLazyRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexLazyRoute
  '/Profile': typeof ProfileRoute
  '/Login': typeof LoginLazyRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/Profile' | '/Login'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/Profile' | '/Login'
  id: '__root__' | '/' | '/Profile' | '/Login'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexLazyRoute: typeof IndexLazyRoute
  ProfileRoute: typeof ProfileRoute
  LoginLazyRoute: typeof LoginLazyRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexLazyRoute: IndexLazyRoute,
  ProfileRoute: ProfileRoute,
  LoginLazyRoute: LoginLazyRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.jsx",
      "children": [
        "/",
        "/Profile",
        "/Login"
      ]
    },
    "/": {
      "filePath": "index.lazy.jsx"
    },
    "/Profile": {
      "filePath": "Profile.jsx"
    },
    "/Login": {
      "filePath": "Login.lazy.jsx"
    }
  }
}
ROUTE_MANIFEST_END */
