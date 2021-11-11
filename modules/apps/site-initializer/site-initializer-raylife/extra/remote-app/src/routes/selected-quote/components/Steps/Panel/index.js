import classNames from 'classnames';
import {useContext} from 'react';
import {SelectedQuoteContext} from '~/routes/selected-quote/context/SelectedQuoteContextProvider';

const Panel = ({
	children,
	id,
	PanelMiddle = () => null,
	PanelRight = () => null,
	title = '',
}) => {
	const [{panel}] = useContext(SelectedQuoteContext);
	const {checked, expanded = false} = panel[id];

	const showElement = !checked && expanded;

	return (
		<div className="panel-container">
			<div className="panel-header">
				<div className="panel-left">{title}</div>

				<PanelMiddle checked={checked} />

				<PanelRight checked={checked} expanded={expanded} />
			</div>

			<div
				className={classNames('panel-content', {
					show: showElement,
				})}
			>
				{showElement && children}
			</div>
		</div>
	);
};

export default Panel;
