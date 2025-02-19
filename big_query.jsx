const BigQuery = () => {


	const { selectedId, fetchData, getKeys } = useContext(AppContext)
	const [dataList, setDataList] = useState([])

	const getDataList = async () => {
		setDataList([])
		console.log("getDataList")
		let sql = `SELECT *  FROM bispoke-sidekick.product_info.product_information_unique WHERE client_id = ${selectedId}`
		

		let resp = await fetchData(sql, "/bigquery-sql")

		console.log({getDataList: { resp }})

		setDataList(resp)

	}

	useEffect(() => {
		if(selectedId) {

			getDataList()
		}
	}, [selectedId])

	return(
		<div hidden={dataList.length == 0}>
			<p>
				big query <br/>
				showing {dataList.length} result(s)
			</p>

			<div style={{maxWidth: '100%', overflowX: "scroll"}}>
				{dataList.length> 0 ? 

				<table className="entity-table">	
					<thead>
						<tr>
							{getKeys(dataList[0]).map( xx => (
							<th key={xx}>
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
							<td key={`${ii}-${xx}`}>
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