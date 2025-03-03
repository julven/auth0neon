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

	const fetchData = async (query,endpoint) => {
		let headerData = new Headers()
		headerData.append("Content-Type", "application/json");

		let data = await fetch(`${apiUrl}${endpoint}`, {
			method:"POST",
			headers: headerData,
			body: JSON.stringify({query})
		})

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

		let sql = `SELECT DISTINCT(id) FROM client_entity_info_v2  ORDER BY id`
		
		let resp = await fetchData(sql, "/neon-query")

		console.log({getIds: {resp}})

		setIds(resp.map( x => x.id))
		return resp.map( x => x.id)
	}

	const filterIds = async () => {

		

		let resp = await fetchData(`SELECT DISTINCT(id) AS id FROM client_entity_info_v2 WHERE agency_id = ${neonUser.agency_id} ORDER BY id` ,"/neon-query")

		console.log({filterIds: {resp}})

		resp = resp.map( x => x.id)



		setIds(resp)
	}

	const getNeonUser = async () => {

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

		let resp = await fetchData("SELECT * FROM marketplace_info","/neon-market")

		console.log({getMarketPlace: {resp}})

		setMarketplaceList(resp)	

		return
	}

	const getRoleView = () => {

		return ["admin","owner"].includes(neonUser.role) 
	}

	const getList = async (id) => {

		console.log({filterIds: {id}})
	
		if(neonUser.role == "normal" && neonUser.entity_id != Number(id)) return;

		let addQuery = neonUser.agency_id ? `WHERE agency_id = ${neonUser.agency_id} AND id = ${Number(id)}` : ''
		
		let resp = await fetchData("SELECT * FROM client_entity_info_v2 "+addQuery, '/neon-query')

		
		console.log({getList: {neonUser, resp}}	)

		// if((neonUser.role == "admin") || (neonUser.role == "normal" && neonUser.entity_id == Number(id))) {
		if( getRoleView() || (neonUser.role == "normal" && neonUser.entity_id == Number(id))) {
			setList(resp);

			setSelectedId(id)
		}
		
		

		return
		
	}

	const getColumns = async () => {
		console.log("getColumns")
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

		if([ "INT64","FLOAT64"].includes(type)) return "number";
		if(type == "STRING") return "text";
	}

	const getClientList = async () => {
		let resp = await fetchData(`SELECT * FROM client_entity_info_v2 WHERE agency_id = ${neonUser.agency_id} ORDER BY id ASC`,"/neon-query")

		console.log({getClientList: {resp}})

		setClientList(resp)
	}

	const getUserInfo = async (id) => {

		let resp = await fetchData(`SELECT * FROM auth0_user WHERE id = ${id}`, "/neon-query");

		console.log({getUserInfo: {resp}})

		setUserInfo(resp[0])
	}

	const getRoles = async () => {

		let resp = await fetchData("SELECT unnest(enum_range(NULL::roles))", "/neon-query")

		
		resp = resp.map( x=> x.unnest)
		console.log({getRoles: {resp}})

		setRoles(resp.filter( x=> !['admin','owner'].includes(x)))
		return
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
			
		}}>

			{children}
		</AppContext.Provider>

	)
}