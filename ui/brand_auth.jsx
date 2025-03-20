const UiBrandAuth = (props) => {

	const { fetchData } = useContext(AppContext)

	const [profiles, setProfiles] = useState([])


	let {
		goBack,
		generalMessage,
		brand,
		brandChangeHandler,
		selectedDate,
		setSelectedDate,
		errorList,
		showUrl,
		selectedMarketPlace,
		setSelectedMarketPlace,
		marketplaceList,
		addMarketPlace,
		changeCreateDate,
	} = props

	const getProfiles = async  (brand_entity_id) => {

		let sql = `
			SELECT * 
			FROM client_profile_info_plus 
			WHERE client_entity_id = '${brand_entity_id}'
			
		`;

		
		let resp = await fetchData(sql, "/neon-market")

		setProfiles(resp)	
		return
	}

	const getDspOrPpcStatus = (seller_or_vendor, countryCode) => {

		let found = profiles.filter( x => x.profile_type == seller_or_vendor && x.countryCode == countryCode)
		console.log({getDspOrPpcStatus: {found, seller_or_vendor, countryCode}})
		return found.length > 0
	}

	useEffect(() => {
		console.log({brand})
		if(brand.brand_entity_id && profiles.length == 0){
			getProfiles(brand.brand_entity_id)
		}
		
	}, [brand])

	// useEffect(() => {
	// 	console.log({profiles})
	// }, [profiles])

	const ShowLinkOrStatus =  ({x}) => {

		console.log("ShowLinkOrStatus")

		let url = [
			
			`region=${x.marketplace.regionCode.code}`,
			`country=${x.marketplace.countrycode }`,
			`api_type=${`spapi`}`,
			`companyName=${x.brand.brand}`,
			`type=${x.brand.account_type == 'seller' ? 'seller_central' : x.brand.account_type == 'vendor' ? 'vendor_central': ''}`,
	 		`agency=${x.agency.agency_name}`,
	 		`agency_email=${x.agency.agency_id}`,
	 		`email=${x.brand_entity_id}`,
	 		
		]


		url = encodeURI(url.join("&"))
		url = `https://authorize.biusers.com?`+url
		if(x.company ) return(
			<>
				{x.company.profile_active_status && x.company.info_active_status ? 	
				<span className="text-success poppins">Active</span>
				:
				<span className="text-danger poppins">Inactive</span>
				
				}
			</>
				
			
		);
		else return <a href={url} title={url} onClick={() => setShowUrl(url)} target="_blank">authenticate</a>
		
	}

	return (
		<div  className="p-4 d-flex flex-column gap-3">
			<div className="d-flex gap-2">
				<UiButton3 submit={goBack}/>
				<p className="mb-0 align-self-center fs-4">Authorization</p>
				
			</div>
			{generalMessage != "" ? <span className={errorList.length > 0 ? 'text-danger' : 'text-success'}>{generalMessage}</span>: null}
			<div className="row ">
				<div className="col-sm-12 col-md-6 mb-2">
					<div className="d-flex gap-1 flex-column">
						<p className="poppins mb-2 fw-bold">Date Start</p>
						<UiInput4 value={selectedDate || ""} changeHandler={setSelectedDate}/>
						<UiButton1 text="Save" submit={changeCreateDate}/>
					</div>
					
				</div>

				<div className="col-sm-12 col-md-6 mb-2">
					<div className="d-flex gap-1 flex-column">
						<p className="poppins mb-2 fw-bold">Country Select</p>
						<UiInput1 
						field="marketplace" 
						userChangeHandler={setSelectedMarketPlace}
						marketplace={marketplaceList.filter( x => !props.authorizedMarketplaceList.map(xx => Number(xx.marketplace_id)).includes(x.id))}/>
						<UiButton1 text="ADD"  submit={addMarketPlace}/>
					</div>
					
				</div>
			</div>

			<div className="table-responsive">
				<table className="brand-table">
					<thead>	
						<tr>
							<th>Country</th>
							<th className="middle-row-th">Date Created</th>
							<th className="middle-row-th">Seller Status</th>
							<th className="middle-row-th">PPC Status</th>
							<th className="middle-row-th">DSP Status</th>
							<th>Action</th>
						</tr>

					</thead>
					<tbody>

					{props.authorizedMarketplaceList.map( (x, i) => (
						<tr key={i}>
							<td>{x.marketplace.country}</td>
							<td className="middle-row-td">{moment(x.date_start).format("MMM DD, YYYY")}</td>
							<td className="middle-row-td"><ShowLinkOrStatus x={x}/></td>
							<td className="middle-row-td">
								
								{getDspOrPpcStatus('seller_central', x.marketplace.countrycode) ? <span className="text-success">Active</span> :  <span className="text-danger">Inactive</span>}
							</td>
							<td className="middle-row-td">
								{getDspOrPpcStatus('vendor_central', x.marketplace.countrycode) ? <span className="text-success">Active</span> :  <span className="text-danger">Inactive</span>}
							</td>
							<td className="middle-row-td">
								<div className="d-flex gap-1 justify-content-center">
									<div style={{width: 20, height: 20}}>
										<img src="./src/view.png" style={{width: "100%"}}/>
									</div>

									<div style={{width: 20, height: 20}}>
										<img src="./src/delete.png" style={{width: "100%"}}/>
									</div>
								</div>
									
							</td>
						</tr>
					))

					}
					</tbody>
				</table>
			</div>
			
			
		</div>
	)
}