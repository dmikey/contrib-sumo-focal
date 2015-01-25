define(['sumojs/dist/sumo-min'], function(sumo){
	return sumo.create({
		create: function() {
			//get all focal containers
			this.focalContainers = document.getElementsByClassName('focal-container');
			//catch keyboard events
			document.body.addEventListener("keydown", this.catchKey.bind(this));

		},
		catchKey: function(e) {
			// 37 <
			// 38 ^
			// 39 >
			// 40 v
			var directions = {
				'37': 'left',
				'38': 'top',
				'39': 'right',
				'40': 'bottom',
				'13': 'enter'
			};


			var key = event.keyCode || event.which;

			if(directions[key] == 'enter') {
				//if focal support is mixedin
				if(this.focused.focalSupport) {
					//dispatch focused method
					this.focused.focalSelected(this.focused);
				}
			} else {
				var nearest = this.getNearest(directions[key]);
			}
		},
		getNearest: function(sDirection){
			//get closest to 0,0 for now - add pointer support later
			if(!this.focused){
				this.checkFocalContainer();
				this.focal();
			} else {
				this.focal(sDirection);
			}
		},
		focal: function(sDirection){
				var focals;
				var focalChanged = false;

				if(this.focused.className.indexOf('focal-container') > -1){
					focals = this.focused.getElementsByClassName('focal');
					//get first focus
					this.currentFocal = focals[0];
					this.currentContainer = this.focused;
					this.focused = focals[0];
					focalChanged = true;
				} else {
					//get who is next
					focals = this.currentContainer.getElementsByClassName('focal');
					var currentFocal = this.currentFocal;



				if(sDirection == "right"){

						//grab all focals (cache for better perf? static ui
						var focalsXY = [];
						//get all focal x,y upper left in this container
						for (i = 0; i < focals.length; i++) {
							var rect = focals[i].getBoundingClientRect();
							focalsXY.push({left: rect.left, top: rect.top, focal: focals[i]})
						}

						//we are moving toward the bottom of the screen, who has a higher Y?
						var whoIsRight = focalsXY.filter(function(coords, i, arr){
							var left = coords.left;
							var delta = left - this.currentFocal.getBoundingClientRect().left;
							if(delta > 0){
								return true;
							}
							return false;
						}.bind(this));

						console.log(whoIsRight);
						//no one was above us in this container
						//todo:add logic for optional up - focal next focalContainer
						if(whoIsRight.length > 0) {
							var whoIsClosest = whoIsRight.reduce(function(previousValue, currentValue){
								if(!previousValue) {
									return currentValue
								} else {
									//closest top
									if(currentValue.left < previousValue.left) {
										return previousValue;
									}
								}
							}.bind(this));

							console.log('who', whoIsClosest);

							//if we couldn't reduce who was the closest on the plane, then we had
							//multiples in the plane. lets find out who is below us that has the closest
							//X
							if(typeof whoIsClosest == 'undefined') {
								var top = this.currentFocal.getBoundingClientRect().top;
								whoIsClosest = whoIsRight.reverse().reduce(function(previousValue, currentValue){
									if(!previousValue) {
										return currentValue
									} else {
										if( Math.abs(top - currentValue.top) > Math.abs(top - previousValue.top) ) {
											return previousValue;
										}
										return currentValue
									}
								}.bind(this));
							}
							this.currentFocal = whoIsClosest.focal;
							focalChanged = true;
						} else {
							//need to make this optional, if control should not allow container skip
							if(!focalChanged) {
								//need to find the next focalContainer if there is one to the right.
								for (i = 0; i < this.focalContainers.length; i++) {
									var rect = this.focalContainers[i].getBoundingClientRect();
									if(rect.left > this.currentContainer.getBoundingClientRect().left) {
										this.currentFocal = this.focalContainers[i];
										focalChanged = true;
									}
								}

								//no focal below, how about above?
								for (i = 0; i < this.focalContainers.length; i++) {
									var rect = this.focalContainers[i].getBoundingClientRect();
									if(rect.top > this.currentContainer.getBoundingClientRect().top) {
										this.currentFocal  = this.focalContainers[i];
										focalChanged = true;
									}
								}
							}
						}

					}

					if(sDirection == "left"){

						//grab all focals (cache for better perf? static ui
						var focalsXY = [];
						//get all focal x,y upper left in this container
						for (i = 0; i < focals.length; i++) {
							var rect = focals[i].getBoundingClientRect();
							focalsXY.push({left: rect.left, top: rect.top, focal: focals[i]})
						}

						//we are moving toward the bottom of the screen, who has a higher Y?
						var whoIsLeft = focalsXY.filter(function(coords, i, arr){
							var left = coords.left;
							var delta = this.currentFocal.getBoundingClientRect().left - left;
							if(delta > 0){
								return true;
							}
							return false;
						}.bind(this));

						console.log(whoIsLeft);
						//no one was above us in this container
						//todo:add logic for optional up - focal next focalContainer
						if(whoIsLeft.length > 0) {
							var whoIsClosest = whoIsLeft.reduce(function(previousValue, currentValue){
								if(!previousValue) {
									return currentValue
								} else {
									//closest top
									if(currentValue.left < previousValue.left) {
										return previousValue;
									}
								}
							}.bind(this));

							console.log(whoIsClosest);

							//if we couldn't reduce who was the closest on the plane, then we had
							//multiples in the plane. lets find out who is below us that has the closest
							//X
							if(typeof whoIsClosest == 'undefined') {
								var top = this.currentFocal.getBoundingClientRect().top;
								whoIsClosest = whoIsLeft.reduce(function(previousValue, currentValue){
									if(!previousValue) {
										return currentValue
									} else {
										if( Math.abs(top - currentValue.top) > Math.abs(top - previousValue.top) ) {
											return previousValue;
										}
										return currentValue
									}
								}.bind(this));
							}
							this.currentFocal = whoIsClosest.focal;
							focalChanged = true;
						} else {
							//need to make this optional, if control should not allow container skip
							if(!focalChanged) {
								//need to find the next focalContainer if there is one to the right.
								for (i = 0; i < this.focalContainers.length; i++) {
									var rect = this.focalContainers[i].getBoundingClientRect();
									if(rect.left < this.currentContainer.getBoundingClientRect().left) {
										this.currentFocal = this.focalContainers[i];
										focalChanged = true;
									}
								}

								//no focal below, how about above?
								for (i = 0; i < this.focalContainers.length; i++) {
									var rect = this.focalContainers[i].getBoundingClientRect();
									if(rect.top < this.currentContainer.getBoundingClientRect().top) {
										this.currentFocal  = this.focalContainers[i];
										focalChanged = true;
									}
								}
							}
						}

					}

					if(sDirection == "bottom"){

						//grab all focals (cache for better perf? static ui
						var focalsXY = [];
						//get all focal x,y upper left in this container
						for (i = 0; i < focals.length; i++) {
							var rect = focals[i].getBoundingClientRect();
							focalsXY.push({left: rect.left, top: rect.top, focal: focals[i]})
						}

						//we are moving toward the bottom of the screen, who has a higher Y?
						var whoIsBelow = focalsXY.filter(function(coords, i, arr){
							var top = coords.top;
							var delta = top - this.currentFocal.getBoundingClientRect().top;
							if(delta > 0){
								return true;
							}
							return false;
						}.bind(this));

						//no one was below us in this container
						//todo:add logic for optional down - focal next focalContainer
						if(whoIsBelow.length > 0) {
							var whoIsClosest = whoIsBelow.reduce(function(previousValue, currentValue){
								if(!previousValue) {
									return currentValue
								} else {
									//closest top
									if(currentValue.top > previousValue.top) {
										return previousValue;
									}
								}
							}.bind(this));

							//if we couldn't reduce who was the closest on the plane, then we had
							//multiples in the plane. lets find out who is below us that has the closest
							//X
							if(typeof whoIsClosest == 'undefined') {
								var left = this.currentFocal.getBoundingClientRect().left;
								whoIsClosest = whoIsBelow.reduce(function(previousValue, currentValue){
									if(!previousValue) {
										return currentValue
									} else {
										if( Math.abs(left - currentValue.left) > Math.abs(left - previousValue.left) ) {
											return previousValue;
										}
										return currentValue
									}
								}.bind(this));
							}
							this.currentFocal = whoIsClosest.focal;
							focalChanged = true;
						}

					}

					if(sDirection == "top"){

						//grab all focals (cache for better perf? static ui
						var focalsXY = [];
						//get all focal x,y upper left in this container
						for (i = 0; i < focals.length; i++) {
							var rect = focals[i].getBoundingClientRect();
							focalsXY.push({left: rect.left, top: rect.top, focal: focals[i]})
						}

						//we are moving toward the bottom of the screen, who has a higher Y?
						var whoIsAbove = focalsXY.filter(function(coords, i, arr){
							var top = coords.top;
							var delta = this.currentFocal.getBoundingClientRect().top - top;
							if(delta > 0){
								return true;
							}
							return false;
						}.bind(this));

						//no one was above us in this container
						//todo:add logic for optional up - focal next focalContainer
						if(whoIsAbove.length > 0) {
							var whoIsClosest = whoIsAbove.reduce(function(previousValue, currentValue){
								if(!previousValue) {
									return currentValue
								} else {
									//closest top
									if(currentValue.top < previousValue.top) {
										return previousValue;
									}
								}
							}.bind(this));

							//if we couldn't reduce who was the closest on the plane, then we had
							//multiples in the plane. lets find out who is below us that has the closest
							//X
							if(typeof whoIsClosest == 'undefined') {
								var left = this.currentFocal.getBoundingClientRect().left;
								whoIsClosest = whoIsAbove.reduce(function(previousValue, currentValue){
									if(!previousValue) {
										return currentValue
									} else {
										if( Math.abs(left - currentValue.left) > Math.abs(left - previousValue.left) ) {
											return previousValue;
										}
										return currentValue
									}
								}.bind(this));
							}
							this.currentFocal = whoIsClosest.focal;
							focalChanged = true;
						}

					}

				}

				if(focalChanged) {
					if(this.currentFocal.className.indexOf('focal-container') == -1){
						this.focused.className = this.focused.className.replace('focal-active', '');
						this.currentFocal.className += ' focal-active'
						this.focused = this.currentFocal;
					} else {
						//on a new focal container
						this.focused.className = this.focused.className.replace('focal-active', '');
						this.focused = this.currentFocal;
						this.focal(sDirection);
					}
					//if focal support is mixedin
					if(this.focused.focalSupport) {
						//dispatch focused method
						this.focused.focalFocused(this.focused);
					}
				}
		},
		checkFocalContainer: function() {
				//not focused, find the closest focal container
				var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
				var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
				var currentFocal = {
					left: w
				};
				//spot right to left until you get to a container closest to 0
				for (i = 0; i < this.focalContainers.length; i++) {
					var rect = this.focalContainers[i].getBoundingClientRect();
					if(rect.left < w && rect.left < currentFocal.left) {
						currentFocal = this.focalContainers[i];
					}
				}
				this.focused = currentFocal;
		}
	});
});