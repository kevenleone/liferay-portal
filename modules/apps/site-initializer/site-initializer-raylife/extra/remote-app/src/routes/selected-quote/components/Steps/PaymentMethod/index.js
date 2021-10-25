/* eslint-disable no-console */
import classNames from 'classnames';

import {useEffect, useState} from 'react';

import Card from './Card';

import RadioButton from './RadioButton';

const PaymentMethod = () => {
	const [methods, setMethods] = useState([
		{
			checked: false,
			image: '../../images/shortlisted.png',
			options: [],
			title: 'Authorize.net',
			value: 0,
		},
		{
			checked: false,
			image: '../../images/shortlisted.png',
			options: [
				{
					checked: true,
					description: 'Save $150',
					id: 0,
					title: 'Pay in full – $1225',
				},
				{
					checked: false,
					description: '1 additional payment of $687.50',
					id: 1,
					title: '2 payments of $687.50',
				},
			],
			title: 'PayPal',
			value: 1,
		},
	]);

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

	useEffect(() => {
		// eslint-disable-next-line no-console
		console.log('Methods', methods);
	}, [methods]);

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
											<a className="btn btn-secondary">
												Pay Now
											</a>
										</div>
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
