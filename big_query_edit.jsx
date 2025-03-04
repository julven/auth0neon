const BigQueryEdit = () => {

	const { 
		fetchData,
		cols ,
		getColumns,
		 columns, setColumns,
		 displayColumns, setDisplayColumns,
		 getDataType,
		 marketplaceList, 
		 getMarketPlace,
		 ids,
		 filterIds,
		 getClientList,
		 neonUser,
		 clientlist, setClientList,
		 createProducModifyLog,
		 token,
		} = useContext(AppContext)
	const {id} = useParams()
	const navigate = useNavigate()

	const [product, setProduct] = useState({})

	const [notFound, setNotFound] = useState(false)

	const [marketPlace, setMarketPlace] = useState({})

	const [client, setClient] = useState({})

	const [idValid, setIdValid] = useState(null)

	const [generalMessage, setGeneralMessage] = useState("")

	const getProduct = async () => {

		if(!id) return

		let sqlEdit = `
			SELECT ${cols.join(",")} 
			FROM bispoke-sidekick.product_info.product_adds_edits_deletes 
			WHERE record_id IN (${id}) AND IS_ADD_EDIT_DELETE IN ('EDIT', 'ADD')
		`

		// let sql = `
		// 	SELECT ${cols.join(",")} 
		// 	FROM bispoke-sidekick.product_info.product_information_unique 
		// 	WHERE record_id IN (${id})
		// 	UNION ALL
		// 	SELECT ${cols.join(",")} 
		// 	FROM bispoke-sidekick.product_info.product_adds_edits_deletes 
		// 	WHERE record_id IN (${id}) AND IS_ADD_EDIT_DELETE = 'EDIT'
		// `

		let sqlNew = `
			SELECT ${cols.join(",")} 
			FROM bispoke-sidekick.product_info.product_information_unique 
			WHERE record_id IN (${id})
			
		`
		// let resp = await fetchData(sql, "/bigquery-sql")
		let resp = null;

		let resps = await Promise.all([
			fetchData(sqlEdit, "/bigquery-sql"),
			fetchData(sqlNew, "/bigquery-sql"),
		])
		
		console.log({getProduct: {sqlEdit: resps[0], sqlNew: resps[1]}})

		if(resps[0].length == 0 && resps[1].length == 0) {
			console.log({getProduct: "no product found"})
			setNotFound(true)
			return
		}

		if(resps[0].length > 0 && resp == null) resp = resps[0]

		if(resps[1].length > 0 && resp == null) resp = resps[1]

		setProduct(resp[0])
		getColumns()

	}

	const displayColumnChangeHandler = (value, index) => {

		let copy = [...displayColumns]

		copy.forEach( (x, i) => {
			if( i == index) {
				copy[i].value = value

				
			}
		})

		// console.log({displayColumnChangeHandler: {copy}})

		setDisplayColumns(copy)

	}

	const setProductFieldValues = () => {
		let copy = [...displayColumns]
		copy.forEach( (x, i) => {
			x.value = product[x.column_name] || ""
			
		})


		setDisplayColumns(copy)
	}

	const checkDisplayValues = () => {
		// console.log("check display values")
		let copy = [...displayColumns]
		copy.forEach( (x, i) => {
			if(x.column_name == 'marketplace_id') {
				let market = marketplaceList.filter(xx =>x.value == xx.id )[0]
				setMarketPlace(market || {})
			}

			if(x.column_name == "client_id") {
				if(x.value == "") {
					setIdValid(null)
					return
				}
				let id = ids.filter(xx => x.value == xx )
				console.log({displayColumnChangeHandler: {ids,id}})
				setIdValid(id.length > 0)
				setClient(clientlist.filter( x => x.id == id)[0])
			}
		})
	}

	const goBack = (e) => {
		e.preventDefault()
		navigate(-1)
	}

	const updateProduct = async () => {

		// console.log({displayColumns})
		let max= 999999999999, min = 100000000000;
		let colArr = displayColumns.map( x => x.column_name)

		if(!idValid) {
			setGeneralMessage("invalid client id")
			return 
		}

		if(!marketPlace.id) {
			setGeneralMessage("invalid marketplace id")
			return 
		}

		let sql = `
			SELECT COUNT(*) AS count FROM bispoke-sidekick.product_info.product_adds_edits_deletes
			WHERE record_id = ${id}
		`
		
		// return
		let resp = await fetchData(sql, "/bigquery-sql")

		// console.log({updateProduct: {sql, count: resp[0].count}})

		if(resp[0].count == 0) {

			sql = `
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

				(${id},
				${marketPlace.id},
				${displayColumns[colArr.indexOf('client_id')].value},
				'${displayColumns[colArr.indexOf('child_asin')].value}',
				'${displayColumns[colArr.indexOf('client_title')].value}',
				'${displayColumns[colArr.indexOf('brand')].value}',
				${displayColumns[colArr.indexOf('cogs')].value || null} ,
				'${displayColumns[colArr.indexOf('client_name')].value}',
				'${displayColumns[colArr.indexOf('client_sku')].value}',
				'${displayColumns[colArr.indexOf('category')].value}',
				'${displayColumns[colArr.indexOf('subcategory')].value}',
				'${displayColumns[colArr.indexOf('attribute_1')].value}',
				'${displayColumns[colArr.indexOf('attribute_2')].value}',
				'${marketPlace.country}',
				'EDIT',
				'${token.idTokenPayload.sub}')
			`;

			// console.log({updateProduct: {sql}})

			// return

			let resp  = await fetchData(sql, "/bigquery-sql")

			createProducModifyLog("EDIT", marketPlace)


		}
		if(resp[0].count > 0) {
			let cols2 = [...cols]
			cols2.shift()
			// console.log({displayColumns})
			// return
			sql = `
				UPDATE bispoke-sidekick.product_info.product_adds_edits_deletes
				SET
				marketplace_id = ${displayColumns[colArr.indexOf('marketplace_id')].value},
				marketplace = '${marketPlace.country}',
				client_id = ${displayColumns[colArr.indexOf('client_id')].value},
				child_asin = '${displayColumns[colArr.indexOf('child_asin')].value}',
				client_title = '${displayColumns[colArr.indexOf('client_title')].value}',
				brand = '${displayColumns[colArr.indexOf('brand')].value}',
				cogs = ${displayColumns[colArr.indexOf('cogs')].value || 'NULL'},
				client_name = '${displayColumns[colArr.indexOf('client_name')].value}',
				client_sku = '${displayColumns[colArr.indexOf('client_sku')].value}',
				category = '${displayColumns[colArr.indexOf('category')].value}',
				subcategory = '${displayColumns[colArr.indexOf('subcategory')].value}',
				attribute_1 = '${displayColumns[colArr.indexOf('attribute_1')].value}',
				attribute_2 = '${displayColumns[colArr.indexOf('attribute_2')].value}'
				WHERE record_id = ${id}

			`

			// console.log({updateProduct: {sql}})

			let resp = await fetchData(sql, "/bigquery-sql")

			createProducModifyLog("EDIT", marketPlace)

			
		}

		setGeneralMessage("product updated successfully")
	}

	const getCompanyName = (value) => {
		
		// console.log({getCompanyName: {value, clientlist}})

		if(clientlist.length == 0 || value == "") return "";
		let found = clientlist.filter( x => x.id == value)

		if(found.length == 0) return "";
		
		return clientlist.filter( x => x.id == value)[0].company_name
	}

	useEffect(() => {
		// console.log({BigQueryEdit: {id}})
		setColumns([])
		setDisplayColumns([])
		getProduct()
		getMarketPlace()
	}, [])

	useEffect(() => {
		if(displayColumns.length > 0 && product.record_id && ids.length > 0) {
			console.log({displayColumns})
			setProductFieldValues()
		}
	}, [columns, product, ids])

	useEffect(() => {
		
		if(neonUser.agency_id)  {
			console.log("filter id and client list")
			filterIds()
			getClientList()
		}
	},[neonUser])

	useEffect(() => {
		if(displayColumns.length > 0 && ids.length > 0 && marketplaceList.length > 0) checkDisplayValues()
	}, [displayColumns, ids, marketplaceList])


	return (
		<div>
			<p>edit product</p>

			{notFound ? 	
			<p>product not found</p>
			:
			<div>
			{generalMessage ? <>{generalMessage}<br/><br/></> : null}
			{displayColumns.map( (x, i) => (
				<div key={x.column_name}>
					{x.column_name} 
					&nbsp;<input type={getDataType(x.data_type)} value={x.value} onChange={e => displayColumnChangeHandler(e.target.value, i)}/>
					{x.column_name == 'marketplace_id' ? <>&nbsp; {marketPlace.country}</> : null}
					{x.column_name == 'client_id' ? 
					<>
					&nbsp; {getCompanyName(x.value)}
					</> : null}
					<br/><br/>
				</div>
			))

			}
			
			</div>
			}
			<button onClick={updateProduct}>submit</button> &nbsp;
			<a href="#" onClick={goBack}>back</a>
		</div>

	)	
}