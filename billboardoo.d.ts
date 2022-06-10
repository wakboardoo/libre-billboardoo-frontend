declare const __linariaStyle: string;
declare module React {

  export interface CSSProperties {
    [key: `--${string}`]: number | string;
  }
}
