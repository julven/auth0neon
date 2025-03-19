const UiInput3 = ({w, value, setSearch}) => {




	return (
		<div className="input3 d-flex justify-content-start gap-1">
			<div style={{width: 15, height: 15, marginTop: 7}} >
				<img  src="./src/search.png" style={{width: "100%", height: "100%"}}/>
			</div>
			<div  className="align-self-center w-100">
				<input type="text" value={value} onChange={e => setSearch(e.target.value)}/>
			</div>
			
		</div>

	)
}