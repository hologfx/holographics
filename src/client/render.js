import "core-js"
// Core libraries
import Vue from "vue"
import VueSocketIO from "vue-socket.io"

import Render from "./render/Render.vue"
import store from "./store"
import VueRouter from "vue-router"

// Animations
import { gsap } from "gsap"
import { ExpoScaleEase, RoughEase, SlowMo } from "gsap/EasePack"
import { CSSRulePlugin } from "gsap/CSSRulePlugin"
import { TextPlugin } from "gsap/TextPlugin"
import { Physics2DPlugin } from "gsap/Physics2DPlugin"
import { PhysicsPropsPlugin } from "gsap/PhysicsPropsPlugin"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { SplitText } from "gsap/SplitText"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"

import Eases from "./render/lib/eases"

import { Flip } from "gsap/Flip"

const router = new VueRouter({
	mode: "history",
	routes: []
})

gsap.registerPlugin(
	CSSRulePlugin,
	TextPlugin,
	Physics2DPlugin,
	PhysicsPropsPlugin,
	ScrambleTextPlugin,
	SplitText,
	ExpoScaleEase,
	RoughEase,
	SlowMo,
	Flip,
	MotionPathPlugin,
	DrawSVGPlugin
)

window.Eases = Eases
window.gsap = gsap
window.Flip = Flip
window.SplitText = SplitText
window.moment = require("moment")
window.Color = require("color")
window.$ = $

Vue.use(VueRouter)
Vue.use(
	new VueSocketIO({
		debug: true,
		connection: window.location.origin,
		vuex: {
			store,
			actionPrefix: "SOCKET_",
			mutationPrefix: "SOCKET_"
		}
	})
)

window.EventBus = new Vue()

document.addEventListener("DOMContentLoaded", function() {
	// eslint-disable-next-line no-new
	new Vue({
		el: "#render",
		store,
		router,
		render: h => h(Render)
	})
})
