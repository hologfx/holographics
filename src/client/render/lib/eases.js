// eslint-disable-next-line no-unused-vars
import {
	Linear,
	Sine,
	Quad,
	Cubic,
	Quart,
	Quint,
	Expo,
	Circ,
	Bounce,
	Elastic,
	Back
} from "gsap"
import { SlowMo } from "gsap/EasePack"

export default {
	Linear: {
		enter: Linear.easeNone,
		leave: Linear.easeNone,
		reposition: Linear.easeNone,
		update: Linear.easeNone
	},
	Sine: {
		enter: Sine.easeOut,
		leave: Sine.easeIn,
		reposition: Sine.easeInOut,
		update: Sine.easeInOut
	},
	Quad: {
		enter: Quad.easeOut,
		leave: Quad.easeIn,
		reposition: Quad.easeInOut,
		update: Quad.easeInOut
	},
	Cubic: {
		enter: Cubic.easeOut,
		leave: Cubic.easeIn,
		reposition: Cubic.easeInOut,
		update: Cubic.easeInOut
	},
	Quart: {
		enter: Quart.easeOut,
		leave: Quart.easeIn,
		reposition: Quart.easeInOut,
		update: Quart.easeInOut
	},
	Quint: {
		enter: Quint.easeOut,
		leave: Quint.easeIn,
		reposition: Quint.easeInOut,
		update: Quint.easeInOut
	},
	Expo: {
		enter: Expo.easeOut,
		leave: Expo.easeIn,
		reposition: Expo.easeInOut,
		update: Expo.easeInOut
	},
	Circ: {
		enter: Circ.easeOut,
		leave: Circ.easeIn,
		reposition: Circ.easeInOut,
		update: Circ.easeInOut
	},
	SlowMo: {
		enter: SlowMo.ease,
		leave: SlowMo.ease,
		reposition: SlowMo.ease,
		update: SlowMo.ease
	},
	Bounce: {
		enter: Bounce.easeOut,
		leave: Bounce.easeOut,
		reposition: Bounce.easeOut,
		update: Bounce.easeOut
	},
	Elastic: {
		enter: Elastic.easeOut,
		leave: Elastic.easeOut,
		reposition: Elastic.easeOut,
		update: Elastic.easeOut
	},
	Back: {
		enter: Back.easeOut,
		leave: Back.easeOut,
		reposition: Back.easeOut,
		update: Back.easeInOut
	}
}
