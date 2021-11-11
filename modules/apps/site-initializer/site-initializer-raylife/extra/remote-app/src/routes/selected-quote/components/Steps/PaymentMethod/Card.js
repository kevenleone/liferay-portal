const Card = ({description = '', title = ''}) => {
	return (
		<div className="card-container">
			<div className="card-content">
				<p className="card-title">{title}</p>

				<p className="card-description">{description}</p>
			</div>
		</div>
	);
};

export default Card;
