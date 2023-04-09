import { endent } from '@dword-design/functions'
import tester from '@dword-design/tester'
import testerPluginTmpDir from '@dword-design/tester-plugin-tmp-dir'
import { execa } from 'execa'
import fs from 'fs-extra'
import P from 'path'
import { fileURLToPath } from 'url'

const __dirname = P.dirname(fileURLToPath(import.meta.url))

const self = P.resolve(__dirname, '..', 'src', 'index.js')

export default tester(
  {
    expect: async () => {
      await fs.outputFile(
        'index.spec.js',
        'export default { works: () => expect(true).toEqual(true) }',
      )
      await execa('mocha', [
        '--ui',
        'exports',
        '--require',
        self,
        '--timeout',
        3000,
        'index.spec.js',
      ])
    },
    toMatchImageSnapshot: async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
          export default {
            works() {
              expect(true).toMatchImageSnapshot(this)
            },
          }
        `,
      )
      await execa('mocha', [
        '--ui',
        'exports',
        '--require',
        self,
        '--timeout',
        3000,
        'index.spec.js',
      ])
      expect(
        await fs.exists(
          P.join('__image_snapshots__', 'index-spec-js-works-1-snap.png'),
        ),
      ).toBe(true)
    },
    toMatchSnapshot: async () => {
      await fs.outputFile(
        'index.spec.js',
        endent`
          export default {
            works() {
              expect(true).toMatchSnapshot(this)
            },
          }
        `,
      )
      await execa('mocha', [
        '--ui',
        'exports',
        '--require',
        self,
        '--timeout',
        3000,
        'index.spec.js',
      ])
      expect(
        await fs.readFile(
          P.join('__snapshots__', 'index.spec.js.snap'),
          'utf8',
        ),
      ).toEqual(endent`
        // Jest Snapshot v1, https://goo.gl/fbAQLP

        exports[\`works 1\`] = \`true\`;

      `)
    },
  },
  [testerPluginTmpDir()],
)
