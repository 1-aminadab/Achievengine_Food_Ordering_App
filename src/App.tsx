import React from 'react';
import { RootNavigator } from './presentation/navigation/root/root.navigator';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor, store } from './application/stores/store';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate
        persistor={persistor}
      >
        <RootNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;
