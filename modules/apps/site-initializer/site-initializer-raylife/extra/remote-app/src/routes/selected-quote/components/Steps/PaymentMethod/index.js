import classNames from 'classnames';

import {useContext, useEffect, useState} from 'react';
import {LiferayService} from '~/common/services/liferay';
import LiferayFetch from '~/common/services/liferay/api';
import {SelectedQuoteContext} from '~/routes/selected-quote/context/SelectedQuoteContextProvider';
import {getPaymentMethods} from '~/routes/selected-quote/services/Cart';
import {updateOrderPaymentMethod} from '~/routes/selected-quote/services/Order';

import Card from './Card';
import RadioButton from './RadioButton';

const paymentMethodImages = {
	'authorized-net':
		'https://www.visa.ca/dam/VCOM/global/run-your-business/images/authorize.net-logo-400x225.jpg',
	'money-order': '',
	// eslint-disable-next-line quote-props
	'paypal':
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEX///8lO4AXm9cVMHuOlrUAl9YlNHsegr4AI3X6+/2NxecRmtcyotkAldUAktQWntoAIHUZM3wAJ3gmMXissccNLHrl5+4AHHMkO4AmL3cfN34PLXpga5rZ2+XQ0t/BxNVpdJ95gqiZyukqSInt9vtLqdzY6vagpr+Ciq1JWI+Vm7kvQoTIzNpUYZTp6/A6S4hqiLO4vM8Rd7VzfaUmaaW01+4pXptwuOIqUZDQ5vSu1O02SIdEp9sAFHEiVpZ3uuPR4Wa5AAAEaElEQVR4nO3bjVKbQBQF4CwRkojEROJPUGtrtImxta1a/1rr+79VMbGOyL0EdndmL/R8T7BnFvawC7RaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNN1orYT4dfdlxPVJNs0G7jP3t7e7j2fyD6+FqGKrykvbWcK12U7lbIeGz9u7BoesxV7LTrZgwncndjxeuh13B0XblhEoNByPX4y5vtK+RUKnuQc/1yMuatbUSqqGqy5V6kOglVEm3JgvOuWbA1KAeEQf6CVW3DtW4Y5IwGdZgufmiUxavhl9dj381zbL4Z2vqOsBKa5pl8WJvV3xnaJfFi+TAdYJVDMpiaSB9P9XdM0yYnLmOUOyi+s4iN4mye//DlnHC4SfXIQqNjOpwqSu69g3LYmH7yHWKIh+rnNIwZF+m3wzrcMl1iiJVj6FIA8HPNRcmO4tXW4JL30JZpPYFH0v9MNtZvGjPXefgzS2URbqYzlzn4F1ZKIs04ZXrHDw7ZSE5oYVnNiW68i+s1KFqy70P7ZSFGn53HYT1w85VGlyeuk7CsVMWKuiEG66jMOyUhYo9zxca8cxKWajJZhpR5oVq5ZlNJddpQi86dp2GcGJlZ6HiznNCr//ZdZ68QztloRYBPYmrjZ2yCK6XCb3op+tAOVMrZTEOlwG90HMdKOeTjbJIbl6mUOIkWimLsf8voBeKawzzE/03d+FiOT1xHSmrZ2Vn8Sag5z+4zpRloyzGnUzCW9eZsrS+98rKXKPyVtOp8UNbcpcJmN6Isl7SGJdFMtkMswkjWUvNV9NX+Ofee9G961AZidkL7mCSCygsoWFZxH82pSc8NCr88SURUFhCk7IIJhEV0ItE7RH1yyJQ5ASKa4uZXlkkcZqPCSis8XXKIgjimw6XT9xTG98VASkeq7vrNB6bT9qTd489hgouO5TI2yyM50nbPfF/kowXUXK8sDCdJ24HXPBxcPFE8YSdYvAfB080E4ah60xZ/J8kN5oJI1HrTMHHwe92teWnUNqJMHsXBh29hNJO9fmdRdDRCijuzUxBWaxsBYq8t2t8WQQ6F6nAN6R2y8LfELWpWGA/Dk40ykLeJdqyWhZh/8l1GsovNiG3u2Un0Bd1dPGqoCwqJfT7666j0PjfDuMKZRFG0bqoDdMb1coiJPh+FN3K2kxk8H+SEGURbuSc3q4/CHtKe4cvC+KgV9YZYUnsnyRUWcg6nCipUln4rkerg339S5RF+Nv1aDXwf5LEfn4KZZ2ClsN/HEyUhS9t51cG/yfJOZFQcOux/uOySKiykLf3W439k6QxZcH+o/4flEXU9LIYN6QsDh+5hE0pi9Z80M3bj+NxU8oi1ctpPYXkC9BalgXtlD6/qGVZ0PLP3IuykHgWquekT0+hyMNQLff5KqxtWdCO6au0nmVBeqIT1rUsCBv0UtqcsujRC02DyuIznbCWOwtG6FP6zVlKWyfH64TmrKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANr+AtbYXHYB9448AAAAAElFTkSuQmCC',
};

const PaymentMethod = () => {
	const [{orderId, product}] = useContext(SelectedQuoteContext);
	const [methods, setMethods] = useState([]);

	useEffect(() => {
		if (orderId) {
			getPaymentMethods(orderId).then((response) => {
				const {
					data: {items},
				} = response;

				const methodList = items.map((item) => ({
					checked: false,
					image: paymentMethodImages[item.key],
					options: [
						{
							checked: true,
							description: `Save $${Number(
								product.promo
							).toLocaleString('en-US')}`,
							id: 0,
							title: `Pay in full – $${Number(
								product.price
							).toLocaleString('en-US')}`,
						},
						{
							checked: false,
							description: `1 additional payment of $${Number(
								product.price / 2
							).toLocaleString('en-US')}`,
							id: 1,
							title: `2 payments of $${Number(
								product.price / 2
							).toLocaleString('en-US')}`,
						},
					],
					title: item.name,
					value: item.key,
				}));

				setMethods(methodList);
			});
		}
	}, [orderId]);

	const onSelectedMethod = (value) => {
		setMethods(
			methods.map((method) => ({
				...method,
				checked: method.value === value,
			}))
		);
	};

	const onSelectedOption = (optionId) => {
		setMethods(
			methods?.map((method) => {
				return {
					...method,
					options: method.options.map((option) => ({
						...option,
						checked: option.id === optionId,
					})),
				};
			})
		);
	};

	const onPayNow = async () => {
		await updateOrderPaymentMethod(product.promo, orderId);

		const {
			data: {paymentServletURL},
		} = await LiferayFetch.post(
			`/o/headless-raylife/v1.0/raylife/${orderId}`,
			{
				body: {
					callbackURL: `${origin}${LiferayService.getLiferaySiteName()}/congrats`,
				},
			}
		);

		window.location.href = paymentServletURL;
	};

	const showOptions = (method) =>
		method.options.map((option, index) => (
			<div
				className={classNames('payment-method-option', {
					selected: option.checked,
				})}
				key={index}
				onClick={() => onSelectedOption(option.id)}
			>
				<Card description={option.description} title={option.title} />
			</div>
		));

	const checkedMethod = methods.find(({checked}) => checked);

	return (
		<div className="payment-method-container">
			<div className="payment-method-row">
				<h3>Payment Method</h3>

				{methods.map((method, index) => (
					<div className="payment-method" key={index}>
						<RadioButton
							onSelected={onSelectedMethod}
							selected={method.checked}
							value={method.value}
						>
							<>
								<div className="image">
									<img src={method.image} />
								</div>

								<p>{method.title}</p>
							</>
						</RadioButton>
					</div>
				))}
			</div>

			<div className="payment-method-row">
				<>
					<h3>Billing Options</h3>

					{checkedMethod && (
						<>
							{checkedMethod.options.length ? (
								<>
									<div className="payment-method-options">
										{showOptions(checkedMethod)}
									</div>
									<div className="agree-check">
										<div className="check">
											<input
												name="agree-check"
												type="checkbox"
											/>
										</div>

										<p>
											I have read and agree to the{' '}
											<strong>
												Raylife Terms and Conditions
											</strong>
										</p>
									</div>
									<div className="payment-button">
										<button
											className="btn btn-secondary"
											onClick={onPayNow}
										>
											Pay Now
										</button>
									</div>
									{checkedMethod.value === 'paypal' && (
										<p className="option-message">
											You will be redirected to PayPal to
											complete payment
										</p>
									)}
								</>
							) : (
								<div className="no-options">
									<p>No options...</p>
								</div>
							)}
						</>
					)}
				</>
			</div>
		</div>
	);
};

export default PaymentMethod;
