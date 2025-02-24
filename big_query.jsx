const BigQuery = () => {


	const { 
		selectedId, 
		fetchData, 
		getKeys,
		currentPage, setCurrentPage,
		pages, setPages,
		count, setCount,
		pageLimit,
		list, setList
		
	} = useContext(AppContext)
	const [dataList, setDataList] = useState([])

	const [selectedColumns, setSelectedColumns] = useState([])
	const [columns, setColumns] = useState([])


	const resetPage = () => {
		setDataList([])
		setPages(0)
		setCurrentPage(0)
		setCount(0)
	}

	const getListCount = async () => {
		
		let sql = `SELECT COUNT(*) as count  FROM bispoke-sidekick.product_info.product_information_unique WHERE client_id = ${selectedId}`

		let resp = await fetchData(sql, "/bigquery-sql")
		let total = Math.ceil(resp[0].count / pageLimit)
		console.log({getListCount: {resp}})
		// setCount(resp[0].count)
		setPages(total)	
		
		
	

		return
	}

	const getDataList = async () => {
		setDataList([])
		
		console.log("getDataList "+ (Math.random() + 1).toString(36).substring(7))
		

		sql = `SELECT *  FROM bispoke-sidekick.product_info.product_information_unique WHERE client_id = ${selectedId} LIMIT ${pageLimit} OFFSET ${pageLimit * currentPage}`
		
		resp = await fetchData(sql, "/bigquery-sql")	

		console.log({getDataList: {resp}})

		setDataList(resp)
	
		return
	}

	const selectedColumnsHandler = (col) => {
		// console.log({selectedColumnsHandler: {col}})
		// return
		if(selectedColumns.includes(col)) {
			setSelectedColumns(selectedColumns.filter( x => x != col))
		}
		if(!selectedColumns.includes(col)) {
			setSelectedColumns([...selectedColumns, col])
		}
	}

	useEffect(() => {
		// if(list.length > 0) {
		if(selectedId >= 0) {
			;(async () => {
				resetPage()
	 			await getListCount()
		 		await getDataList()
		 		
		 	})()
		}
			
	}, [selectedId])

	useEffect(() => {
		
		if(selectedId >= 0)  getDataList()
	}, [currentPage])

	useEffect(() => {
		setSelectedColumns(columns)
		// console.log(columns)
	}, [columns])

	// useEffect(() => {

	// 	console.log({selectedColumns})
	// }, [selectedColumns])

	useEffect(() => {
		if(dataList.length > 0 && columns.length == 0) setColumns(Object.keys(dataList[0]))
	}, [dataList])

	return(
		<div>
			<p>
				big query <br/>
				{/*showing {count} result(s)*/}
			</p>

			<p>column list</p>
			<div>
			{columns.map( (x, i) => 
				<span key={i}>
					<input type="checkbox" name="columns" checked={selectedColumns.includes(x)} onChange={() => selectedColumnsHandler(x)}/>&nbsp;{x}&nbsp;
				</span>
			)}
			</div>
			<br/>

			<BigQueryPagination />


			<div style={{maxWidth: '100%', overflowX: "scroll"}}>
				{dataList.length> 0 ? 

				<table className="entity-table" hidden={dataList.length == 0}>	
					<thead>
						<tr>
							{getKeys(dataList[0]).map( xx => (
							<th key={xx} hidden={!selectedColumns.includes(xx)}>
								{xx}
							</th>
							))

							}
						</tr>
					</thead>
					<tbody>
						{dataList.map( (x, i) => (
						<tr key={`${x}-${i}`}>
							{getKeys(x).map( (xx, ii) => (
							<td key={`${ii}-${xx}`}  hidden={!selectedColumns.includes(xx)}>
								{x[xx]}
							</td>
							))

							}

						</tr>

						))

						}
					</tbody>
				</table>
				:
				null
				}
					
			</div>

		</div>

	)
}