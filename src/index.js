import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

// Choose the root container for the extension's main UI
const buttonContainer = document.getElementById('extensionsMenu');
const buttonElement = document.createElement('div');
const iconElement = document.createElement('i');
const textElement = document.createElement('span');
textElement.textContent = 'Open Notebook';
iconElement.classList.add('fa-solid', 'fa-clipboard');
buttonElement.id = 'openNotebookButton';
buttonElement.classList.add('list-group-item', 'flex-container', 'flexGap5');
buttonContainer.appendChild(buttonElement);
buttonElement.appendChild(iconElement);
buttonElement.appendChild(textElement);
const rootElement = document.getElementById('movingDivs');
const rootContainer = document.createElement('div');
rootElement.appendChild(rootContainer);
rootContainer.id = 'notebookPanel';
rootContainer.classList.add('drawer-content', 'flexGap5', 'displayNone');

buttonElement.addEventListener('click', () => {
    rootContainer.classList.toggle('flex');
    rootContainer.classList.toggle('displayNone');
});

function closePanel() {
    rootContainer.classList.remove('flex');
    rootContainer.classList.add('displayNone');
}

const root = ReactDOM.createRoot(rootContainer);
root.render(
    <React.StrictMode>
        <App onCloseClicked={closePanel} />
    </React.StrictMode>
);
