const UiSubscription = ({
	subscribed,
	showProductName,	
	cancelSubscription,
	products,
	range,
	setRange,
	createSubscription,
	viewPaymentHistory,
}) => {

	const navigate = useNavigate()
	const  {
		hh, neonUser,
	} = useContext(AppContext)

	const goBack = (e) => {
		e.preventDefault()
		navigate("/account")	
	}


	return (
		<div className="login-bg ">
			
			<div className="d-flex justify-content-center " style={{height: hh}} >
				<div className="align-self-center ">
					<div className="d-flex justify-content-center mb-3">
						<div className="bispoke-logo align-self-center"></div>
					</div>
					<div className="login-container" >

						<div className="d-flex " style={{padding: "0px 0px 8px 18px"}}>
							<i 
							onClick={goBack}
							style={{cursor: "pointer"}} className="bi bi-chevron-left fs-4 align-self-center"></i>
							<p className="fs-2 mb-0">Subscibe</p>
						</div>


						<div style={{padding: "0px 40px"}}>
							<div style={{height: 2}} className="gradiant-h mb-4 "></div>

							{subscribed.length > 0 ?
							<>
								<div>
									<p className="poppins text-center">you have subscribed to the following plan</p>
								</div>
								{subscribed.map(x => (
								<div key={x.id} className="text-center pb-3"	>
									<div className="lh-1 mb-4">
										<p className="fs-4">{showProductName(x,'name')}</p>	
										<small className="poppins fs-6 text-secondary">{showProductName(x,'description')}</small>	
									</div>
									
									{/*<button onClick={() => cancelSubscription(x)}>cancel subscription</button>*/}
									<UiButton1 text="Cancel Subscription" submit={cancelSubscription}/>
								</div>


								))

							}
							</>
							:
							<>
							<div className="w-100 mb-4">
								<p className="poppins mb-1 fw-bold">EMAIL ADDRESS</p>
								<UiInput1 field="email" value={neonUser.email || ''}  readOnly={true}/>
							</div>	
							<div className="poppins text-center">
								<small >Select Subscription Plan by Scrolling The Slider Based On Anual Revenue Under Management</small>
							</div>
							<div className="my-3">			
								<input   
								min={0} max={products.length - 1}
								value={range} onChange={e => setRange(e.target.value)}
								type="range" className="slider w-100" />
							</div>		
							<div className="poppins text-center text-secondary mb-3">
							 {products.length > 0 ?
								<small>
								{products[range].name}<br/>
								{products[range].description}

								</small>
								:
								null
							}
						  	</div>
						  	<div className="text-center d-flex flex-column gap-3">
							  	<UiButton1 text="Subscribe" submit={createSubscription}/>
							  	<a className=" text-secondary" href="#" onClick={viewPaymentHistory} style={{textDecoration: "none", fontSize: 14}}>Payment History</a>
						  	</div>

					  		</>
						  }

						</div>
						
						
						{/*<a href="#" onClick={goBack}>back</a>*/}
					</div>
				</div>
				
			</div>
		</div>
	)
}