const UiInput4 = ({
	value, field, changeHandler
}) => {

	const date = useRef(null)

	const showDatePicker = () => {
		date.current.showPicker()
	}

	useEffect(() => {
		if(date)console.log(date.current.value)
	}, [date])

	return (
		<div className="input1">
			<div className="d-flex gap-2 justify-content-between" onClick={showDatePicker}>
				<input ref={date} className="flex-grow-1 poppins input-date w-100 align-self-center" type="date" 
				value={value}  onChange={e => changeHandler(e.target.value, field)}/>
				
				<div style={{width: 20, height: 20}} className="d-flex align-self-center">
					<img src="./src/calendar.png" style={{width:'100%', height: '100%'}} className="align-self-center"/>
				</div>
			</div>
		</div>
	)
}