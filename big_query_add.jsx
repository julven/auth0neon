const BigQueryAdd = () => {

	const {id} = useParams()

	const {
		fetchData, 
		marketplaceList, 
		getMarketPlace, 
		token, 
		ids,
		filterIds,
		neonUser,
		list,setList, 
		getList,
		getColumns,
		columns, setColumns,
		displayColumns, setDisplayColumns,
		getDataType,
		getClientList,
		clientlist, setClientList,
	} = useContext(AppContext)
	// const [columns, setColumns] = useState([])
	// const [displayColumns, setDisplayColumns] = useState([])
	const [marketPlace, setMarketPlace] = useState({})
	const [idValid, setIdValid]= useState(null)
	const [errorList, setErrorList] = useState([])
	const [generalMessage, setGeneralMessage] = useState("")
	// const [clientlist, setClientList] = useState([])
	const [client, setClient] = useState({})

	

	// const getDataType = (type) => {

	// 	if([ "INT64","FLOAT64"].includes(type)) return "number";
	// 	if(type == "STRING") return "text";

	// }

	const displayColumnChangeHandler = (value, index) => {

		let copy = [...displayColumns]

		copy.forEach( (x, i) => {
			if( i == index) {
				copy[i].value = value

				if(copy[i].column_name == "marketplace_id") {
					let market = marketplaceList.filter(xx => copy[i].value == xx.id )[0]
					// console.log({displayColumnChangeHandler: {marketplaceList, market}})
					setMarketPlace(market || {})
				}

				if(copy[i].column_name == "client_id") {
					if(copy[i].value == "") {
						setIdValid(null)
						return
					}
					let id = ids.filter(xx => copy[i].value == xx )
					console.log({displayColumnChangeHandler: {ids,id}})
					setIdValid(id.length > 0)
					setClient(clientlist.filter( x => x.id == id)[0])
				}
				
			}
		})

		// console.log({displayColumnChangeHandler: {copy}})

		setDisplayColumns(copy)

	}

	const createProduct = async () => {	

		let max= 999999999999, min = 100000000000

		let errors = []
		setErrorList([])
		setGeneralMessage('')



		displayColumns.forEach ( (x, i) => {
			let reqiured = ["marketplace_id","client_id","client_title"]
			if(
				displayColumns[i].value == "" && 
				reqiured.includes(displayColumns[i].column_name)
			) errors.push(displayColumns[i].column_name)
		})

		

		console.log({createProduct: errors})

		setErrorList(errors)
		if(errors.length > 0) return;

		if(!idValid) {
			setGeneralMessage("invalid client id")
			return 
		}

		if(!marketPlace.id) {
			setGeneralMessage("invalid marketplace id")
			return 
		}



		let colArr = displayColumns.map( x => x.column_name)

		let sql = `
			INSERT INTO bispoke-sidekick.product_info.product_adds_edits_deletes
			(record_id,
			marketplace_id,
			client_id,
			child_asin,
			client_title,
			brand,
			cogs,
			client_name,
			client_sku,
			category,
			subcategory,
			attribute_1,
			attribute_2,
			marketplace,
			IS_ADD_EDIT_DELETE,
			BY_USER)

			VALUES

			(${Math.floor((Math.random())*(max-min+1))+min},
			${marketPlace.id},
			${displayColumns[colArr.indexOf('client_id')].value},
			'${displayColumns[colArr.indexOf('child_asin')].value}',
			'${displayColumns[colArr.indexOf('client_title')].value}',
			'${displayColumns[colArr.indexOf('brand')].value}',
			${displayColumns[colArr.indexOf('cogs')].value|| null},
			'${displayColumns[colArr.indexOf('client_name')].value}',
			'${displayColumns[colArr.indexOf('client_sku')].value}',
			'${displayColumns[colArr.indexOf('category')].value}',
			'${displayColumns[colArr.indexOf('subcategory')].value}',
			'${displayColumns[colArr.indexOf('attribute_1')].value}',
			'${displayColumns[colArr.indexOf('attribute_2')].value}',
			'${marketPlace.country}',
			'ADD',
			'${token.idTokenPayload.sub}')
		`;
		try {
			let resp  = await fetchData(sql, "/bigquery-sql")

			console.log({createProduct: {resp, sql}})

			let reset = [...displayColumns]

			reset.forEach(x => {
					x.value = ""
			})

			setIdValid(null)
			setMarketPlace({})
			setDisplayColumns(reset)
			setGeneralMessage("successfully added new product")


		} catch (err) {
			setGeneralMessage("something went wrong: "+err)
			console.log({createProduct: {err}})
		}
		


	}

	// const getClientList = async () => {
	// 	let resp = await fetchData(`SELECT * FROM client_entity_info_v2 WHERE agency_id = ${neonUser.agency_id} ORDER BY id ASC`,"/neon-query")

	// 	console.log({getClientList: {resp}})

	// 	setClientList(resp)
	// }


	

	useEffect(() => {
		getColumns()
		
		if(marketplaceList.length == 0) {
			getMarketPlace()
			
		}
	},[])

	useEffect(() => {
		console.log({neonUser})
		if(neonUser.agency_id)  {
			filterIds()
			getClientList()
		}
		
	},[neonUser])


	useEffect(() => {
		if(errorList.length > 0) setGeneralMessage("required fields must not be empty.")
	}, [errorList])

	useEffect(() => {
		console.log({client})
	},[client])

	// useEffect(() => {
	// 	// console.log({displayColumns})
	// },[displayColumns])

	return (
		<div>
			<p>add product <br/>
			{generalMessage}
			</p>
			{displayColumns.map( (x, i) => (
				<div key={x.column_name}>
					{x.column_name} &nbsp; 
					<input type={getDataType(x.data_type)} value={x.value} onChange={e => displayColumnChangeHandler(e.target.value, i)}/>
					{x.column_name == 'marketplace_id' ? <>&nbsp; {marketPlace.country}</> : null}
					{x.column_name == 'client_id' ? <>&nbsp; {idValid ? client.company_name: idValid == false ? "invalid id": null}</> : null}
					&nbsp; {errorList.includes(x.column_name) ? "required" : null}



					<br/><br/>

				</div>
			))

			}

			<button onClick={createProduct}>Submit</button><br/>
			<Link to="/">back</Link>
		</div>
	)
}