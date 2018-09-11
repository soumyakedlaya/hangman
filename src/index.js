import React from 'react';
import ReactDOM from 'react-dom';
import Home from './Components/Home';

//renders the Home Component and inserts into container with the id = root (public/index.html)
ReactDOM.render(
  <Home />,
  document.getElementById('root')
);
