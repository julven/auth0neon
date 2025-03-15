const UiButton2 = ({text, submit}) => {



	return(
		<div 
		style={{cursor: "pointer"}}
		onClick={submit}
		className="button2  d-flex ">

			<div 
			 className="d-flex justify-content-center"
			style={{border: "1px solid white", width: 40, height: 40, borderRadius: "25px"}}>
				<div style={{width: "15px"}} className="align-self-center">
					<img src="./src/arrow.png" style={{width: "100%", transform: "scale(-1, 1)"}}/>
				</div>
				
			</div>
			<div className="align-self-center d-flex justify-content-center flex-grow-1">
				<p className="fs-6 text-white mb-0 align-self-center">{text}</p>
			</div>
			
			

		</div>
	)
}