import React, { useRef } from 'react';

const InputText = ({
	text,
	type,
	value,
	name,
	placeholder,
	change,
	i,
	tag
}) => {
	const inputRef = useRef(value);
	const record = () => {
		change({
			param: inputRef.current.value,
			name: name,
			index: i
		});
	};
	return (
		<div>
			{text && <label htmlFor={`${name}${i}`}>{text}</label>}
			<div className="input-group">
				{tag === 'textarea' ? (
					<textarea
						type={type}
						className="form-control textarea_width"
						id={`${name}${i}`}
						placeholder={placeholder}
						ref={inputRef}
						value={value}
						onChange={record}
					/>
				) : (
					<input
						type={type}
						className="form-control"
						id={`${name}${i}`}
						placeholder={placeholder}
						ref={inputRef}
						value={value}
						onChange={record}
					/>
				)}
			</div>
		</div>
	);
};

export default InputText;
