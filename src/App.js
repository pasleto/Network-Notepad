import React from 'react';
import { ToastContainer } from 'react-toastify';
import * as Components from './components';

function App() {
  return (
    <div className="App">
      <Components.NavigationBar />
      <Components.Router />
      <Components.FooterBar />
      <ToastContainer className="Toaster-Bottom-Right" position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggable draggablePercent={50} pauseOnHover={false} />
      <ToastContainer className="Toaster-Top-Right" position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnVisibilityChange={false} draggable draggablePercent={50} pauseOnHover={false} />
    </div>
  );
};

export default App;