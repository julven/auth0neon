let AppContextProvider = ({children}) => {



	const [cols] = useState( [
		"CAST(record_id as STRING) as record_id",
		"marketplace_id",
		"marketplace",
		"client_id",
		"child_asin",
		"client_title",
		"brand",
		"cogs",
		"client_name",
		"client_sku",
		"category",
		"subcategory",
		"attribute_1",
		"attribute_2"
	]);

	const [selectedId, setSelectedId] = useState(null)

	const [currentPage, setCurrentPage] = useState(null)
	const [pages, setPages] = useState(0)
	const [pageLimit] = useState(100)
	const [count, setCount ] = useState(0)
	const [authUser, setAuthUser] = useState({
		email: "",
		user_id: "",
		nickname: "",
		email_verified: "",
	})
	const [token, setToken] = useState(null)	
	const [initUrl, setInitUrl] = useState("/")
	const [list, setList] = useState([])
	const [loginLoaded, setLoginLoaded] = useState(false)
	const [ids, setIds] = useState([])
	const [neonUser, setNeonUser] = useState({})
	const [marketplaceList, setMarketplaceList] =useState([])
	const [columns, setColumns] = useState([])
	const [displayColumns, setDisplayColumns] = useState([])
	const [clientlist, setClientList] = useState([])
	const [userInfo, setUserInfo] = useState({})
	const [agencyList, setAgencyList] = useState([])
	const [roles, setRoles] = useState([])
	const [mode, setMode] = useState(1)
	const [countries, setCountries] = useState([])
	const [hh, setHh] = useState(0)

	const [offCanvas, setOffCanvas] = useState(null)

	const [popupSidebarType, setPopupSidebarType] = useState("")

	const [showCanvas, setShowCanvas] = useState(false)

	const [brandList, setBrandList] = useState([])


	const fetchData = async (query,endpoint) => {
	
		let headerData = new Headers()
		headerData.append("Content-Type", "application/json");
		let data = null
		try {
			 data = await fetch(`${apiUrl}${endpoint}`, {
				method:"POST",
				headers: headerData,
				body: JSON.stringify({query})
			})
		}
		catch(err) {
			console.log({ERROR: {apiUrl, endpoint, query, err}})
			return false
		}

		// let data = await fetch(`${apiUrl}${endpoint}`, {
		// 	method:"POST",
		// 	headers: headerData,
		// 	body: JSON.stringify({query})
		// })

		if(!data.ok) {
			console.log({fetchData: {err: "ERROR!"}})
			return
		}

		data = await data.json()

		return data


	}
	const getKeys = (x) => {

		let keyArr = Object.keys(x)
		// console.log({getKeys: {keyArr}})
		return keyArr
	}

	const getIds = async () => {
		console.log({context: "getIds"})
		let sql = `SELECT DISTINCT(id) FROM client_entity_info_v2  ORDER BY id`
		
		let resp = await fetchData(sql, "/neon-query")

		console.log({getIds: {resp}})

		setIds(resp.map( x => x.id))
		return resp.map( x => x.id)
	}

	const filterIds = async () => {

		console.log({context: "filterIds"})

		let sql = `SELECT DISTINCT(id) AS id FROM client_entity_info_v2`

		if(neonUser.role == 'owner') sql = `
			SELECT DISTINCT(id) AS id FROM client_entity_info_v2 WHERE agency_id = ${neonUser.agency_id} ORDER BY id
		`
		if(["normal","editor"].includes(neonUser.role)) sql = `
			SELECT DISTINCT(id) FROM client_entity_info_v2 WHERE id IN (SELECT entity_id FROM users_entity_id_list WHERE user_id = '${neonUser.user_id}') ORDER BY id
		`

		let resp = await fetchData( sql,"/neon-query")


		if(resp.length == 0 && ["normal","editor"].includes(neonUser.role)) {
			console.log(`user is ${neonUser.role} and has no entity list`)
			return
			resp = await fetchData( `
				SELECT DISTINCT(id) AS id FROM client_entity_info_v2 
				WHERE agency_id = (
				SELECT agency_id FROM agency 
				WHERE user_owner_id = '${neonUser.user_id}') 
				ORDER BY id
			`,"/neon-query")
		}

		resp = resp.map( x => x.id)

		console.log({filterIds: {resp, sql}})

		setIds(resp)
	}

	const getNeonUser = async () => {

		console.log({context: "getNeonUser"})

		let resp = await fetchData(`SELECT * from auth0_user where user_id = '${token.idTokenPayload.sub}'`, "/neon-query")

		let resp2 = await fetchData(`SELECT * from agency where user_owner_id = '${token.idTokenPayload.sub}'`,"/neon-query")

		resp = {
			...resp[0],
			...resp2[0],
		}

		console.log({getNeonUser: {resp}})

		setNeonUser(resp)
	}

	const getMarketPlace = async () => {

		console.log({context: "getMarketPlace"})

		let resp = await fetchData("SELECT * FROM marketplace_info","/neon-market")

		const regionCode = [
			{
				region: "north america",
				code: "NA"
			},
			{
				region: "europe",
				code: "EU"
			},
			{
				region: "fareast",
				code: "FA"
			},
		]

		

		resp = resp.map( x => {
			return {
				...x,
				regionCode: regionCode.filter( xx => xx.region == x.region )[0]
			}	
		})

		console.log({getMarketPlace: {resp}})
		setMarketplaceList(resp)	

		return
	}

	const getRoleView = () => {
		console.log({context: "getRoleView"})

		return ["admin","owner","editor"].includes(neonUser.role) 
	}

	const getList = async (id) => {

		console.log({context: "getList"})

		// console.log({getList: {id, neonUser}})
		// if(!neonUser.user_id) return;
		// if(neonUser.role == "normal" && neonUser.entity_id != Number(id)) return;


		// let addQuery = neonUser.agency_id ? `WHERE agency_id = ${neonUser.agency_id} AND id = ${Number(id)}` : ''
		let addQuery = neonUser.role == 'owner'  ? 
		`WHERE agency_id = ${neonUser.agency_id} AND id = ${Number(id)}` 
		: 
		["normal","editor"].includes(neonUser.role) ?
		`WHERE id = ${Number(id)}` 
		:
		''
		
		let resp = await fetchData("SELECT * FROM client_entity_info_v2 "+addQuery, '/neon-query')

		
		console.log({getList: {neonUser, resp, id}}	)

		// if((neonUser.role == "admin") || (neonUser.role == "normal" && neonUser.entity_id == Number(id))) {
		// if( getRoleView() || (neonUser.role == "normal" && neonUser.entity_id == Number(id))) {
		// 	setList(resp);

		// 	setSelectedId(id)
		// }
		setSelectedId(id)
		setList(resp);
		

		return
		
	}

	const getColumns = async () => {


		console.log({context: "getColumns"})


		let sql = "SELECT column_name,data_type FROM `bispoke-sidekick.product_info.INFORMATION_SCHEMA.COLUMNS` WhERE table_name = 'product_adds_edits_deletes'"
		let resp = await fetchData( sql, "/bigquery-sql" )

		// console.log({getColumns: resp.map( x => x.column_name).join(",")})
		setColumns(resp)	
		let final = []
		resp.forEach( x => {
			if(!["record_id","IS_ADD_EDIT_DELETE","BY_USER","marketplace"].includes(x.column_name)) {
				final.push(x)
			}
		})
		final = final.map( x => {
			return {
				...x,
				value: ""
			}
		})
		setDisplayColumns(final)
	}

	const getDataType = (type) => {

		console.log({context: "getDataType"})

		if([ "INT64","FLOAT64"].includes(type)) return "number";
		if(type == "STRING") return "text";
	}

	const getClientList = async () => {
		let resp = await fetchData(`SELECT * FROM client_entity_info_v2 WHERE agency_id = ${neonUser.agency_id} ORDER BY id ASC`,"/neon-query")

		console.log({getClientList: {resp}})

		setClientList(resp)
	}

	const getUserInfo = async (id) => {

		console.log({context: "getUserInfo"})

		let resp = await fetchData(`SELECT * FROM auth0_user WHERE id = ${id}`, "/neon-query");

		console.log({getUserInfo: {resp}})

		setUserInfo(resp[0])
	}

	const getRoles = async () => {
		
		console.log({context: "getRoles"})

		let resp = await fetchData("SELECT unnest(enum_range(NULL::roles))", "/neon-query")

		
		resp = resp.map( x=> x.unnest)
		console.log({getRoles: {resp}})

		setRoles(resp.filter( x=> !['admin','owner'].includes(x)))
		return
	}

	const createProducModifyLog = async (IS_ADD_EDIT_DELETE, marketPlace) => {

		console.log({context: "createProducModifyLog"})

		console.log({createProducModifyLog: {IS_ADD_EDIT_DELETE, marketPlace}})
		let colArr = displayColumns.map( x => x.column_name)
		let max= 999999999999, min = 100000000000
		let sql = ''

		if(IS_ADD_EDIT_DELETE == 'DELETE') {
			sql = `
			INSERT INTO bispoke-sidekick.product_info.product_modify_logs 
			(record_id, IS_ADD_EDIT_DELETE, BY_USER, TIMESTAMP)
			VALUES
			(
			${marketPlace.record_id},
			'DELETE',
			'${token.idTokenPayload.sub}',
			'${moment().format('YYYY-MM-DD HH:mm:ss')}')

		`
		}
		else {
			sql = `
			INSERT INTO bispoke-sidekick.product_info.product_modify_logs
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
			BY_USER,
			TIMESTAMP)

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
			'${IS_ADD_EDIT_DELETE}',
			'${token.idTokenPayload.sub}',
			'${moment().format('YYYY-MM-DD HH:mm:ss')}')`;

		}
		



			let resp  = await fetchData(sql, "/bigquery-sql")

	}


	const getAllCountries =async () => {


		let resp = await fetch('./src/country.json')

		resp = await resp.json()
		let top = resp.filter( x => ["US","CA","MX"].includes(x.cca2))
		top = top.sort((a, b) => b.name.common.localeCompare(a.name.common));
		resp = resp.sort((a, b) => a.name.common.localeCompare(b.name.common)).filter( x => !["US","CA","MX"].includes(x.cca2));
		resp = [...top, ...resp]

		console.log({getAllCountries: resp})

		setCountries(resp)
	}

	const getSrollHeight = (h) => {
		setHh(h)
	}

	const getBrands = async () => {


		let resp = await fetchData(`SELECT * FROM brand where user_id = '${neonUser.user_id}'`, "/neon-query")

		// console.log({getBrands: {resp}})

		setBrandList(resp)
	}



	return (
		<AppContext.Provider value={{
			cols,
			selectedId, setSelectedId,
			fetchData,
			getKeys,
			currentPage, setCurrentPage,
			pages, setPages,
			pageLimit,
			count, setCount ,
			authUser, setAuthUser,
			token, setToken,
			initUrl, setInitUrl,
			list, setList,
			loginLoaded, setLoginLoaded,
			getIds,
			ids, setIds,
			neonUser, setNeonUser,
			getNeonUser,
			marketplaceList, setMarketplaceList,
			getMarketPlace,
			filterIds,
			getList,
			getRoleView,
			getColumns,
			columns, setColumns,
			displayColumns, setDisplayColumns,
			getDataType,
			getClientList,
			clientlist, setClientList,
			getUserInfo,
			userInfo, setUserInfo,
			agencyList, setAgencyList,
			getRoles,
			roles, setRoles,
			createProducModifyLog,
			mode, setMode,
			getAllCountries,
			countries, setCountries,
			hh, setHh,
			getSrollHeight,
			offCanvas, setOffCanvas,
			popupSidebarType, setPopupSidebarType,
			showCanvas, setShowCanvas,
			getBrands,
			brandList, setBrandList
		}}>

			{children}
		</AppContext.Provider>

	)
}