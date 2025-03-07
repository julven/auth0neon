const BrandAuthView = () => {

	let   navigate = useNavigate()
	let { id } = useParams()


	let [authorizedMarketPlace, setAuthorizedMarketplace] = useState({})


	let { 
		fetchData, neonUser,
		marketplaceList,
		getMarketPlace
		
	} = useContext(AppContext)

	const goBack = (e) => {
		e.preventDefault()

		navigate(-1)
	}


	const getAuthorizedMarketplace = async () => {

		let sql = `
			SELECT * FROM brand_marketplace
			INNER JOIN brand ON brand_marketplace.brand_entity_id = brand.brand_entity_id
			INNER JOIN auth0_user ON auth0_user.user_id = brand.user_id
			WHERE brand_marketplace.id = ${id}
		`

		let resp = await fetchData(sql, "/neon-query")


		if(resp[0].user_id != neonUser.user_id || resp.length == 0) navigate("/brand");

		let sql2 = `
			SELECT * 
			FROM client_profile_info 
			WHERE client_id = ${resp[0].brand_entity_id} 
			AND profile_type = '${resp[0].account_type == 'seller' ? 'seller_central': resp[0].account_type == 'vendor' ? 'vendor_central': resp[0].account_type}'
			AND "countryCode" = (SELECT "countryCode" FROM marketplace_info WHERE id = ${resp[0].marketplace_id})
		`;

		let resp2 = await fetchData(sql2, "/neon-market")

		resp = {
			...resp[0],
			profile: resp2[0],
		}
		resp = {
			...resp,
			marketPlace: marketplaceList.filter(x => Number(x.id) == Number(resp.marketplace_id))[0]
		}
		console.log({getAuthorizedMarketplace: {resp}})
		setAuthorizedMarketplace(resp)

	}

	let authorizationUrl = () => {
		let x = authorizedMarketPlace;
		let url = [
			
			`region=${x.marketPlace.regionCode.code}`,
			`country=${x.marketPlace.countrycode}`,
			`api_type=${`spapi`}`,
			`companyName=${x.brand}`,
			`type=${x.account_type == 'seller' ? 'seller_central' : x.account_type == 'vendor' ? 'vendor_central': ''}`,
	 		`agency=${neonUser.agency_name}`,
	 		`agency_email=${neonUser.agency_id}`,
	 		`email=${x.brand_entity_id}`,
	 		
		]

		url = encodeURI(url.join("&"))
		url = `https://authorize.biusers.com?`+url

		return url
	}

	useEffect(() => {
		if(neonUser.id && id && marketplaceList.length > 0 ) getAuthorizedMarketplace()
	}, [id, neonUser, marketplaceList])

	useEffect(() => {
		console.log({marketplaceList})
	}, [marketplaceList])

	useEffect(() => {
		if(marketplaceList.length == 0 ) getMarketPlace()
	}, [])

	return (
		
		<div>
			<p>view brand authorization: {authorizedMarketPlace.marketPlace && authorizedMarketPlace.marketPlace.country}</p>

			<p><a href="#" onClick={goBack}>back</a></p>
			<p>date created: {authorizedMarketPlace.date_start}</p>
			<p>seller id: {authorizedMarketPlace.profile && authorizedMarketPlace.profile.sellerId}</p>
			<p>status: {authorizedMarketPlace.active ? "active" : "inactive"}</p>
			{authorizedMarketPlace.marketPlace ?

			<p>authorization link: <input type="text" readOnly  value={authorizationUrl()}/>&nbsp;<a href={authorizationUrl()} target="_blank">authenticate</a></p>
			:
			null
			}
			

			
		</div>

	)
}