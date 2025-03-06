const BrandAdd = () => {

	const navigate = useNavigate()
	const {
		fetchData,
		neonUser,
	} = useContext(AppContext)

	const [selectedStatus, setSelectedSatus] =useState(null)
	const [accountTypeList, setAccountTypeList] = useState([])
	const [selectedAccountType, setSelectedAccountType] = useState("")
	const [brandName, setBrandName] = useState("")
	const [adsManagement, setAdsManagement] = useState([])
	const [vendorRevenueType, setVendorRevenueType] = useState("")
	const [errorList, setErrorList] = useState([])
	const [generalMessage, setGeneralMessage] = useState("")

	const goBack = (e) => {
		e.preventDefault()

		navigate(-1)
	}

	const getAccountType = async () => {

		let resp  = await fetchData(`SELECT unnest(enum_range(NULL::account_type))`, "/neon-query")

		console.log({getAccountType: {resp}})

		setAccountTypeList(resp.map( x => x.unnest))

	}

	const adsManagementChangeHandler = (value) => {
		let list = [...adsManagement]
		if(!list.includes(value)) {
			list.push(value);
			setAdsManagement(list)
			return
		} 
		if(list.includes(value)){
			list = list.filter(x => x != value);
			setAdsManagement(list)
			return
		}

		// console.log({adsManagementChangeHandler: {value, list}})
		
	}


	const createBrand = async () => {
		setErrorList([])
		setGeneralMessage("")

		let valid = true
		let data = {brandName,selectedStatus, selectedAccountType}
		console.log({createBrand: {data}})
		let err = []
		Object.keys(data).forEach( x => {
			
			if([undefined, null, ""].includes(data[x])) {
				err.push(x)
				valid  = false
			}
		})
		setErrorList(err)
		if(!valid) {
			setGeneralMessage("required fields must not be empty.")
			return
		}

		let sql = `
			SELECT MAX(current) FROM
			(SELECT MAX(id) as current FROM client_entity_info_v2
			UNION ALL
			SELECT MAX(brand_entity_id) as current FROM brand)

		`
		let newId = await  fetchData(sql, "/neon-query")

		

		let sql2 = `
		INSERT INTO brand (
			brand,
			"active?",
			user_id,
			brand_entity_id,
			account_type,
			ads_management	,
			vendor_revenue_type
		)
		VALUES

		('${data.brandName}',
		${data.selectedStatus},
		'${neonUser.user_id}',
		${Number(newId[0].max) + 1},
		'${selectedAccountType}',
		${adsManagement.length > 0 ? `ARRAY [${adsManagement.map(x => `'${x}'`).join(",")}]`: null},
		'${vendorRevenueType}')
		`
		console.log({createBrand: {newId, sql2}})
	
		let resp = await fetchData(sql2, "/neon-query")

		if(!resp) {
			setGeneralMessage("error! try again.")
			return
		}

		setGeneralMessage("successfully created brand.")
		setBrandName("")
		setSelectedSatus(null)
		setSelectedAccountType("")
		

	}

	useEffect(() => {	
		console.log({vendorRevenueType})
	}, [vendorRevenueType])

	useEffect(() => {
		getAccountType()
	}, [])

	return(
		<div>
			<p>add brand </p>

			<a href="#" onClick={goBack}>back</a>	

			{generalMessage && <p>{generalMessage}</p>}

			<p>
			brand name: 
			<input type="text" value={brandName} onChange={e => setBrandName(e.target.value)}/>
			&nbsp;{errorList.includes("brandName") && 'required'}
			</p>

			<p>status: &nbsp;{errorList.includes("selectedStatus") && 'required'}<br/>
			<input type="radio" name="status"onChange={e => setSelectedSatus(true)}/> Active 
			<input type="radio" name="status"  onChange={e => setSelectedSatus(false)}/> Inactive
			</p>

			<p>account type &nbsp;{errorList.includes("selectedAccountType") && 'required'}<br/>
				{accountTypeList.map( x => (
					<span key ={x}><input type="radio" name="account_type" onChange={e => setSelectedAccountType(x)}/> {x}</span>
				))

				}
			</p>

			{["seller", "vendor", 'ads'].includes(selectedAccountType) && 
			<p>
				ads management: <br/>
				<input type="checkbox" name="ads_management" onChange={() => adsManagementChangeHandler("ppc")}/> PPC &nbsp;
				<input type="checkbox" name="ads_management" onChange={() => adsManagementChangeHandler("dsp")}/> DSP &nbsp;
			</p>
			}
			{["vendor"].includes(selectedAccountType) && 
			<p>
				ordered revenue type: <br/>
				<input type="radio" name="vendor_revenue_type" onChange={() => setVendorRevenueType("shipped cogs")}/> Shipped COGs &nbsp;
				<input type="radio" name="vendor_revenue_type" onChange={() => setVendorRevenueType("ordered revenue")}/> Ordered Revenue &nbsp;
			</p>
			}

			<button onClick={createBrand}>create</button>

		</div>
	)
}