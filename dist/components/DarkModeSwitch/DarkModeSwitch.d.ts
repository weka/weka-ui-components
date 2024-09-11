/**
 * @file This file contains the implementation of DarkModeSwitch and the necessary setup for dark mode.
 */
/**
 * @description The CSS code to be added to your index.html for setting up the dark and light modes.
 * @example
 * <style>
 *   html {
 *     background: #f5f5f5;
 *   }
 *
 *   html.dark-mode {
 *     background: #3d3d3d;
 *   }
 *
 *   @media (prefers-color-scheme: dark) {
 *     html {
 *       background: #3d3d3d;
 *     }
 *   }
 *
 *   html.light-mode {
 *     background: #f5f5f5;
 *   }
 * </style>
 */
/**
 * @description The JavaScript code to be added at the top of your scripts for optimizing the dark mode switch to remove flickering between reloads.
 * @example
 * <script>
 *   // optimization to remove flickering between reloads
 *   const savedDarkMode = localStorage.getItem('isDarkMode')
 *
 *   if (savedDarkMode) {
 *     if (savedDarkMode === 'true') {
 *       document.documentElement.classList.add('dark-mode')
 *       document.body.classList.add('dark-mode')
 *     } else if (savedDarkMode === 'false') {
 *       document.documentElement.classList.add('light-mode')
 *       document.body.classList.add('light-mode')
 *     }
 *
 *     window.addEventListener('DOMContentLoaded', () => {
 *       document.documentElement.classList.remove('dark-mode')
 *       document.documentElement.classList.remove('light-mode')
 *     })
 *   }
 * </script>
 */
/**
 * @description The component for switching dark and light modes
 */
declare function DarkModeSwitch(): JSX.Element;
export default DarkModeSwitch;
