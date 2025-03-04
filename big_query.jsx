const BigQuery = () => {


	const { 
		cols,
		selectedId, 
		fetchData, 
		getKeys,
		currentPage, setCurrentPage,
		pages, setPages,
		count, setCount,
		pageLimit,
		list, setList,
		neonUser
		
	} = useContext(AppContext)
	const [dataList, setDataList] = useState([])

	const [selectedColumns, setSelectedColumns] = useState([])
	const [columns, setColumns] = useState([])

	const [loaded, setLoaded] = useState(false)



	const resetPage = () => {
		setDataList([])
		setPages(0)
		setCurrentPage(0)
		setCount(0)
	}

	const getListCount = async () => {
		
		// let sql = `SELECT COUNT(*) as count  FROM bispoke-sidekick.product_info.product_information_unique WHERE client_id = ${selectedId}`
		let sql = `
			SELECT COUNT(*) AS count FROM
			(
			SELECT ${cols.join(",")} FROM 
			bispoke-sidekick.product_info.product_information_unique 
			WHERE client_id = ${selectedId}
			UNION ALL
			SELECT ${cols.join(",")} FROM 
			bispoke-sidekick.product_info.product_adds_edits_deletes 
			WHERE client_id = ${selectedId}
			)

		`
		let resp = await fetchData(sql, "/bigquery-sql")
		let total = Math.ceil(resp[0].count / pageLimit)
		console.log({getListCount: {resp}})
		setCount(resp[0].count)
		setPages(total)	
		
		
	

		return
	}

	const getEditedList = async () => {

		let sql = `
			SELECT ${cols.join(",")} 
			FROM bispoke-sidekick.product_info.product_adds_edits_deletes 
			WHERE IS_ADD_EDIT_DELETE = 'EDIT'
		`

		let resp = await fetchData(sql, "/bigquery-sql")

		console.log({getEditedList: {resp}})

		
	}

	const replaceProductInfo = () => {
		// console.log({replaceProductInfo: {dataList, editedList}})
		let newList = dataList.map( x => {

			let edited = editedList.map( xx => xx.record_id)

			if(edited.includes(x.record_id)) return editedList.filter(xx => xx.record_id == x.record_id)[0];
			else return x
		})

		console.log({replaceProductInfo: {newList}})
		return newList
		// setDataList(newList)

	}

	const getDataList = async () => {
		
		setDataList([])
		
		console.log("getDataList ")
		
		let sql1 = `
			SELECT ${cols.join(",")} 
			FROM bispoke-sidekick.product_info.product_adds_edits_deletes 
			WHERE IS_ADD_EDIT_DELETE = 'EDIT'
		`

		let editedList = await fetchData(sql1, "/bigquery-sql")

		let sql3 = `
			SELECT CAST(record_id AS STRING) as record_id
			FROM bispoke-sidekick.product_info.product_adds_edits_deletes
			WHERE IS_ADD_EDIT_DELETE = 'DELETE'
		`

		let deleteList = await fetchData(sql3, "/bigquery-sql")

		deleteList = deleteList.map(x => x.record_id)

		console.log({getDataList: {deleteList, sql3}})

		
		let sql2 = `
			SELECT* FROM 
				(
					SELECT 
						${cols.join(",")}
						FROM bispoke-sidekick.product_info.product_adds_edits_deletes 
						WHERE client_id = ${selectedId}
						AND IS_ADD_EDIT_DELETE = 'ADD'
						${deleteList.length > 0 ? `AND record_id NOT IN (${deleteList.join(",")})`: ""}
					UNION ALL
					SELECT 
						${cols.join(",")} 
						FROM bispoke-sidekick.product_info.product_information_unique 
						WHERE client_id = ${selectedId}
						${deleteList.length > 0 ? `AND record_id NOT IN (${deleteList.join(",")})`: ""}
				) 
			LIMIT ${pageLimit} OFFSET ${pageLimit * currentPage}
		`
		let list  = await fetchData(sql2, "/bigquery-sql")	

		// setDataList(list)
		
		console.log({getDataList: {list, editedList}})

		if(editedList.length > 0) {
			list = list.map( x => {

				let edited = editedList.map( xx => xx.record_id)

				if(edited.includes(x.record_id)) return editedList.filter(xx => xx.record_id == x.record_id)[0];
				else return x
			})

			console.log({getDataList: {list}})
		}

		setDataList(list)
		setLoaded(true)

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
		console.log({currentPage})
		if(loaded)  getDataList()
	}, [currentPage])

	useEffect(() => {
		setSelectedColumns(columns)
		// console.log(columns)
	}, [columns])


	useEffect(() => {
		if(dataList.length > 0 && columns.length == 0) {
			
			setColumns(Object.keys(dataList[0]))
		}

		console.log({dataList})

	}, [dataList])





	return(
		<div>
			<p>
				big query <br/>
				showing {count} result(s)<br/>
				{["owner", "editor"].includes(neonUser.role) ? <Link to="/add-product">add product</Link> : null}
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
							{["owner", "editor"].includes(neonUser.role) && <th></th>}
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
							{["owner", "editor"].includes(neonUser.role) ?
							<td>
								<div>
									<span><Link to={`/edit-product/${x.record_id}`}>edit</Link></span>
									&nbsp;
									<span><BigQueryDelete product={x} getDataList={getDataList} setLoaded={setLoaded}/></span>
								</div>
							</td>
							:
							null

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