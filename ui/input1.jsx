const UiInput1 = (props) => {
	const {field, value, userChangeHandler, countries,readOnly} = props


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

						 ["agency_name", "aname", "brand", "sellerVendor"].includes(field) ?
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
				{["marketplace", "country", 'sellerVendor'].includes(field) ?
					<select className="flex-grow-1 poppins w-100" value={value}  onChange={e => userChangeHandler(e.target.value, field)}>
						<option className="poppins" value="">-select-</option>
						{countries && countries.map( x => (
						<option className="poppins" key={x.cca2} value={x.cca2} >{x.name.common}</option>

						))

						}
						{props.marketplace &&  props.marketplace.map( (x, i) => (
						<option className="poppins" key={i} value={x.id} >{x.country}</option>

						))

						}
						{props.sellerVendorList &&  props.sellerVendorList.map( (x, i) => (
						<option className="poppins" key={i} value={x.profile_id}>{x.sellerName}</option>

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