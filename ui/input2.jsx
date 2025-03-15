const UiInput2 = ({value, field, userChangeHandler}) => {



	return(
		<div className="input1" >
			<div className="d-flex gap-2 justify-content-between">
				<div style={{width: 20}}>
					<img src={["confirm",  "current", "new" ].includes(field) ? "./src/pass.png": null} style={{width: "100%"}}/>
				</div>
				<input 
					value={value} onChange={e => userChangeHandler(e.target.value, field)}
					className="flex-grow-1 poppins" type="password"/>
			</div>
		</div>

	)
}