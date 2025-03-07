const BrandEdit = () => {

	const navigate = useNavigate()
	const {id} = useParams()


	const {
		fetchData,
		neonUser,
	} = useContext(AppContext)

	const [brand, setBrand] = useState({})
	const [accountTypeList, setAccountTypeList] = useState([])
	const [errorList, setErrorList] = useState([])
	const [generalMessage, setGeneralMessage] = useState("")

	const [brandEntityId, setBrandEntityId] = useState("")

	const goBack = (e) => {
		e.preventDefault()

		navigate(-1)
	}

	const adsManagementChangeHandler = (value) => {
		let list = [...brand.ads_management|| []]
		if(!list.includes(value)) {
			list.push(value);
			setBrand({
				...brand,
				ads_management: list
			})
			return
		} 
		if(list.includes(value)){
			list = list.filter(x => x != value);
			setBrand({
				...brand,
				ads_management: list
			})
			return
		}

		// console.log({adsManagementChangeHandler: {value, list}})
		
	}

	const getAccountType = async () => {

		let resp  = await fetchData(`SELECT unnest(enum_range(NULL::account_type))`, "/neon-query")

		console.log({getAccountType: {resp}})

		setAccountTypeList(resp.map( x => x.unnest))

		return

	}

	const getBrand = async () => {

		let sql = `
			SELECT * FROM brand WHERE user_id = '${neonUser.user_id}' AND id = ${id}
		`

		let resp = await fetchData(sql, "/neon-query")

		// console.log({getBrand: {resp}})	
		if(resp.length == 0) navigate("/brand")

		setBrand(resp[0])

		return
	}

	const brandChangeHandler = (field, value) => {
		setBrand({
			...brand,
			[field] : value
		})
	}	

	const updateBrand = async () => {

		setErrorList([])
		setGeneralMessage("")

		let valid = true;
		let err = [];

		(['brand','active?','account_type']).forEach( x => {
			if( [undefined, null, ""].includes(brand[x])) {
				err.push(x)
				valid = false
			}
		})



		if(!valid) {
			console.log({updateBrand: {err}})
			setErrorList(err)
			setGeneralMessage("all required fields must not be empty.")
			return
		}

		let sql = `
			UPDATE brand SET 
			brand = '${brand.brand}',
			"active?" = ${brand["active?"]},
			account_type = '${brand.account_type}',
			ads_management = ${brand.ads_management.length > 0 ? `ARRAY [${brand.ads_management.map( x => `'${x}'`).join(",")}]`: null},
			vendor_revenue_type = '${brand.vendor_revenue_type}'
			WHERE id = ${id}

		`

		let resp = await fetchData(sql, "/neon-query")

		if(!resp) {
			setGeneralMessage("error! please try again.")
			return;
		}

		setGeneralMessage("brand info successfully updated")

		return
	}

	const updateEntityId = async () => {

		setGeneralMessage("")

		if(brand.brand_entity_id == "") {
			setGeneralMessage("entity id must not be empty.");
			return;
		} 

		let sql1 = `

			UPDATE brand_marketplace 
			SET brand_entity_id = ${brandEntityId} 
			WHERE brand_entity_id = ${brand.brand_entity_id}

		`

		let sql2 = `
			UPDATE brand 
			SET brand_entity_id = ${brandEntityId} 
			WHERE brand_entity_id = ${brand.brand_entity_id}
		`

		console.log({updateEntityId: {sql1}})

		let resp1 = await fetchData(sql1, "/neon-query");
		let resp2 = await fetchData(sql2, "/neon-query");

		if(!resp1 || !resp2) {
			setGeneralMessage("error! please try again")
			return
		}

		setGeneralMessage("entity id successfully updated")

		return

	}

	useEffect(() => {
		if(neonUser.user_id && id && accountTypeList.length > 0) getBrand()
	}, [neonUser, id, accountTypeList])

	useEffect(() => {
		getAccountType()
	}, [])

	useEffect(() => {
		// console.log({brand})
		if(brand.brand_entity_id)setBrandEntityId(brand.brand_entity_id)
	}, [brand])



	return (
		<div>
			<p>brand edit</p>
			<a href="#" onClick={goBack}>back</a>
			{generalMessage && <p>{generalMessage}</p>}
			<p>
			{/*entity id: {brand.brand_entity_id}<br/>*/}
			entity id: <input type="number" value={brandEntityId} onChange={e => setBrandEntityId(e.target.value)}/>&nbsp;<button onClick={updateEntityId}>update</button><br/>
			</p>
			<p>
			brand name: 
			<input type="text" value={brand.brand || ''} onChange={e => brandChangeHandler('brand',e.target.value)}/>
			&nbsp;{errorList.includes("brand") && 'required'}
			</p>

			<p>status: &nbsp;{errorList.includes("active?") && 'required'}<br/>
			<input type="radio" name="status" checked={brand['active?'] || false} onChange={e => brandChangeHandler('active?',true)}/> Active 
			<input type="radio" name="status" checked={!brand['active?'] || false} onChange={e => brandChangeHandler('active?',false)}/> Inactive
			</p>

			<p>account type &nbsp;{errorList.includes("account_type") && 'required'}<br/>
				{accountTypeList.map( x => (
					<span key ={x}><input type="radio" name="account_type" checked={brand.account_type == x || false} onChange={e => brandChangeHandler('account_type',x)}/> {x}</span>
				))

				}
			</p>

			{["seller", "vendor", 'ads'].includes(brand.account_type) && 
			<p>
				ads management: <br/>
				<input type="checkbox" name="ads_management" checked={(brand.ads_management|| []).includes('ppc')} onChange={() => adsManagementChangeHandler("ppc")}/> PPC &nbsp;
				<input type="checkbox" name="ads_management" checked={(brand.ads_management|| []).includes('dsp')} onChange={() => adsManagementChangeHandler("dsp")}/> DSP &nbsp;
			</p>
			}
			{["vendor"].includes(brand.account_type) && 
			<p>
				ordered revenue type: <br/>
				<input type="radio" name="vendor_revenue_type" checked={brand.vendor_revenue_type == 'shipped cogs'} onChange={() => setBrand({...brand, vendor_revenue_type: "shipped cogs"})}/> Shipped COGs &nbsp;
				<input type="radio" name="vendor_revenue_type" checked={brand.vendor_revenue_type == 'ordered revenue'} onChange={() => setBrand({...brand, vendor_revenue_type: "ordered revenue"})}/> Ordered Revenue &nbsp;
			</p>
			}


			<button onClick={updateBrand}>update</button>
		</div>
	)
}