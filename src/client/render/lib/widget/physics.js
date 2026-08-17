function getSize(mergedStyle) {
	let width = "auto"
	let height = "auto"

	if (mergedStyle.width !== undefined) {
		width = mergedStyle.width - 2 * mergedStyle.global_padding
		width = (width / 100) * window.innerWidth
	}

	if (mergedStyle.height !== undefined) {
		height = mergedStyle.height - 2 * mergedStyle.global_padding
		height = (height / 100) * window.innerHeight
	}

	const horizontalPadding =
		(mergedStyle.widget_padding / 100) * window.innerWidth
	const verticalPadding =
		(mergedStyle.widget_padding / 100) * window.innerHeight

	const padding = mergedStyle.widget_wrapping
		? `${verticalPadding} ${horizontalPadding}`
		: `0`

	const WidgetSize = {
		width,
		height,
		fontSize: `${mergedStyle.font_size}vmin`,
		padding
	}

	return WidgetSize
}

function getLayoutOffset(widget, widgetLayout, mergedStyle) {
	const vh = window.innerHeight / 100
	// const vw = window.innerWidth / 100
	let layoutOffset = 0
	const offsetMargin = mergedStyle.widget_offset

	if (widgetLayout.length > 1) {
		// Find own index
		const index = widgetLayout.indexOf(widget)

		// Get the height of all widgets + margin prior to this one
		let priorOffset = 0
		let afterOffset = 0

		// Loop over all widgets in layout
		for (var i = 0; i < widgetLayout.length; i++) {
			const element = document.getElementById(widgetLayout[i].id)
			// If the element can't be found yet, something must be wrong with the DOM
			if (!element) {
				console.error(
					"Unable to calculate layout offset because element with ID " +
						widgetLayout[i].id +
						" doesn't exist yet"
				)
				continue
			}
			const heightOfIndexEl = element.offsetHeight
			const indexElVH = heightOfIndexEl / vh
			if (i < index) {
				priorOffset += indexElVH + Number(offsetMargin)
			} else if (i > index) {
				afterOffset += indexElVH + Number(offsetMargin)
			}
		}

		const offsetCalc = {
			top() {
				layoutOffset = priorOffset
			},
			center() {
				layoutOffset = -(afterOffset / 2)
				layoutOffset += priorOffset / 2
			},
			bottom() {
				layoutOffset = -afterOffset
			}
		}

		offsetCalc[mergedStyle.vertical_position]()
	}

	if (!mergedStyle.widget_repositioning) layoutOffset = 0

	return layoutOffset
}

function getPosition(mergedStyle, widget, index, widgetLayout) {
	// POSITIONING
	let xPercent, yPercent, x, y

	const globalPadding = Number(mergedStyle.global_padding) || 0
	const xPos = mergedStyle.horizontal_position
	const yPos = mergedStyle.vertical_position

	x = 100
	y = 100
	xPercent = 0
	yPercent = 0
	const xOffset = Number(mergedStyle.horizontal_offset) || 0
	const yOffset = Number(mergedStyle.vertical_offset) || 0

	if (yPos === "top") {
		y = y - 100 + globalPadding
	}
	if (yPos === "center") {
		y = y - 50
		yPercent = -50
	}
	if (yPos === "bottom") {
		y = y - globalPadding
		yPercent = -100
	}
	if (xPos === "left") {
		x = x - 100 + globalPadding
	}
	if (xPos === "center") {
		x = x - 50
		xPercent = -50
	}
	if (xPos === "right") {
		x = x - globalPadding
		xPercent = -100
	}

	// console.log(getLayoutOffset(widget, widgetLayout, widgetComponents))
	y = y + getLayoutOffset(widget, widgetLayout, mergedStyle)

	// ADD LAYOUT OFFSET
	// y = y + mergedStyle.widget_offset

	// ADD OFFSETS
	x = x + xOffset
	y = y + yOffset
	x = `${x}`
	y = `${y}`

	// Because GSAP has big issues with viewport
	x = (x / 100) * window.innerWidth
	y = (y / 100) * window.innerHeight

	const WidgetPos = {
		x,
		y,
		xPercent,
		yPercent,
		zIndex: -(index * 100) || 0
	}

	return WidgetPos
}

export { getSize, getPosition }
