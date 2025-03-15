const SidebarDashboardBrand = ({path}) => {




	return (
		<>
			<Link to="/" style={{textDecoration: "none"}}>
				<div className="d-flex gap-2">
					{path == "/" ?
					<div style={{width: 35, height: 35}} className="bg-white p-1 rounded opacity-75">
						<img src="./src/home.png" className="w-100 opacity-100"  />
					</div>
					:
					<div style={{width: 35, height: 35}} className=" p-1 rounded ">
						<img src="./src/home-off.png" className="w-100"  />
					</div>
					}
					<p className="text-white fs-6 m-0 align-self-center">Home</p>				
				</div>
			</Link>

			
			<Link to="/brand" style={{textDecoration: "none"}}>
				<div className="d-flex gap-2">
					{path.includes( "brand") ?
					<div style={{width: 35, height: 35}} className="bg-white p-1 rounded opacity-75">
						<img src="./src/account-on.png" className="w-100 opacity-100"  />
					</div>
					:
					<div style={{width: 35, height: 35}} className=" p-1 rounded ">
						<img src="./src/account.png" className="w-100 "  />
					</div>
					}
						
					<p className="text-white fs-6 m-0  align-self-center">Account/Brands</p>
					
				</div>
			</Link>
		</>
	)
}