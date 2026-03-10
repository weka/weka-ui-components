/**
 * @weka/weka-ui-components/plugins/vite/networkWarning
 *
 * Vite plugin that protects developers on public networks by defaulting
 * the dev server to localhost only, and requiring explicit confirmation
 * before exposing to the local network.
 *
 * Setup (in vite.config.ts):
 *
 *   import { NETWORK_SAFE_HOST, networkWarningPlugin } from '@weka/weka-ui-components/plugins/vite/networkWarning'
 *
 *   export default defineConfig({
 *     plugins: [networkWarningPlugin()],
 *     server: {
 *       host: NETWORK_SAFE_HOST,
 *     }
 *   })
 *
 * Usage:
 *
 *   # Safe (default) — localhost only, no network exposure
 *   yarn dev
 *
 *   # Expose to network — triggers a yes/no confirmation prompt
 *   yarn dev --host
 *
 * If the developer answers "no", the server never starts and nothing is exposed.
 */

import { createInterface } from 'node:readline'

function confirm(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(['yes', 'y'].includes(answer.trim().toLowerCase()))
    })
  })
}

/**
 * Localhost only. When the user passes --host, Vite overrides this to '0.0.0.0' automatically.
 */
export const NETWORK_SAFE_HOST = '127.0.0.1'

/**
 * Vite plugin that shows a warning and requires confirmation
 * when the dev server is exposed to the local network.
 *
 * The prompt runs before the server starts listening on any port.
 * If the user declines, the process exits and nothing is ever exposed.
 */
export function networkWarningPlugin() {
  let isNetworkExposed = false

  return {
    name: 'weka-network-warning',
    configResolved(config) {
      const host = config.server.host
      isNetworkExposed =
        host !== 'localhost' &&
        host !== '127.0.0.1' &&
        host !== undefined &&
        host !== false
    },
    async configureServer(_server) {
      if (!isNetworkExposed) return

      console.log('\n')
      console.log(
        '  \x1b[41m\x1b[1m\x1b[37m ⚠️  WARNING: Dev server will be exposed to your local network! \x1b[0m'
      )
      console.log(
        '  \x1b[31mAnyone on the same Wi-Fi/LAN can access this server and see your code.\x1b[0m'
      )
      console.log('  VPN does NOT protect against this.')
      console.log(
        '  For mobile testing, prefer phone hotspot or USB tethering.'
      )
      console.log('')

      const confirmed = await confirm('  Expose to network? (yes/no): ')
      if (!confirmed) {
        console.log(
          '\n  ✅ Cancelled. Run without --host to use localhost only.\n'
        )
        process.exit(0)
      }
      console.log('')
    }
  }
}
