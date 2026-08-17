module.exports = {
	name: "Particles",
	description: "Shows colored particles on-screen.",
	category: "Background",
	icon: "bolt",
	hasEntries: false,
	selfPositioning: true,
	selfSizing: true,
	selfWrapping: true,
	default: {
		style: {
			widget_wrapping: false,
			widget_padding: 0
		},
		props: {
			particle_count: 90,
			particle_size: 5,
			particle_size_random: true,
			particle_animate_size: true,
			particle_animate_size_speed: 4,
			particle_animate_opacity: true,
			particle_animate_opacity_speed: 1,
			form_lines: true,
			line_distance: 100,
			line_width: 4,
			movement_enable: true,
			movement_straight: false,
			movement_direction: "none",
			movement_speed: 2,
			movement_bounce: "out",
			movement_random: true,
			particle_color: "text_a",
			line_color: "primary_color",
			retina_enable: false
		}
	},
	props: [
		{
			name: "particle_count",
			description: "Number of particles",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "particle_size",
			description: "Particle size",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "particle_size_random",
			description: "Particle size should be randomly assigned",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Random",
					value: true
				},
				{
					name: "Not random",
					value: false
				}
			]
		},
		{
			name: "particle_animate_size",
			description: "Particles animate their size",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Enable",
					value: true
				},
				{
					name: "Disable",
					value: false
				}
			]
		},
		{
			name: "particle_animate_size_speed",
			description: "Speed at which particles animate size (seconds)",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "particle_animate_opacity",
			description: "Particles animate their opacity",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Enable",
					value: true
				},
				{
					name: "Disable",
					value: false
				}
			]
		},
		{
			name: "particle_animate_opacity_speed",
			description: "Speed at which particles animate their opacity (seconds)",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "movement_enable",
			description: "Particles should move",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Move",
					value: true
				},
				{
					name: "Static",
					value: false
				}
			]
		},
		{
			name: "movement_straight",
			description: "Particles only move in a straight line",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Straight",
					value: true
				},
				{
					name: "Organic",
					value: false
				}
			]
		},
		{
			name: "movement_direction",
			description: "Movement direction",
			requires_refresh: true,
			type: "Select",
			options: [
				{
					name: "None",
					value: "none"
				},
				{
					name: "Top",
					value: "top"
				},
				{
					name: "Top-right",
					value: "top-right"
				},
				{
					name: "Right",
					value: "right"
				},
				{
					name: "Bottom-right",
					value: "bottom-right"
				},
				{
					name: "Bottom",
					value: "bottom"
				},
				{
					name: "Bottom-left",
					value: "bottom-left"
				},
				{
					name: "Left",
					value: "left"
				},
				{
					name: "Top-left",
					value: "top-left"
				}
			]
		},
		{
			name: "movement_speed",
			description: "Movement speed",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "movement_random",
			description: "Add random factors to the movement of the particles",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Random",
					value: true
				},
				{
					name: "Not random",
					value: false
				}
			]
		},
		{
			name: "movement_bounce",
			description: "Particles should bounce against the edge of the screen",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Leave",
					value: "out"
				},
				{
					name: "Bounce",
					value: "bounce"
				}
			]
		},
		{
			name: "form_lines",
			description: "Particles form lines between them",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Lines",
					value: true
				},
				{
					name: "No lines",
					value: false
				}
			]
		},
		{
			name: "line_distance",
			description: "Maximum distance lines will form",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "line_width",
			description: "Line width",
			requires_refresh: true,
			type: "Number"
		},
		{
			name: "particle_color",
			description: "What color variable should be used for the particle color?",
			requires_refresh: true,
			type: "Select",
			options: [
				{
					name: "Primary Color",
					value: "primary_color"
				},
				{
					name: "Secondary Color",
					value: "secondary_color"
				},
				{
					name: "Text A",
					value: "text_a"
				}
			]
		},
		{
			name: "line_color",
			description:
				"What color variable should be used for the color of the lines?",
			requires_refresh: true,
			type: "Select",
			options: [
				{
					name: "Primary Color",
					value: "primary_color"
				},
				{
					name: "Secondary Color",
					value: "secondary_color"
				},
				{
					name: "Text A",
					value: "text_a"
				}
			]
		},
		{
			name: "retina_enable",
			description:
				"Render particles at retina level (when used on Mac systems)",
			requires_refresh: true,
			type: "Radio",
			options: [
				{
					name: "Retina",
					value: true
				},
				{
					name: "Normal",
					value: false
				}
			]
		}
	],
	vue_template: '<div class="particles" ref="particles"></div>',
	vue_component: getFile("component.js").toString(),
	include: getFile("particles.js").toString(),
	css: renderStylus(getFile("style.styl").toString())
}
