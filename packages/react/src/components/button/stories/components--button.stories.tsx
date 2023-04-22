import { WrapProviders } from '@utils/stories';
import MyButton from '../button.js';

export const Button = () => <MyButton>Hello World</MyButton>;

WrapProviders(Button);
