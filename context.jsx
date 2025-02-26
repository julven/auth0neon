let AppContextProvider = ({children}) => {

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

	return (
		<AppContext.Provider value={{
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
			getNeonUser
			
		}}>

			{children}
		</AppContext.Provider>

	)
}