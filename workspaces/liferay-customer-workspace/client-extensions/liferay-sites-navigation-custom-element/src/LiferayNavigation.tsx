import classNames from 'classnames';
import ClayIcon from '@clayui/icon';
import ClayDropDown from '@clayui/drop-down';
import ClayButton from '@clayui/button';
import { Liferay } from './liferay.js';
import useSWR from 'swr';

const config = {
  darkNav: true,
  showLanguageMenu: true,
};

const sites = [
  {
    color: 'blue',
    link: 'https://liferay.com',
    name: 'Liferay.com',
  },
  {
    color: 'green',
    link: 'https://help.liferay.com',
    name: 'Help Center',
  },
  {
    color: 'purple',
    link: 'https://liferay.dev',
    name: 'Community',
  },
  {
    color: '#1AA0E8',
    link: 'https://marketplace.liferay.com',
    name: 'Marketplace',
  },
];

const getRedirectURI = (languageId: string) => {
  const urlSearchParams = new URLSearchParams();

  urlSearchParams.set('p_l_id', Liferay.ThemeDisplay.getPlid());
  urlSearchParams.set('redirect', '/web/customer-portal');
  urlSearchParams.set('languageId', languageId);

  return `/c/portal/update_language?${encodeURI(urlSearchParams.toString())}`;
};

const getLanguageId = () => {
  const [a, b] = Liferay.ThemeDisplay.getLanguageId().split('_');

  return `${a} (${b})`.toUpperCase();
};

const languages = Object.entries(Liferay.Language.available);

const LiferayNavigation = () => {
  const { data: myUserAccount } = useSWR('/my-user-account', () =>
    Liferay.Util.fetch('/o/headless-admin-user/v1.0/my-user-account').then(
      (response: Response) => response.json()
    )
  );

  return (
    <nav className="liferay-navigation-nav mt-3">
      <div className="container">
        <div className="d-flex justify-content-between">
          <div className="d-flex items-center">
            <div>
              <ClayDropDown
                trigger={
                  <ClayButton
                    displayType="unstyled"
                    className="mr-4 font-weight-semi-bold"
                  >
                    <ClayIcon symbol="sites" className="mr-1" />
                    <span className="opacity-80">Liferay Sites</span>
                    <ClayIcon className="opacity-50" symbol="caret-bottom-l" />
                  </ClayButton>
                }
              >
                <ClayDropDown.ItemList className="liferay-navigation-nav--menu d-flex px-3">
                  <small className="font-weight-bold mb-3">Sites</small>

                  {sites.map((site, index) => (
                    <ClayDropDown.Item
                      className="liferay-navigation-nav--menu__item"
                      key={index}
                    >
                      <div className="d-flex">
                        <div
                          style={{ backgroundColor: site.color }}
                          className="liferay-navigation-nav--menu__item__icon mr-2 px-1"
                        >
                          <ClayIcon className="mr-1" symbol="sites" />
                        </div>

                        <span>{site.name}</span>
                      </div>

                      <ClayIcon
                        className="d-none shortcut-icon"
                        symbol="shortcut"
                      />
                    </ClayDropDown.Item>
                  ))}
                </ClayDropDown.ItemList>
              </ClayDropDown>
            </div>

            <ClayDropDown
              menuElementAttrs={{
                className: 'my-dropdown',
              }}
              trigger={
                <ClayButton displayType="unstyled" className="">
                  <ClayIcon symbol="globe-lines" className="mr-1" />
                  <span className="opacity-80 font-weight-semi-bold">
                    {' '}
                    {getLanguageId()}
                  </span>
                  <ClayIcon symbol="caret-bottom-l" />
                </ClayButton>
              }
            >
              <div className="liferay-navigation-nav--menu d-flex px-3">
                {languages.map(([key, language], index) => (
                  <ClayDropDown.Item
                    className="liferay-navigation-nav--menu__item"
                    href={getRedirectURI(key)}
                    key={index}
                  >
                    <div className="d-flex align-items-center">
                      <ClayIcon
                        symbol="check"
                        className={classNames('mr-2', {
                          visible: Liferay.ThemeDisplay.getLanguageId() === key,
                          invisible:
                            Liferay.ThemeDisplay.getLanguageId() !== key,
                        })}
                      />

                      <span className="text-capitalize">
                        {(language as string).split(' ').at(0)}
                      </span>
                    </div>
                  </ClayDropDown.Item>
                ))}
              </div>
            </ClayDropDown>
          </div>

          <div className="d-flex justify-items-center">
            <ClayButton displayType="unstyled" className="mr-4">
              <ClayIcon symbol="search" className="mr-1" />
            </ClayButton>

            <ClayDropDown
              trigger={
                <ClayButton displayType="unstyled">
                  {Liferay.ThemeDisplay.isSignedIn() ? (
                    <img
                      className="rounded-circle"
                      width={32}
                      height={32}
                      src={myUserAccount?.image}
                    ></img>
                  ) : (
                    <ClayIcon symbol="user" />
                  )}

                  <ClayIcon symbol="caret-bottom-l" />
                </ClayButton>
              }
            >
              <div className="account-setting-menu">
                <ClayDropDown.Item>
                  <ClayIcon className="mr-2" symbol="bell-on" />
                  <span>Notifications</span>
                </ClayDropDown.Item>

                <ClayDropDown.Divider />

                <ClayDropDown.Item>
                  <ClayIcon className="mr-2" symbol="cog" />
                  <span>Account Settings</span>
                </ClayDropDown.Item>

                <ClayDropDown.Item>
                  <ClayIcon className="mr-2" symbol="logout" />
                  <span>Sign Out</span>
                </ClayDropDown.Item>
              </div>
            </ClayDropDown>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LiferayNavigation;
