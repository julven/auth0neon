const SidebarAccount = ({path}) => {

	let navigate = useNavigate()


	return (
		<div className="d-flex flex-column gap-3">

			<UiButton2 text={"Back to Dashboard"} submit={() => navigate("/brand")}/>

			<Link to="/account" style={{textDecoration: "none"}}>

				<div className="d-flex gap-2">

					{path == ("/account") ?
					<div style={{width: 35, height: 35}} className="bg-white p-1 rounded opacity-75">
						<img src="./src/profile-on.png" className="w-100 opacity-100"/>
					</div>
					:
					<div  className="p-1 rounded off-icon">
						<img src="./src/profile-off.png" className="w-100"/>
					</div>
					}
						
					<p className="text-white fs-6 m-0 align-self-center">Your Profile</p>
					
				</div>
			</Link>

			<Link to="/account/change-pass" style={{textDecoration: "none"}}>

				<div className="d-flex gap-2">

					{path.includes("/change-pass") ?
					<div style={{width: 35, height: 35}} className="bg-white p-1 rounded opacity-75">
						<img src="./src/pass.png" className="w-100 opacity-100"/>
					</div>
					:
					<div className="p-1 rounded off-icon">
						<img src="./src/pass-off.png" className="w-100"/>
					</div>
					}
						
					<p className="text-white fs-6 m-0 align-self-center">Change Password</p>
					
				</div>
			</Link>

		</div>
	)
}