import { WrapProviders } from '@utils/stories';
import { ComponentTitleStory } from './stories/component.scenario.js';
import { Default } from './stories/default.scenario.js';

// Version of the component that handles defaults except for primitive props
export const DemoPrimitiveProps = Default;

export const UsingComponentProps = () => <ComponentTitleStory />;

WrapProviders(DemoPrimitiveProps, UsingComponentProps);
