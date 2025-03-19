const UiInput1 = ({field, value, userChangeHandler, countries,readOnly}) => {

	return(
		<div className="input1" >
			<div className="d-flex gap-2 justify-content-between">
				<div style={{width: 20}} hidden={!field}>
					<img src={
						field == "email" ? 
						"./src/email.png" 
						: ["confirm",  "password" ].includes(field) ? 
						"./src/pass.png": 
						["first_name", "fname", "last_name", "lname"].includes(field) ?
						"./src/profile-circle.png"
						:

						 ["agency_name", "aname"].includes(field) ?
						"./src/building.png" 	
						:
						["zip", "marketplace", "country"].includes(field)?
						"./src/web.png" 
						:
						field == "mobile" ?
						"./src/mobile.png" 
						:
						field == "location" ?
						"./src/location.png" 
						:
						null
						}  style={{width: "100%"}}/>
				</div>
				{["marketplace", "country"].includes(field) ?
					<select className="flex-grow-1 poppins w-100" value={value}  onChange={e => userChangeHandler(e.target.value, field)}>
						<option className="poppins">-select-</option>
						{countries.map( x => (
						<option className="poppins" key={x.cca2} value={x.cca2} >{x.name.common}</option>

						))

						}
					</select>
					:
					<input 
					readOnly={readOnly || false}
					value={value} onChange={e => userChangeHandler(e.target.value, field)}
					className="flex-grow-1 poppins" type={field == "email" ? "email" : ["confirm",  "password" ].includes(field) ? "password" : "text"}/>
				}
			
			</div>
		</div>
	)


}