const NeonPage = () => {

	const { selectedId, setSelectedId, fetchData, getKeys,list, setList, getIds,  ids, setIds, neonUser} = useContext(AppContext)

	const {id} = useParams()
	const navigate = useNavigate()

	

	
	const [loading, setLoading] = useState(false)
	const [marketplaceList, setMarketplaceList] =useState([])
	const [agencyList, setAgencyList] = useState([])


	const getRoleView = () => {

		return ["admin","owner"].includes(neonUser.role) 
	}
	

	const getList = async () => {
	
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

		// return marketplaceList.filter( x => x.marketplaceid == id)[0].country
		return id
	}

	const filterIds = async () => {

		let resp = await fetchData(`SELECT DISTINCT(id) AS id FROM client_entity_info_v2 WHERE agency_id = ${neonUser.agency_id}`,"/neon-query")

		console.log({filterIds: {resp}})

		resp = resp.map( x => x.id)



		setIds(resp)
	}



	useEffect(() => {

		console.log("neon-query")

		;(async () => {
			setLoading(true)
			// await getIds();
			await getMarketPlace()
			await getAgencyList()
			// getList()
			
			setLoading(false)
		})()
		

		
	}, [])



	useEffect(() => {
		console.log({id, neonUser})
		 if(id && neonUser.role) getList();
		
	}, [id, neonUser])

	useEffect(() => {
		if(neonUser.role == "normal") {
			console.log({neonUser})
			navigate(`/${neonUser.entity_id}`)

		}
		if(neonUser.role == "owner") {
			filterIds()
		}
	}, [neonUser])
	

	useEffect(() => {

	},[neonUser])



	

	return (
		<div>
			
			{neonUser && getRoleView() ?
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
			</div>
			
			:
			null

			}
			
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
									{
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

		
		</div>

	)
}