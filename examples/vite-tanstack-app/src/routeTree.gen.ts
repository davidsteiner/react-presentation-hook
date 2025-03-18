/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root';
import { Route as PresentedViewImport } from './routes/presented-view';
import { Route as IndexImport } from './routes/index';

// Create/Update Routes

const PresentedViewRoute = PresentedViewImport.update({
  id: '/presented-view',
  path: '/presented-view',
  getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/';
      path: '/';
      fullPath: '/';
      preLoaderRoute: typeof IndexImport;
      parentRoute: typeof rootRoute;
    };
    '/presented-view': {
      id: '/presented-view';
      path: '/presented-view';
      fullPath: '/presented-view';
      preLoaderRoute: typeof PresentedViewImport;
      parentRoute: typeof rootRoute;
    };
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute;
  '/presented-view': typeof PresentedViewRoute;
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute;
  '/presented-view': typeof PresentedViewRoute;
}

export interface FileRoutesById {
  __root__: typeof rootRoute;
  '/': typeof IndexRoute;
  '/presented-view': typeof PresentedViewRoute;
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath;
  fullPaths: '/' | '/presented-view';
  fileRoutesByTo: FileRoutesByTo;
  to: '/' | '/presented-view';
  id: '__root__' | '/' | '/presented-view';
  fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute;
  PresentedViewRoute: typeof PresentedViewRoute;
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  PresentedViewRoute: PresentedViewRoute,
};

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>();

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/presented-view"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/presented-view": {
      "filePath": "presented-view.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
