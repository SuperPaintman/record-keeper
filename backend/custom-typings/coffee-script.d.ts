declare module 'coffee-script' {
  export interface ICompileOptions {
    sourceMap?: boolean;
    inlineMap?: boolean;
    bare?:      boolean;
    header?:    boolean;
    shiftLine?: boolean;
    filename?:  string;
  }

  export interface ICompileReturnObject {
    js:          string;
    sourceMap:   any; /** @todo */
    v3SourceMap: string;
  }

  export interface IEvalOptions extends ICompileOptions {
    sandbox?:     boolean;
    modulename?:  string;
  }

  export function compile(
    code: string,
    options?: ICompileOptions
  ): ICompileReturnObject | string;

  export function eval(
    code: string,
    options?: IEvalOptions
  ): any;
}
