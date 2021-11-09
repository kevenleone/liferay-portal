import classNames from 'classnames';

import {useEffect, useState} from 'react';
import {getPaymentMethods} from '~/routes/selected-quote/services/Cart';

import Card from './Card';
import RadioButton from './RadioButton';

const authorizeNet =
	'https://www.visa.ca/dam/VCOM/global/run-your-business/images/authorize.net-logo-400x225.jpg';
const paypal =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAwFBMVEX///8lO4AXm9cVMHuOlrUAl9YlNHsegr4AI3X6+/2NxecRmtcyotkAldUAktQWntoAIHUZM3wAJ3gmMXissccNLHrl5+4AHHMkO4AmL3cfN34PLXpga5rZ2+XQ0t/BxNVpdJ95gqiZyukqSInt9vtLqdzY6vagpr+Ciq1JWI+Vm7kvQoTIzNpUYZTp6/A6S4hqiLO4vM8Rd7VzfaUmaaW01+4pXptwuOIqUZDQ5vSu1O02SIdEp9sAFHEiVpZ3uuPR4Wa5AAAEaElEQVR4nO3bjVKbQBQF4CwRkojEROJPUGtrtImxta1a/1rr+79VMbGOyL0EdndmL/R8T7BnFvawC7RaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNN1orYT4dfdlxPVJNs0G7jP3t7e7j2fyD6+FqGKrykvbWcK12U7lbIeGz9u7BoesxV7LTrZgwncndjxeuh13B0XblhEoNByPX4y5vtK+RUKnuQc/1yMuatbUSqqGqy5V6kOglVEm3JgvOuWbA1KAeEQf6CVW3DtW4Y5IwGdZgufmiUxavhl9dj381zbL4Z2vqOsBKa5pl8WJvV3xnaJfFi+TAdYJVDMpiaSB9P9XdM0yYnLmOUOyi+s4iN4mye//DlnHC4SfXIQqNjOpwqSu69g3LYmH7yHWKIh+rnNIwZF+m3wzrcMl1iiJVj6FIA8HPNRcmO4tXW4JL30JZpPYFH0v9MNtZvGjPXefgzS2URbqYzlzn4F1ZKIs04ZXrHDw7ZSE5oYVnNiW68i+s1KFqy70P7ZSFGn53HYT1w85VGlyeuk7CsVMWKuiEG66jMOyUhYo9zxca8cxKWajJZhpR5oVq5ZlNJddpQi86dp2GcGJlZ6HiznNCr//ZdZ68QztloRYBPYmrjZ2yCK6XCb3op+tAOVMrZTEOlwG90HMdKOeTjbJIbl6mUOIkWimLsf8voBeKawzzE/03d+FiOT1xHSmrZ2Vn8Sag5z+4zpRloyzGnUzCW9eZsrS+98rKXKPyVtOp8UNbcpcJmN6Isl7SGJdFMtkMswkjWUvNV9NX+Ofee9G961AZidkL7mCSCygsoWFZxH82pSc8NCr88SURUFhCk7IIJhEV0ItE7RH1yyJQ5ASKa4uZXlkkcZqPCSis8XXKIgjimw6XT9xTG98VASkeq7vrNB6bT9qTd489hgouO5TI2yyM50nbPfF/kowXUXK8sDCdJ24HXPBxcPFE8YSdYvAfB080E4ah60xZ/J8kN5oJI1HrTMHHwe92teWnUNqJMHsXBh29hNJO9fmdRdDRCijuzUxBWaxsBYq8t2t8WQQ6F6nAN6R2y8LfELWpWGA/Dk40ykLeJdqyWhZh/8l1GsovNiG3u2Un0Bd1dPGqoCwqJfT7666j0PjfDuMKZRFG0bqoDdMb1coiJPh+FN3K2kxk8H+SEGURbuSc3q4/CHtKe4cvC+KgV9YZYUnsnyRUWcg6nCipUln4rkerg339S5RF+Nv1aDXwf5LEfn4KZZ2ClsN/HEyUhS9t51cG/yfJOZFQcOux/uOySKiykLf3W439k6QxZcH+o/4flEXU9LIYN6QsDh+5hE0pi9Z80M3bj+NxU8oi1ctpPYXkC9BalgXtlD6/qGVZ0PLP3IuykHgWquekT0+hyMNQLff5KqxtWdCO6au0nmVBeqIT1rUsCBv0UtqcsujRC02DyuIznbCWOwtG6FP6zVlKWyfH64TmrKQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANr+AtbYXHYB9448AAAAAElFTkSuQmCC';

const PaymentMethod = ({product, selectedQuote}) => {
	const [form, setForm] = useState({groupId: '', uuid: ''});
	const [methods, setMethods] = useState([]);

	useEffect(() => {
		if (selectedQuote.orderId) {
			getPaymentMethods(selectedQuote.orderId).then((response) => {
				const {
					data: {items},
				} = response;

				const methodList = [];

				items.forEach((item) => {
					methodList.push({
						checked: false,
						image: item.key === 'paypal' ? paypal : authorizeNet,
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
					});
				});

				setMethods(methodList);
			});
		}
	}, [selectedQuote]);

	const onSelectedMethod = (value) => {
		setMethods(
			methods.map((method) => {
				if (method.value === value) {
					return {
						...method,
						checked: true,
					};
				}

				return {
					...method,
					checked: false,
				};
			})
		);
	};

	const onSelectedOption = (optionId) => {
		setMethods(
			methods?.map((method) => {
				return {
					...method,
					options: method.options.map((option) => {
						if (option.id === optionId) {
							return {
								...option,
								checked: true,
							};
						}

						return {
							...option,
							checked: false,
						};
					}),
				};
			})
		);
	};

	const onPayNow = async () => {
		// const uuid = '406dcbad-b913-1504-c7dc-4e4618a942bb';
		// const groupId = 40798;

		const nextStep = `${origin}/web/raylife/selected-quote?status=${new Date().getTime()}`;

		// eslint-disable-next-line no-debugger
		// debugger;

		console.error(
			`${origin}/o/commerce-payment?groupId=${form.groupId}&uuid=${form.uuid}&nextStep=${nextStep}`
		);

		window.location.href = `${origin}/o/commerce-payment?groupId=${form.groupId}&uuid=${form.uuid}&nextStep=${nextStep}`;
	};

	const showOptions = (method) => {
		return method.options.map((option, index) => (
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
	};

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
				<input
					onChange={({target: {value}}) =>
						setForm({...form, uuid: value})
					}
					placeholder="uuid"
					value={form.uuid}
				/>

				<input
					onChange={({target: {value}}) =>
						setForm({...form, groupId: value})
					}
					placeholder="groupId"
					value={form.groupId}
				/>

				<div className="payment-button">
					<button className="btn btn-secondary" onClick={onPayNow}>
						Pay Now
					</button>
				</div>

				{methods.map((method) => {
					if (method.checked) {
						return (
							<>
								<h3>Billing Options</h3>
								{method.options.length ? (
									<>
										<div className="payment-method-options">
											{showOptions(method)}
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
										{method.value === 'paypal' && (
											<p className="option-message">
												You will be redirected to PayPal
												to complete payment
											</p>
										)}
									</>
								) : (
									<div className="no-options">
										<p>No options...</p>
									</div>
								)}
							</>
						);
					}
				})}
			</div>
		</div>
	);
};

export default PaymentMethod;
