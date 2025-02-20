let AppContextProvider = ({children}) => {

	const [selectedId, setSelectedId] = useState(null)

	const [currentPage, setCurrentPage] = useState(null)
	const [pages, setPages] = useState(0)
	const [pageLimit] = useState(100)
	const [count, setCount ] = useState(0)
	

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

	return (
		<AppContext.Provider value={{
			selectedId, setSelectedId,
			fetchData,
			getKeys,
			currentPage, setCurrentPage,
			pages, setPages,
			pageLimit,
			count, setCount ,
	
		}}>

			{children}
		</AppContext.Provider>

	)
}