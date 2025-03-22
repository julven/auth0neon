const UiBrandAuthView = (props) => {

	

	const {
		authorizedMarketPlace,
		authorizationUrl,
		goBack,	
		
		
	} = props

	const {fetchData, neonUser} = useContext(AppContext)

	const [tab, setTab] = useState("ppc")
	const [adType, setAdType] = useState("")
	const [sellerVendorList, setSellerVendorList] = useState([])
	const [selectedSellerVendor, setSelectedSellerVendor] = useState("")

	const [sellerVendorTable, setSellerVendorTable] = useState([])

	const setTabHandler = (type) => {
		setTab(type)
	}

	const getSellerVendorTable = async () => {
		let sql = `
			SELECT * FROM authorized_marketplace 
			WHERE brand_marketplace_id = '${authorizedMarketPlace.marketplace_id}'
			AND brand_id = '${authorizedMarketPlace.id}'
			AND user_id = '${neonUser.user_id}'
			AND management_type = '${tab}'
		`
		let resp = await fetchData(sql, "/neon-query")

		let sql2 = `
		SELECT * FROM client_profile_info_plus 
		WHERE profile_id IN (${resp.map( x => x.client_profile_id).join(",")})
		`
		let resp2 = [];
		if( resp.length > 0) resp2 = await fetchData(sql2, "/neon-market")

		resp = resp.map( x => {
			return {
				...x,
				profile: resp2.filter( xx => xx.profile_id == x.client_profile_id)[0] || {}
			}
		})

		console.log({getSellerVendorTable: resp})
		setSellerVendorTable(resp)
	}

	const getSellerVendorList = async () => {

		setSellerVendorList([])

		let sql = `
			SELECT * FROM client_profile_info_plus 
			WHERE client_entity_id = '${authorizedMarketPlace.profile.client_id}' 
			AND profile_type = '${adType == 'brand_ads' ? 'seller' : ''}' 
			AND "countryCode" = '${authorizedMarketPlace.profile.countryCode}' 
			${sellerVendorTable.length > 0 ? 
			` AND profile_id NOT IN (${sellerVendorTable.map( x => x.client_profile_id).join(",")})` 
			: 
			''}
		`

		let resp = await fetchData(sql, "/neon-market")

		console.log({getSellerVendorList: {resp,sql}})



		setSellerVendorList(resp)
		return 
	}

	const searchSellerVendor = (profile_id) => {

		let sellerVendor = sellerVendorList.filter( x => x.profile_id == profile_id) [0]

		console.log({searchSellerVendor: {sellerVendorList, profile_id}})
	
		return sellerVendor.info_active_status && sellerVendor.profile_active_status;
	}

	const cancelSelectSellerVendor = () => {
		setSelectedSellerVendor("")
		setAdType("")
	}

	const createAuthorizedMarketplace = async () => {

		if(selectedSellerVendor == "") return;


		let sql = `
			INSERT INTO authorized_marketplace 
			(brand_marketplace_id, ad_type, client_profile_id, brand_id, user_id, management_type)
			VALUES
			(
			'${authorizedMarketPlace.marketplace_id}',
			'${adType}',
			'${selectedSellerVendor}',
			'${authorizedMarketPlace.id}',
			'${neonUser.user_id}',
			'${tab}'
			)
		`

		console.log({createAuthorizedMarketplace: {sql}})

		let resp = await fetchData(sql, "/neon-query")

		cancelSelectSellerVendor()
		getSellerVendorTable()

	}

	const deleteAuthorizedMarketplace = async (x) => {

		console.log({deleteAuthorizedMarketplace: x})

		let conf = window.confirm("delete this marketplace?")

		if(!conf) return;

		let resp = await fetchData(`
			DELETE FROM authorized_marketplace WHERE id = ${x.id}
		`, "/neon-query")

		getSellerVendorTable()
		return
	}

	useEffect(() => {
		if(sellerVendorList.length == 0 && authorizedMarketPlace.id ) getSellerVendorList() 
	}, [authorizedMarketPlace])

	useEffect(() => {
		if(adType != "") getSellerVendorList()
	}, [adType])

	useEffect(() => {
		console.log({selectedSellerVendor})
	}, [selectedSellerVendor])


	useEffect(() => {
		console.log({authorizedMarketPlace, neonUser})
		if(neonUser.user_id && authorizedMarketPlace.id) getSellerVendorTable()
	}, [authorizedMarketPlace, neonUser])


	
	if(authorizedMarketPlace.id) return(
		<div  className="p-4 d-flex flex-column gap-3">
			<div className="d-flex gap-2" onClick={goBack}>
				<UiButton3 submit={null}/>
				<p className="mb-0 align-self-center fs-4">Authorization > {authorizedMarketPlace.marketPlace.country}</p>
			</div>

			<div className="table-responsive">
				<table className="brand-table">
					<tbody>
						<tr>
							<td className="p-3 text-start">
								<p className="poppins  fw-semibold mb-0" style={{color: "#650260"}}>DATE CREATED</p>
								<span className="text-secondary">{moment(authorizedMarketPlace.created).format("MMM DD, YYYY")}</span>
							</td>
							<td className="middle-row-td p-3 text-start">
								<p className="poppins  mb-0 fw-semibold" style={{color: "#650260"}}>SELLER ID</p>
								{authorizedMarketPlace.profile && <span className="text-secondary">{authorizedMarketPlace.profile.sellerId}</span>}
							</td>
							<td className="middle-row-td p-3 text-start">
								<p className="poppins mb-0 fw-semibold" style={{color: "#650260"}}>STATUS</p>
								<span className="text-secondary">
								{
									authorizedMarketPlace.profile_active_status &&
									authorizedMarketPlace.info_active_status  ?
									 "Active" : "Inactive"
								}
									</span >
							</td>
							<td className="middle-row-td p-3 text-start">
								<p className="poppins mb-0 fw-semibold" style={{color: "#650260"}}>AUTHORIZATION LINK</p>
								<div className="d-flex gap-1">
									<a className="align-self-center" href={authorizationUrl()} title={authorizationUrl()} target="_blank">Authenticate</a>
									<div style={{width: 20, height: 20}}>
										<img src="./src/brand-on.png" style={{width:"100%", height: "100%"}}/>
									</div>
								</div>
								
								
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<div className="container2 " style={{minHeight: 200, }}>
				<div className="w-100 d-flex gap-1 " style={{borderBottom: "2px solid #ff9933", padding: "0px 25px"}}>

					<div style={{cursor: "pointer"}} onClick={() => setTabHandler('ppc')} className={" d-flex justify-content-center "+(tab == 'ppc' ? "tab-on" : "tab-off")}>
						<p className="poppins mb-0 align-self-center ">PPC</p>
					</div>

					<div style={{cursor: "pointer"}} onClick={() => setTabHandler('dsp')} className={" d-flex justify-content-center "+(tab == 'dsp' ? "tab-on" : "tab-off")}>
						<p className="poppins mb-0 align-self-center ">DSP</p>
					</div>
				</div>

				<div className="container1 flex-column gap-2">

					{adType == "" ?
					<div className="d-flex gap-2 mb-3">
						<a 
						href="#"
						style={{cursor: "pointer"}} 
						onClick={(e) => {e.preventDefault(); setAdType("brand_ads")}}> Authorize Brand Ads Account </a>
					</div>
					:
					<p className="fs-3">{adType == "brand_ads" ? "Authorize Brand Ads Account" : null}</p>
					}
					

					<div className="table-responsive">
						<table className="brand-table">
							<thead>
								<tr>
									<th>Ad Type</th>
									<th className="middle-row-th">Seller Name</th>
									<th className="middle-row-th">Status</th>
									<th className="middle-row-th">Action</th>
								
								</tr>
							</thead>
							<tbody>
								{adType != "" ?
								<tr>
									<td>{adType == 'brand_ads' ? 'Brand Ads' : ''}</td>
									<td >
										<UiInput1  userChangeHandler={setSelectedSellerVendor} sellerVendorList={sellerVendorList} field="sellerVendor"/>
									</td>
									<td >
									{ selectedSellerVendor &&
										<div>
											{ searchSellerVendor(selectedSellerVendor) ? 
											<span className="text-success">Active</span>
											:
											<span className="text-danger">Inactive</span>
											}
										</div>
									}
										
									
									</td>
									<td >
										
										<div className="d-flex gap-3 justify-content-center">
											{ selectedSellerVendor &&
											<div 
											onClick={() => createAuthorizedMarketplace()}
											style={{cursor: "pointer", backgroundColor: "#650260", borderRadius: "25px", color: "white", padding: "5px 10px"}}>
												Add
											</div>
											}
											<div 
											onClick={() =>cancelSelectSellerVendor()}
											style={{cursor: "pointer", border: "1px solid #650260", borderRadius: "25px", padding: "5px 10px"}}>
												Cancel
											</div>
										</div>
										
									</td>

								</tr>
								:
								<>
								{sellerVendorTable.map( x => (
								<tr key={x.id}>
									<td>{x.ad_type == 'brand_ads' ? "Brand Ads" : ""}</td>
									<td>{x.profile.sellerName}</td>
									<td>{(() => {
										if(x.profile.info_active_status && x.profile.profile_active_status) {
											return <span className="text-success">Active</span>
										}
										return <span className="text-danger">Inactive</span>


									})()}</td>
									<td>
										<div className="d-flex gap-3 justify-content-center">
											<div 
											onClick={() => deleteAuthorizedMarketplace(x)}
											style={{width: 20, height: 20, cursor: "pointer"}} title="remove">
												<img src="./src/delete.png" style={{width: "100%", height: "100%"}}/>
											</div>

											{ x.profile.info_active_status && x.profile.profile_active_status ? 
											null
											:
											<a 
											href={authorizationUrl(x.profile.profile_type)} target="_blank"
											style={{width: 20, height: 20}} title={authorizationUrl(x.profile.profile_type)}>
												<img src="./src/brand-on.png" style={{width: "100%", height: "100%"}}/>
											</a>
											}
											
										</div>
									</td>

								</tr>

								))

								}
								</>
								
								}

							</tbody>
						</table>
					</div>

				</div>
			</div>
		</div>

	)
	else return <span className="poppins">loading...</span>
}