const BigQueryPagination = () => {


	const { 
		
		currentPage, setCurrentPage,
		pages, setPages,
		pageLimit
	} = useContext(AppContext)

	const [showCustomPage, setShowCustomPage] = useState(false)
	const [customPage, setCustomPage] = useState(0)

	const customNavigatePage = (e) => {

		e.preventDefault()

		if(customPage + 1 <= pages && customPage - 1 >=-1) {
			setCurrentPage(customPage)
			setShowCustomPage(false)
		}
	}

	const navigatePage = async (val, e) => {


		e.preventDefault()

		if(val ) {
			console.log({navigatePage: {currentPage: currentPage + 1, pages, val}})
			if(currentPage + 1 < pages) setCurrentPage(currentPage + 1)
			return
		}

		if(!val ) {
			console.log({navigatePage: {currentPage: currentPage - 1, pages, val}})
			if(currentPage - 1 >=0 ) setCurrentPage(currentPage - 1)
			return
		}

	}


	useEffect(() => {
		if(showCustomPage) setCustomPage(currentPage)
	}, [showCustomPage])


	return (
		<div>
			<div>
				<span hidden={showCustomPage}><a href="#"  onClick={(e) => navigatePage(false, e)}>prev</a></span>&nbsp;
				<span>
				{showCustomPage ? 
					<span>
						<input type="number" value={customPage + 1} onChange={e => setCustomPage(e.target.value - 1)} style={{width: "50px"}}/>&nbsp;
						<span ><a href="#" onClick={(e) =>customNavigatePage(e)}>ok</a></span> &nbsp;
						<span ><a href="#" onClick={(e) =>{e.preventDefault();setShowCustomPage(false)}}>x</a></span> &nbsp;
					</span>
				:
				<span>
					<span>{currentPage + 1}</span>&nbsp;
					<span ><a href="#" onClick={(e) =>{e.preventDefault();setShowCustomPage(true)}}>...</a></span>&nbsp;
				</span>

				}
				</span>
				
				
				<span>/</span>&nbsp;
				<span>{pages}</span>&nbsp;
				<span  hidden={showCustomPage}  ><a href="#" onClick={(e) => navigatePage(true, e)}>next</a></span>&nbsp;
				
			</div>
			<br/>
	

		</div>

	)
}