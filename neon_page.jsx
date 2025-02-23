const NeonPage = () => {

	const { selectedId, setSelectedId, fetchData, getKeys,list, setList } = useContext(AppContext)

	const {id} = useParams()

	const [ids, setIds] = useState([])

	
	const [loading, setLoading] = useState(false)
	const [marketplaceList, setMarketplaceList] =useState([])
	const [agencyList, setAgencyList] = useState([])



	const getIds = async () => {


		let resp = await fetchData("SELECT DISTINCT(id) FROM client_entity_info_v2 ORDER BY id", "/neon-query")

		console.log({getIds: {resp, id}})

		setIds(resp.map( x => x.id))
		return
	}

	const getList = async () => {
		setSelectedId(id)

		let resp = await fetchData("SELECT * FROM client_entity_info_v2 WHERE id = "+id, '/neon-query')

		console.log({getList: {resp, id}})


		setList(resp)
		

		return
		
	}

	

	const getMarketPlace = async () => {

		let resp = await fetchData("SELECT * FROM marketplace_info","/neon-market")

		console.log({getMarketPlace: {resp}})

		setMarketplaceList(resp)	

		return
	}

	const getAgencyList = async () => {

		let resp  = await fetchData("SELECT * FROM client_agency_info", "/neon-market")

		console.log({getAgencyList: {resp}})

		setAgencyList(resp)

		return

	}

	const getAgencyName = (id) => {
		return agencyList.filter( x => x.id == id)[0].agency_name
	}

	const getMarketPlaceCountry = (id) => {

		return marketplaceList.filter( x => x.marketplaceid == id)[0].country
	}



	useEffect(() => {

		console.log("neon-query")

		;(async () => {
			setLoading(true)
			await getIds();
			await getMarketPlace()
			await getAgencyList()
			// getList()
			
			setLoading(false)
		})()
		

		
	}, [])



	useEffect(() => {
		console.log({id})
		if(id) {
			getList()

		} 
	}, [id])
	

	useEffect(() => {
		console.log({ids})
		
	}, [ids])


	

	return (
		<div>
			<p>list of entity id</p>
			
			<div style={{maxWidth: '100%', overflowX: "scroll"}}>
				{ids.map( x => (
				<span key={x}>
					<Link to={`/${x}`}>{x}</Link>&nbsp;
				</span>
				
				))

				}
			</div>
			{list.length > 0?
			<div>
				<p>
				entity id: {selectedId} <br/>

				client info id: {list[0].client_info_id || 'n/a'}<br/>
				company name: {list[0].company_name} <br/>
				agency name: { agencyList.length > 0 && getAgencyName(list[0].agency_id)} <br/>
				
				</p>
				<div style={{maxWidth: '100%', overflowX: "scroll"}}>
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
									{xx == 'marketplace_id' ? 
									`${marketplaceList.lenegth > 0 &&  getMarketPlaceCountry(x[xx])}`
									: 
									xx == 'agency_id' ? 
									`${agencyList.length > 0  && getAgencyName(x[xx])}`
									: 
									x[xx]
									}
								</td>
								))

								}

							</tr>

							))

							}
						</tbody>
					</table>
				</div>

				<BigQuery />	


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