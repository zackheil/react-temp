import type { Story, StoryDecorator } from '@ladle/react';
import { Providers } from '../elements/providers/index.js';

export const WrapProviders = (...stories: Story<any>[]) =>
  stories.forEach((story) =>
    Object.assign(story, {
      decorators: [
        (Story, context) => {
          return (
            <Providers themeOverride={context.globalState.theme === 'auto' ? 'light' : context.globalState.theme}>
              <Story />
            </Providers>
          );
        },
      ] as StoryDecorator[],
    })
  );
