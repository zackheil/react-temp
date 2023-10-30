type UserEvent<T extends any> = {
  unix: number;
  event: T;
}

// For compliance reasons, it would be great if we could split these analytics into 3 categories:
// - unmasked user events (knowing exactly who did what)
// - anonymized user events (knowing what happened, but not who did it; 
//     removing the associate() call after form submission or login)
// - performance events (analytics for how the app is performing, not what the user is doing)


// TODO: does this convey everything we need?
type UserClickEvent = {
  cat: 'user';
  type: 'click';
  target: string;
  coordinates: [x: number, y: number];
  innerText?: string;
};

type UserTextHighlightEvent = {
  cat: 'user';
  type: 'text-highlight';
  text: string;
  // Where from? element?
}

type UserScrollEvent = {
  cat: 'user';
  type: 'scroll';
  scrollDepthPercentage: number;
}

type UserPageViewEvent = {
  cat: 'user';
  type: 'page-view';
  path: string;
}

type UserAppFocusEvent = {
  cat: 'user';
  type: 'app-focus';
  focus: 'away' | 'towards';
}

type MetaAppLoadEvent = {
  cat: 'meta';
  type: 'app-load';
  startUnix: number;
  endUnix: number;
}
