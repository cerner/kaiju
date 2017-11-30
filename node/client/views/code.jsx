/* global workspaceId */
/* global document */

import ReactDOM from 'react-dom';
import React from 'react';


const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map(nums =>
  <li>{nums}</li>,
);

// const string = `
// const Badge = (props) => {
//   return '<div>evaled string</div>';
// };
// Badge();
// `;

// console.log('evald', eval(string));

ReactDOM.render(
  <div>
    <div>{workspaceId}</div>
    <ul>{listItems}</ul>
  </div>,
  document.getElementById('root'),
);
