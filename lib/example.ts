const __dirname = ''
// current
import { CONST } from 'consts'

const ViteConfig = {
  alias: {
    consts: resolve(
      __dirname,
      './node_modules/@weka/weka-ui-components/lib/consts.ts'
    )
  }
}

// prefix solution
import { CONST } from 'wekauiconsts'
import { CONST } from '~ui/consts'
import { CONST } from '~components/consts'
import { Utils as SomeUtils } from '@weka/weka-ui-components'

// Approach for Single name for common imports both locally and externaly
// Suggested by Udi
const ViteConfig = {
  alias: {
    consts: [
      resolve(__dirname, 'src/consts'), // Local app aliases first
      resolve(
        __dirname,
        './node_modules/@weka/weka-ui-components/lib/consts.ts'
      ) // Library aliases as fallback
    ]
  }
}

// Suggested by Maxim
const ViteConfig = {
  alias: [
    {
      find: /^consts\//,
      customResolver: (source, importer) => {
        if (importer.includes('weka-ui-components')) {
          return './lib/consts/index.ts'
        }

        return '/src/consts' // to be edited
      }
    }
  ]
}

function resolve(one, two) {}
