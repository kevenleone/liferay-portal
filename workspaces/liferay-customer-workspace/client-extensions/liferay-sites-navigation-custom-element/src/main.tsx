import ReactDOM, { Root } from 'react-dom/client';
import LiferaySitesNavigation from './LiferaySitesNavigation.tsx';
import { ClayIconSpriteContext } from '@clayui/icon';
import getIconSpritemap from './spritemap.ts';
import { SWRConfig } from 'swr';

const STORAGE_KEY = '@liferay-navigation/swr';

/**
 * @description When initializing, we restore the data from `STORAGE` into a map.
 * Before unloading the app, we write back all the data into `STORAGE`.
 * We still use the map for write & read for performance.
 */

const SWRCacheProvider = (): Map<any, any> => {
  const cacheMap = new Map(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  );

  window.addEventListener('beforeunload', () => {
    const appCache = JSON.stringify(Array.from(cacheMap.entries()));

    localStorage.setItem(STORAGE_KEY, appCache);
  });

  return cacheMap;
};

export default SWRCacheProvider;

class LiferaySiteNavigation extends HTMLElement {
  private root?: Root;

  connectedCallback() {
    if (!this.root) {
      this.root = ReactDOM.createRoot(this);
      this.root.render(
        <SWRConfig value={{ provider: SWRCacheProvider }}>
          <ClayIconSpriteContext.Provider value={getIconSpritemap()}>
            <LiferaySitesNavigation />
          </ClayIconSpriteContext.Provider>
        </SWRConfig>
      );
    }
  }
}

if (!customElements.get('liferay-sites-navigation-custom-element')) {
  customElements.define(
    'liferay-sites-navigation-custom-element',
    LiferaySiteNavigation
  );
}
