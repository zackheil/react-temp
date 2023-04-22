import React from 'react';
import type { GlobalProvider, ThemeState } from '@ladle/react';
import { StyleSheetManager } from 'styled-components';

const getDocument = (story: string) => {
  const iframe = document.querySelector(`[title='Story ${story}']`) as HTMLIFrameElement;
  return iframe && iframe.contentDocument ? iframe.contentDocument : document;
};

const IFrameStyleProvider: React.FC<{
  globalState: {
    theme: string;
    // rtl: string;
    story: string;
    width: number;
  };
  children: React.ReactNode;
}> = ({ children, globalState }) => {
  const [target, setTarget] = React.useState(getDocument(globalState.story).head);
  React.useEffect(() => {
    setTarget(getDocument(globalState.story).head);
  }, [globalState.width]);

  return <StyleSheetManager target={target}>{children}</StyleSheetManager>;
};

const FullscreenHelper = ({ show, theme }: { show: boolean; theme: ThemeState }) => {
  if (!show) return null;

  return (
    <div style={{ height: 20, display: 'flex', width: '100%', justifyContent: 'flex-end', alignItems: 'center' }}>
      <p
        onClick={() => {
          if (window.location.href.includes('?mode=preview'))
            window.location.href = window.location.href.replace('?mode=preview', '?');
          else if (window.location.href.includes('&mode=preview'))
            window.location.href = window.location.href.replace('&mode=preview', '');
        }}
        style={{
          margin: 0,
          padding: 0,
          marginRight: 10,
          cursor: 'pointer',
          textDecoration: 'underline',
          color: theme === 'auto' ? 'black' : theme === 'light' ? 'black' : 'white',
        }}
      >
        Exit Fullscreen
      </p>
    </div>
  );
};

export const Provider: GlobalProvider = ({ children, globalState }) => {
  return (
    <>
      <FullscreenHelper show={globalState.mode === 'preview'} theme={globalState.theme} />
      <IFrameStyleProvider globalState={globalState}>{children}</IFrameStyleProvider>
    </>
  );
};
