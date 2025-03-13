const UiInput1 = ({field, value, userChangeHandler, marketplaceList}) => {

	return(
		<div className="input1" >
			<div className="d-flex gap-2 justify-content-between">
				<div style={{width: 20}}>
					<img src={
						field == "email" ? 
						"./src/email.png" 
						: ["confirm",  "password" ].includes(field) ? 
						"./src/pass.png": 
						field == "fname" ?
						"./src/profile-circle.png"
						:
						field == "aname" ?
						"./src/building.png" 
						:
						field == "marketplace" ?
						"./src/web.png" 
						:
						null
						}  style={{width: "100%"}}/>
				</div>
				{field == "marketplace" ?
					<select className="flex-grow-1 poppins" onChange={e => userChangeHandler(e.target.value, field)}>
						<option className="poppins">-select-</option>
						{marketplaceList.map( x => (
						<option className="poppins" key={x.id} value={x.id}>{x.country}</option>

						))

						}
					</select>
					:
					<input 
					value={value} onChange={e => userChangeHandler(e.target.value, field)}
					className="flex-grow-1 poppins" type={field == "email" ? "email" : ["confirm",  "password" ].includes(field) ? "password" : "text"}/>
				}
			
			</div>
		</div>
	)


}