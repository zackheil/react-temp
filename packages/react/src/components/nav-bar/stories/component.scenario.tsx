import { NavBar } from '../nav-bar.js';
import { Icon } from './assets.js';

const ExampleComponent = ({ color }: { color?: string }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon color={color} />
      <h1 style={{ fontWeight: 'lighter', marginLeft: 10, color, fontSize: '1.2em' }}>Demo Technologies</h1>
    </div>
  );
};

export const ComponentTitleStory = () => <NavBar title={({ color }) => <ExampleComponent color={color} />} />;
