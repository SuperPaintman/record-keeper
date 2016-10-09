'use strict';
/** Requires */
import {
  shExecPromise
} from '../libs/utils';

/** Interfaces */
export interface IGitStatus {
  modified?: string[];
  added?: string[];
  deleted?: string[];
  renamed?: string[];
  copied?: string[];
  'updated but unmerged'?: string[];
  'untracked paths'?: string[];
}

export interface IGitVersion {
  full:   string;
  semver: string;
}

export default class Git {
  private _sh = shExecPromise;
  private _bin = 'git';

  async version(): Promise<IGitVersion> {
    const result = await this._sh(`${this._bin} --version`);

    const matches = result
      .split('\n')
      .filter((s) => s && s !== '')
      .join('\n')
      .match(/^git version ((\d+\.\d+\.\d+)(\.\S+)?)$/i);

    if (!matches) {
      /** @todo */
    }

    const res: IGitVersion = {
      full:   matches[1],
      semver: matches[2]
    };

    return res;
  }

  async status(): Promise<IGitStatus> {
    const result = await this._sh(`${this._bin} status --short`);

    console.log(result);

    const lines = result
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s && s !== '');

    const status: IGitStatus = lines
      .map((line) => {
        const matches = line.match(/^([MADRCU\?]+) (.+)$/);

        const [, s, filepath] = matches;

        let statusName: string;
        switch (s.toUpperCase()) {
          case 'M':
            statusName = 'modified';
            break;

          case 'A':
            statusName = 'added';
            break;

          case 'D':
            statusName = 'deleted';
            break;

          case 'R':
            statusName = 'renamed';
            break;

          case 'C':
            statusName = 'copied';
            break;

          case 'U':
            statusName = 'updated but unmerged';
            break;

          case '??':
            statusName = 'untracked paths';
            break;

          default:
            throw new Error(`Undefined status: "${s}"`);
            // break;
        }

        return {
          status:   statusName,
          filepath: filepath.trim()
        };
      })
      .reduce<IGitStatus>((
        res: IGitStatus,
        file: {status: string, filepath: string}
      ) => {
        if (!res[file.status]) {
          res[file.status] = [];
        }

        res[file.status].push(file.filepath);

        return res;
      }, {});

    return status;
  }
}
