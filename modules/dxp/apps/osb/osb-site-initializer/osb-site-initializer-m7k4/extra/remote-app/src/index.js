import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class SiteInitializerM7K4 extends HTMLElement {
	connectedCallback() {
		const root = ReactDOM.createRoot(this);

		root.render(
			<React.StrictMode>
				<App />
			</React.StrictMode>
		);
	}
}

if (!customElements.get('osb-site-initializer-m7k4')) {
	customElements.define('osb-site-initializer-m7k4', SiteInitializerM7K4);
}
