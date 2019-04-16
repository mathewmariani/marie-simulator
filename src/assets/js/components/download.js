Vue.component('download', {
	template: `
		<div class="tab-pane" id="download" role="tabpanel">
			<form>
				<div class="form-group">
					<label for="inputEmail4">Filename</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder="Filename">
					<small id="emailHelp" class="form-text text-muted">This file comes in a zipped (.zip) format.</small>
				</div>
				<div class="form-group">
					<label for="inputEmail4">Generated Files</label>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
						<label class="form-check-label" for="defaultCheck1">
							Source (.mas)
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
						<label class="form-check-label" for="defaultCheck1">
							Register Translation Language (.trl)
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
						<label class="form-check-label" for="defaultCheck1">
							Lorem Ipsum (.mar)
						</label>
					</div>
					<div class="form-check">
						<input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
						<label class="form-check-label" for="defaultCheck1">
							Output (.out)
						</label>
					</div>
				</div>
				<button type="submit" class="btn btn-outline-primary">
					Download (.zip)
				</button>
			</form>
		</div>
	`
})