import { defineConfig } from 'windicss/helpers';
import plugin from 'windicss/plugin';

export default defineConfig({
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        '.cursor-col-resize': {
          cursor: 'col-resize',
        },
        '.cursor-row-resize': {
          cursor: 'row-resize',
        },
      });
    }),
  ],
});
