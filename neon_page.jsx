const NeonPage = () => {

	const [ids, setIds] = useState([])
	const [list, setList] = useState([])
	const [selectedId, setSelectedId] = useState(null)

	const fetchData = async (query) => {
		let headerData = new Headers()
		headerData.append("Content-Type", "application/json");

		let data = await fetch(`https://y74j6u4w7p35lv2qf3z3dicizm0dpces.lambda-url.us-east-1.on.aws/neon-query`, {
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


	const getIds = async () => {

		let resp = await fetchData("SELECT DISTINCT(id) FROM client_entity_info_v2 ORDER BY id")

		console.log({getIds: {resp}})

		setIds(resp.map( x => x.id))
		return
	}

	const getList = async (e, id) => {
		e.preventDefault()

		// console.log({getList: {id}})

		let resp = await fetchData("SELECT * FROM client_entity_info_v2 WHERE id = "+id)

		console.log({getList: {resp}})

		setList(resp)
		setSelectedId(id)
		return
	}

	const getKeys = (x) => {
		let keyArr = Object.keys(x)

		console.log({getKeys: {keyArr}})
		return keyArr
	}



	useEffect(() => {
		getIds()
	}, [])

	useEffect(() => {
		if(ids.length > 0)console.log({ids})
	}, [ids])

	return (
		<div>
			<p>list of entity id</p>
			<div style={{maxWidth: '100%', overflowX: "scroll"}}>
				{ids.map( x => (
				<span key={x}>
					<a href="#"  onClick={e => getList(e, x)}>{x}</a>&nbsp;
				</span>
				
				))

				}
			</div>
			{selectedId != null && list.length > 0?
			<div>
				<p>selected Entity '{selectedId}'</p>
				<table className="entity-table">	
					<thead>
						<tr>
							{getKeys(list[0]).map( xx => (
							<th key={xx}>
								{xx}
							</th>
							))

							}
						</tr>
					</thead>
					<tbody>
						{list.map( (x, i) => (
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

			</div>
			:
			null
			}

		<style jsx="true">{`
			
			.entity-table tr, .entity-table td,  .entity-table th, .entity-table  {
				border: 1px solid black;
				border-collapse: collapse;
				padding: 3px;
			}
		`}

		</style>
		</div>

	)
}