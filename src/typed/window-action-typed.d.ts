export interface TypedWindowAction {
  close: () => void;
  toggle: () => void;
  minimize: () => void;
  onMaximizeChanged: (callback: (maximized: boolean) => void) => void;
}
