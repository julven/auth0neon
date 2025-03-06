const BrandAuth = () => {

	const navigate = useNavigate()
	const { id } = useParams()
	const {
		fetchData,
		neonUser,
		getMarketPlace,
		marketplaceList, setMarketplaceList,

	} = useContext(AppContext)

	const [brand, setBrand] = useState({})
	const [selectedMarketPlace, setSelectedMarketPlace] = useState("")
	const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"))

	const [errorList, setErrorList] = useState([])
	const [generalMessage, setGeneralMessage] = useState([])

	const [authorizedMarketplaceList, setAuthorizedMarketplaceList] = useState([])

	const [showUrl, setShowUrl] = useState('')

	const getBrands = async () => {


		let resp = await fetchData(`SELECT * FROM brand where brand_entity_id = '${id}' AND user_id = '${neonUser.user_id}'`, "/neon-query")

		console.log({getBrands: {resp}})

		if(resp.length == 0) navigate("/brand")

		setBrand(resp[0])
	}

	const brandChangeHandler = (field, value) => {
		setBrand({
			...brand,
			[field] : value
		})
	}	

	const goBack = (e) => {
		e.preventDefault()

		navigate(-1)
	}

	const addMarketPlace = async () => {

		setGeneralMessage("")
		setErrorList([])

		let valid = true;
		let errs = []

		if(["",false,undefined,null].includes(selectedDate)) {
			errs.push("selectedDate")
			valid = false
		}
		if(["",false,undefined,null].includes(selectedMarketPlace)) {
			errs.push("selectedMarketPlace")
			valid = false
		}


		if(!valid) {
			console.log({addMarketPlace: {errorList}})
			setErrorList(errs)
			setGeneralMessage("all required fields must not be empty")
			return
		}

		console.log({addMarketPlace: {selectedDate, selectedMarketPlace}})

		let sql = `
			INSERT INTO brand_marketplace (
			user_id,
			brand_entity_id,
			marketplace_id,
			date_start
			) 
			VALUES 
			('${neonUser.user_id}',
			${brand.brand_entity_id},
			${selectedMarketPlace},
			'${selectedDate}')

		`

		console.log({addMarketPlace: {sql}})
		// return

		let resp = await fetchData(sql,"/neon-query")

		if(!resp) {
			setGeneralMessage("error! please try again.")
			return
		}

		getAuthorizedMarketplace()
		setGeneralMessage("marketplace added.")
		setSelectedDate("")
		setSelectedMarketPlace("")

		return

	}

	const getAuthorizedMarketplace = async () => {

		let sql = `
			SELECT * FROM brand_marketplace
			WHERE user_id = '${neonUser.user_id}' AND brand_entity_id = ${brand.brand_entity_id}

		`

		let sql2 = `SELECT * FROM agency WHERE user_owner_id = '${neonUser.user_id}'`

		let resp = await fetchData(sql, "/neon-query")
		let agency = await fetchData(sql2, "/neon-query")

		resp = resp.map( x => {
			return {
				...x,
				brand,
				marketplace: marketplaceList.filter( xx => xx.id == Number(x.marketplace_id))[0],
				agency: agency[0]
			}
		})

		console.log({getAuthorizedMarketplace: {resp, sql, marketplaceList}})
		setAuthorizedMarketplaceList(resp)
		return
	}

	useEffect(() => {
		if(marketplaceList.length == 0) getMarketPlace()
	}, [marketplaceList])

	useEffect(() => {
		if(neonUser.user_id && id) getBrands()
	},[neonUser, id])


	useEffect(() => {
		if(neonUser.user_id && brand.brand_entity_id && marketplaceList.length > 0) getAuthorizedMarketplace()
	},[neonUser, brand, marketplaceList])

	useEffect(() => {
		console.log({selectedMarketPlace})
	}, [selectedMarketPlace])

	const ShowLinkOrStatus = ({x}) => {
		let url = [
			`https://authorize.biusers.com?`,
			`region=${x.marketplace.region}`,
			`country=${x.marketplace.country}`,
			`api_type=${`spapi`}`,
			`companyName=${x.brand.brand}`,
			`type=${x.brand.account_type == 'seller' ? 'seller_central' : x.brand.account_type == 'vendor' ? 'vendor_central': ''}`,
	 		`agency=${x.agency.agency_name}`,
	 		`agency_email=${x.agency.agency_id}`,
	 		`email=${x.brand_entity_id}`,
		]

		

		return(
			<a href={url.join("&")} title={url.join("&")} onClick={() => setShowUrl(url.join("&"))} target="_blank">authenticate</a>
		)
	}

	return (
		<div>
			<p>brand authorizations</p>
			<a href="#" onClick={goBack}>back</a>
			{generalMessage != "" ? <p>{generalMessage}</p>: null}

			<p>
			entity id: 
			<input readOnly type="text" value={brand.brand_entity_id || ""} onChange={e => brandChangeHandler('brand_entity_id', e.target.value)}/>
			</p>
			<p>
			data start 
			<input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}/>
			{errorList.includes("selectedDate") ? <span>&nbsp; required</span> : null}
			</p>

			{showUrl && <p>{showUrl}</p>}

			<p>
			marketplace: 
			<select value={selectedMarketPlace} onChange={e => setSelectedMarketPlace(e.target.value)}>
				<option value="">-select-</option>
				{marketplaceList.filter( x => !authorizedMarketplaceList.map(xx => Number(xx.marketplace_id)).includes(x.id)).map( x => (
				
				<option key={x.id} value={x.id}>{x.country}</option>
				))

				}
			</select>

			&nbsp; <button onClick={addMarketPlace}>add</button>
			{errorList.includes("selectedMarketPlace") ? <span>&nbsp; require</span> : null}
			</p>

			<table className="entity-table">
				<thead>
					<tr>
						<th>country</th>
						<th>date start</th>
						{brand.account_type && brand.account_type == 'seller' ? <th>seller status</th>:null}
						{brand.account_type && brand.account_type == 'vendor' ? <th>vendor status</th>:null}
						{brand.ads_management && brand.ads_management.includes('ppc') ? <th>ppc status</th>:null}
						{brand.ads_management && brand.ads_management.includes('dsp') ? <th>dsp status</th>:null}
						<th></th>
					</tr>
				</thead>
				<tbody>
					{authorizedMarketplaceList.map( (x, i) => (
						<tr key={i}>
							<td>{x.marketplace.country}</td>
							<td>{moment(x.date_start).format("MMM DD, YYYY")}</td>

							<td><ShowLinkOrStatus x={x}/></td>
					
							{brand.ads_management && brand.ads_management.includes('ppc') ? <td>test ppc</td>:null}
							{brand.ads_management && brand.ads_management.includes('dsp') ? <td>test dsp</td>:null}
							<td>
								<div>
									view 
								</div>
							</td>
						</tr>

					))

					}
				</tbody>
			</table>
		</div>
	)
}